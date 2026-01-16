#!/usr/bin/env python3
"""Single agent runner with token tracking using Anthropic SDK."""

import os
import sys
import json
import subprocess
import fcntl
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
import anthropic

load_dotenv()

WORKDIR = Path(__file__).parent
CSV_FILE = WORKDIR / "experiment_results.csv"
MODEL = "claude-opus-4-5-20251101"

# Pricing per million tokens (USD) - Opus 4.5
PRICE_INPUT = 15.0
PRICE_OUTPUT = 75.0

TOOLS = [
    {
        "name": "write_file",
        "description": "Write content to a file. Creates parent directories if needed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path relative to workdir"},
                "content": {"type": "string", "description": "File content"}
            },
            "required": ["path", "content"]
        }
    },
    {
        "name": "read_file",
        "description": "Read content from a file.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path relative to workdir"}
            },
            "required": ["path"]
        }
    },
    {
        "name": "bash",
        "description": "Run a bash command. Use for npm install, npm run dev, etc.",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {"type": "string", "description": "Command to execute"}
            },
            "required": ["command"]
        }
    },
    {
        "name": "list_directory",
        "description": "List files in a directory.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Directory path relative to workdir"}
            },
            "required": ["path"]
        }
    }
]


def execute_tool(name: str, args: dict) -> str:
    """Execute a tool and return result."""
    try:
        if name == "write_file":
            path = WORKDIR / args["path"]
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(args["content"])
            return f"Wrote {len(args['content'])} bytes to {args['path']}"

        elif name == "read_file":
            path = WORKDIR / args["path"]
            if not path.exists():
                return f"Error: File not found: {args['path']}"
            return path.read_text()

        elif name == "bash":
            result = subprocess.run(
                args["command"],
                shell=True,
                cwd=WORKDIR,
                capture_output=True,
                text=True,
                timeout=300
            )
            output = result.stdout + result.stderr
            return output[:10000] if len(output) > 10000 else output

        elif name == "list_directory":
            path = WORKDIR / args["path"]
            if not path.exists():
                return f"Error: Directory not found: {args['path']}"
            files = [f.name for f in path.iterdir()]
            return "\n".join(sorted(files))

        else:
            return f"Unknown tool: {name}"
    except Exception as e:
        return f"Error: {str(e)}"


def run_agent(variant: str, run_id: int) -> dict:
    """Run agent for given variant and return metrics."""
    client = anthropic.Anthropic()

    # Load plan
    plan_file = "react_plan.md" if variant == "react" else "vanillajs_plan.md"
    plan_path = WORKDIR / "docs" / plan_file
    plan_content = plan_path.read_text()

    # Folder name
    folder = f"{variant}app{run_id}" if variant == "react" else f"vanillajsapp{run_id}"

    prompt = f"""Implement {folder} per the plan below.

Steps:
1. Create {folder}/ folder
2. Implement all files per the plan
3. Run npm install
4. Verify app can build (npm run build or check for errors)

Be EXTREMELY concise. Just implement, don't explain.

PLAN:
{plan_content}"""

    messages = [{"role": "user", "content": prompt}]

    start_time = datetime.now(timezone.utc)
    total_input_tokens = 0
    total_output_tokens = 0
    total_cache_read = 0
    total_cache_creation = 0
    turns_used = 0
    build_success = False

    # Agent loop
    max_turns = 50
    for turn in range(max_turns):
        turns_used += 1
        response = client.messages.create(
            model=MODEL,
            max_tokens=8192,
            tools=TOOLS,
            messages=messages
        )

        # Track tokens
        total_input_tokens += response.usage.input_tokens
        total_output_tokens += response.usage.output_tokens
        total_cache_read += getattr(response.usage, 'cache_read_input_tokens', 0) or 0
        total_cache_creation += getattr(response.usage, 'cache_creation_input_tokens', 0) or 0

        # Check for tool use
        tool_uses = [b for b in response.content if b.type == "tool_use"]

        if not tool_uses:
            # No more tool calls, agent done
            break

        # Execute tools and add results
        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for tool_use in tool_uses:
            result = execute_tool(tool_use.name, tool_use.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": result
            })

        messages.append({"role": "user", "content": tool_results})

        if response.stop_reason == "end_turn":
            break

    end_time = datetime.now(timezone.utc)
    duration = (end_time - start_time).total_seconds()

    # Verify build success
    try:
        result = subprocess.run(
            f"cd {folder} && npm run build",
            shell=True,
            cwd=WORKDIR,
            capture_output=True,
            text=True,
            timeout=120
        )
        build_success = result.returncode == 0
    except Exception:
        build_success = False

    cost_usd = (total_input_tokens * PRICE_INPUT + total_output_tokens * PRICE_OUTPUT) / 1_000_000

    return {
        "run_id": run_id,
        "variant": variant,
        "start_time_iso": start_time.isoformat().replace("+00:00", "Z"),
        "end_time_iso": end_time.isoformat().replace("+00:00", "Z"),
        "duration_seconds": int(duration),
        "turns": turns_used,
        "input_tokens": total_input_tokens,
        "output_tokens": total_output_tokens,
        "cache_read_tokens": total_cache_read,
        "cache_creation_tokens": total_cache_creation,
        "total_tokens": total_input_tokens + total_output_tokens,
        "cost_usd": round(cost_usd, 4),
        "build_success": build_success,
        "notes": ""
    }


def append_to_csv(row: dict):
    """Append row to CSV with file locking."""
    header = "run_id,variant,start_time_iso,end_time_iso,duration_seconds,turns,input_tokens,output_tokens,cache_read_tokens,cache_creation_tokens,total_tokens,cost_usd,build_success,notes"
    line = f"{row['run_id']},{row['variant']},{row['start_time_iso']},{row['end_time_iso']},{row['duration_seconds']},{row['turns']},{row['input_tokens']},{row['output_tokens']},{row['cache_read_tokens']},{row['cache_creation_tokens']},{row['total_tokens']},{row['cost_usd']},{row['build_success']},{row['notes']}"

    with open(CSV_FILE, "a") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            # Check if file is empty and write header
            if CSV_FILE.stat().st_size == 0:
                f.write(header + "\n")
            f.write(line + "\n")
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)


def main():
    if len(sys.argv) != 3:
        print("Usage: run_agent.py <variant> <run_id>")
        print("  variant: react or vanilla")
        print("  run_id: integer (1-10)")
        sys.exit(1)

    variant = sys.argv[1]
    run_id = int(sys.argv[2])

    if variant not in ("react", "vanilla"):
        print(f"Invalid variant: {variant}")
        sys.exit(1)

    print(f"Starting {variant} run {run_id}...")
    metrics = run_agent(variant, run_id)
    append_to_csv(metrics)
    status = "OK" if metrics['build_success'] else "FAILED"
    print(f"[{status}] {metrics['duration_seconds']}s, {metrics['turns']} turns, {metrics['total_tokens']} tokens, ${metrics['cost_usd']}")


if __name__ == "__main__":
    main()
