#!/usr/bin/env python3
"""Parallel experiment runner - spawns 20 agents (10 React + 10 Vanilla JS)."""

import subprocess
import sys
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path

WORKDIR = Path(__file__).parent
CSV_FILE = WORKDIR / "experiment_results.csv"


def init_csv():
    """Initialize CSV file with header."""
    header = "run_id,variant,start_time_iso,end_time_iso,duration_seconds,turns,input_tokens,output_tokens,cache_read_tokens,cache_creation_tokens,total_tokens,cost_usd,build_success,notes"
    with open(CSV_FILE, "w") as f:
        f.write(header + "\n")


def run_single_agent(args: tuple) -> str:
    """Run a single agent as subprocess."""
    variant, run_id = args
    try:
        result = subprocess.run(
            [sys.executable, str(WORKDIR / "run_agent.py"), variant, str(run_id)],
            capture_output=True,
            text=True,
            timeout=600  # 10 min timeout
        )
        output = result.stdout + result.stderr
        return f"{variant} {run_id}: {output.strip()}"
    except subprocess.TimeoutExpired:
        return f"{variant} {run_id}: TIMEOUT"
    except Exception as e:
        return f"{variant} {run_id}: ERROR - {str(e)}"


def main():
    print("Initializing CSV...")
    init_csv()

    # Create tasks: 10 react + 10 vanilla
    tasks = []
    for i in range(1, 11):
        tasks.append(("react", i))
        tasks.append(("vanilla", i))

    print(f"Launching {len(tasks)} agents in parallel...")

    # Run all agents in parallel
    with ProcessPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(run_single_agent, task): task for task in tasks}

        for future in as_completed(futures):
            result = future.result()
            print(result)

    print(f"\nExperiment complete. Results in: {CSV_FILE}")


if __name__ == "__main__":
    main()
