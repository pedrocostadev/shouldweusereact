---
name: Implementation Timing Experiment
overview: Run 10 React and 10 Vanilla JS implementations using the plan docs, measure wall-clock time and token usage per run.
---

# Implementation Timing Experiment

## Goal

Compare React vs Vanilla JS implementation efficiency by measuring wall-clock time and API token usage across 20 parallel runs.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install anthropic python-dotenv
echo "ANTHROPIC_API_KEY=sk-..." > .env
```

## Run Experiment

```bash
# Single run
python3 run_agent.py react 1

# Full experiment (20 parallel)
python3 run_experiment.py
```

## Source Plans

- `docs/react_plan.md`
- `docs/vanillajs_plan.md`
- `docs/design.png`

## Output

Results in `experiment_results.csv`:

```
run_id,variant,start_time_iso,end_time_iso,duration_seconds,input_tokens,output_tokens,notes
```
