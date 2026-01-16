# Should We Use React in 2026?

An experiment comparing AI efficiency when building identical apps with React vs Vanilla JavaScript.

## Results

| Metric | React | Vanilla JS | Δ |
|--------|-------|------------|---|
| Duration | 57.7s | 63.0s | -8.4% |
| Output Tokens | 5,240 | 6,281 | -16.6% |
| Cost | $0.79 | $0.97 | -18.7% |

React was faster, cheaper, and more token-efficient in every run.

## Read the Full Article

**[Should We Use React in 2026?](https://pedrocostadev.substack.com/p/should-we-use-react-in-2026)**

## Methodology

- 10 runs per variant (20 total)
- Same Todo app spec for both
- Claude Opus 4.5 via Anthropic API
- All runs in parallel
- Build verified with `npm run build`

## Files

- `experiment_results.csv` — Raw data from all 20 runs
- `comparison_table.csv` — Summary metrics
- `charts/` — Visualizations
- `docs/` — Implementation plans for each variant
- `run_experiment.py` — Experiment harness
- `create_charts.py` — Chart generation

## Run It Yourself

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install anthropic python-dotenv
echo "ANTHROPIC_API_KEY=sk-..." > .env
python3 run_experiment.py
```

## License

MIT
