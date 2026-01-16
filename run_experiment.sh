#!/bin/bash

# Experiment: 20 parallel todo app implementations (10 React + 10 Vanilla JS)
# Measures wall-clock time including npm install

WORKDIR="$(pwd)"
CSV_FILE="$WORKDIR/experiment_results.csv"

# Initialize CSV if doesn't exist
if [ ! -f "$CSV_FILE" ]; then
  echo "run_id,variant,start_time_iso,end_time_iso,duration_seconds,notes" > "$CSV_FILE"
fi

echo "Launching 20 parallel implementations..."
echo "Results will be written to: $CSV_FILE"

# Launch React implementations (1-10)
for i in {1..10}; do
  osascript -e "tell application \"Terminal\" to do script \"cd '$WORKDIR' && claude --dangerously-skip-permissions 'Implement reactapp$i per docs/react_plan.md. Steps: 1) Record start_time_iso now 2) Create reactapp$i/ folder 3) Implement all files 4) Run npm install 5) Verify app renders 6) Record end_time_iso 7) Append to experiment_results.csv using: flock experiment_results.csv -c \\\"echo row >> experiment_results.csv\\\" with run_id=$i, variant=react, duration_seconds computed. Be EXTREMELY concise.'\""
done

# Launch Vanilla JS implementations (1-10)
for i in {1..10}; do
  osascript -e "tell application \"Terminal\" to do script \"cd '$WORKDIR' && claude --dangerously-skip-permissions 'Implement vanillajsapp$i per docs/vanillajs_plan.md. Steps: 1) Record start_time_iso now 2) Create vanillajsapp$i/ folder 3) Implement all files 4) Run npm install 5) Verify app renders 6) Record end_time_iso 7) Append to experiment_results.csv using: flock experiment_results.csv -c \\\"echo row >> experiment_results.csv\\\" with run_id=$i, variant=vanilla, duration_seconds computed. Be EXTREMELY concise.'\""
done

echo "All 20 tabs launched. Monitor progress in Terminal windows."
echo "Results will accumulate in experiment_results.csv"
