#!/usr/bin/env python3
"""Generate charts for experiment results."""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read data
df = pd.read_csv('experiment_results.csv')

# Set style
plt.style.use('seaborn-v0_8-whitegrid')
colors = {'react': '#61DAFB', 'vanilla': '#F7DF1E'}

# Create output directory
import os
os.makedirs('charts', exist_ok=True)

# 1. Duration comparison (bar chart)
fig, ax = plt.subplots(figsize=(8, 5))
react_dur = df[df['variant'] == 'react']['duration_seconds']
vanilla_dur = df[df['variant'] == 'vanilla']['duration_seconds']

x = np.arange(2)
bars = ax.bar(x, [react_dur.mean(), vanilla_dur.mean()],
              color=[colors['react'], colors['vanilla']],
              edgecolor='black', linewidth=1.2)
ax.errorbar(x, [react_dur.mean(), vanilla_dur.mean()],
            yerr=[react_dur.std(), vanilla_dur.std()],
            fmt='none', color='black', capsize=5)

ax.set_xticks(x)
ax.set_xticklabels(['React', 'Vanilla JS'], fontsize=12)
ax.set_ylabel('Duration (seconds)', fontsize=12)
ax.set_title('Average Build Duration', fontsize=14, fontweight='bold')
ax.set_ylim(0, 90)

for bar, val in zip(bars, [react_dur.mean(), vanilla_dur.mean()]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
            f'{val:.1f}s', ha='center', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.savefig('charts/duration_comparison.png', dpi=150)
plt.close()

# 2. Token usage comparison (grouped bar)
fig, ax = plt.subplots(figsize=(10, 5))

react_data = df[df['variant'] == 'react']
vanilla_data = df[df['variant'] == 'vanilla']

metrics = ['input_tokens', 'output_tokens', 'total_tokens']
labels = ['Input Tokens', 'Output Tokens', 'Total Tokens']
x = np.arange(len(metrics))
width = 0.35

react_vals = [react_data[m].mean() for m in metrics]
vanilla_vals = [vanilla_data[m].mean() for m in metrics]

bars1 = ax.bar(x - width/2, react_vals, width, label='React',
               color=colors['react'], edgecolor='black')
bars2 = ax.bar(x + width/2, vanilla_vals, width, label='Vanilla JS',
               color=colors['vanilla'], edgecolor='black')

ax.set_xticks(x)
ax.set_xticklabels(labels, fontsize=11)
ax.set_ylabel('Tokens', fontsize=12)
ax.set_title('Token Usage Comparison', fontsize=14, fontweight='bold')
ax.legend()

ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'{x/1000:.0f}K'))

plt.tight_layout()
plt.savefig('charts/token_comparison.png', dpi=150)
plt.close()

# 3. Cost comparison (bar chart)
fig, ax = plt.subplots(figsize=(8, 5))
react_cost = df[df['variant'] == 'react']['cost_usd']
vanilla_cost = df[df['variant'] == 'vanilla']['cost_usd']

x = np.arange(2)
bars = ax.bar(x, [react_cost.mean(), vanilla_cost.mean()],
              color=[colors['react'], colors['vanilla']],
              edgecolor='black', linewidth=1.2)
ax.errorbar(x, [react_cost.mean(), vanilla_cost.mean()],
            yerr=[react_cost.std(), vanilla_cost.std()],
            fmt='none', color='black', capsize=5)

ax.set_xticks(x)
ax.set_xticklabels(['React', 'Vanilla JS'], fontsize=12)
ax.set_ylabel('Cost (USD)', fontsize=12)
ax.set_title('Average Cost per Run', fontsize=14, fontweight='bold')
ax.set_ylim(0, 1.4)

for bar, val in zip(bars, [react_cost.mean(), vanilla_cost.mean()]):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.03,
            f'${val:.2f}', ha='center', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.savefig('charts/cost_comparison.png', dpi=150)
plt.close()

# 4. Individual runs scatter plot
fig, ax = plt.subplots(figsize=(10, 5))

react_data = df[df['variant'] == 'react']
vanilla_data = df[df['variant'] == 'vanilla']

ax.scatter(react_data['duration_seconds'], react_data['total_tokens'],
           s=100, c=colors['react'], edgecolor='black', label='React', alpha=0.8)
ax.scatter(vanilla_data['duration_seconds'], vanilla_data['total_tokens'],
           s=100, c=colors['vanilla'], edgecolor='black', label='Vanilla JS', alpha=0.8)

ax.set_xlabel('Duration (seconds)', fontsize=12)
ax.set_ylabel('Total Tokens', fontsize=12)
ax.set_title('Duration vs Token Usage (Each Run)', fontsize=14, fontweight='bold')
ax.legend()
ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'{x/1000:.0f}K'))

plt.tight_layout()
plt.savefig('charts/duration_vs_tokens.png', dpi=150)
plt.close()

# 5. Summary comparison (horizontal bar)
fig, ax = plt.subplots(figsize=(10, 4))

metrics = ['Duration (s)', 'Tokens (K)', 'Cost ($)']
react_vals = [react_dur.mean(), react_data['total_tokens'].mean()/1000, react_cost.mean()]
vanilla_vals = [vanilla_dur.mean(), vanilla_data['total_tokens'].mean()/1000, vanilla_cost.mean()]

# Normalize to percentages (vanilla = 100%)
react_pct = [r/v*100 for r, v in zip(react_vals, vanilla_vals)]

y = np.arange(len(metrics))
height = 0.6

bars = ax.barh(y, react_pct, height, color=colors['react'], edgecolor='black')
ax.axvline(x=100, color=colors['vanilla'], linewidth=3, linestyle='--', label='Vanilla JS (baseline)')

ax.set_yticks(y)
ax.set_yticklabels(metrics, fontsize=12)
ax.set_xlabel('Percentage (Vanilla JS = 100%)', fontsize=12)
ax.set_title('React Efficiency vs Vanilla JS', fontsize=14, fontweight='bold')
ax.set_xlim(0, 120)
ax.legend()

for bar, pct in zip(bars, react_pct):
    ax.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
            f'{pct:.0f}%', va='center', fontsize=11, fontweight='bold')

plt.tight_layout()
plt.savefig('charts/efficiency_comparison.png', dpi=150)
plt.close()

print("Charts saved to charts/ directory:")
print("  - duration_comparison.png")
print("  - token_comparison.png")
print("  - cost_comparison.png")
print("  - duration_vs_tokens.png")
print("  - efficiency_comparison.png")
