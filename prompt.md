---
name: Implementation Timing Experiment
overview: Run 10 React and 10 Vanilla JS implementations using the plan docs, measure wall-clock time per run, and save results to a CSV file.
---

# Implementation Timing Experiment Prompt

## Goal

Implement the todo app plans 10 times for React and 10 times for Vanilla JS, measure how long each implementation takes, and save the results to a CSV file.

## Source Plans

- React plan: `docs/react_plan.md`
- Vanilla JS plan: `docs/vanillajs_plan.md`
- Design reference: `docs/design.png`

## Runs

- React: 10 independent implementations
- Vanilla JS: 10 independent implementations

Each run should be treated as a fresh implementation attempt following the plan and design reference.

## Timing Rules

- Measure wall-clock time for each run from the moment you start implementing until the implementation is complete.
- Include all coding work required by the plan.
- Record time in seconds.

## Output

Save results to `experiment_results.csv` at the repo root with the following columns:

```
run_id,variant,start_time_iso,end_time_iso,duration_seconds,notes
```

Where:
- `run_id` is 1-10 for each variant.
- `variant` is `react` or `vanilla`.
- `start_time_iso` and `end_time_iso` use ISO 8601 timestamps.
- `duration_seconds` is a number (integer or decimal).
- `notes` is optional and can be empty.

## Execution Checklist

For each run:

1. Read the correct plan (`docs/react_plan.md` or `docs/vanillajs_plan.md`).
2. Implement according to the plan and `docs/design.png`.
3. Capture start/end timestamps and duration.
4. Append a row to `experiment_results.csv`.

## CSV Example

```
run_id,variant,start_time_iso,end_time_iso,duration_seconds,notes
1,react,2026-01-16T14:03:12Z,2026-01-16T14:28:45Z,1533.0,
1,vanilla,2026-01-16T15:01:02Z,2026-01-16T15:24:50Z,1428.0,
```
