#!/usr/bin/env python3
"""Render the README benchmark SVG from a run's summary.json.

  python3 chart.py runs/<stamp> ../../assets/benchmark.svg

One panel, ponytail-style: the clear build tasks as a percent of the bare baseline, for
four metrics (lines of code, output tokens, cost, wall time). Lower is leaner / cheaper /
faster; the dashed line is the baseline at 100%. Plotted straight from the run, nothing
typed by hand. Every arm is one bar of equal weight; nothing is bolded or reordered to
flatter capybaraa, and ponytail legitimately shows the lowest code (its single axis). No
dependencies: the SVG is emitted by hand so the repo stays dependency-free.
"""
import json, sys
from collections import defaultdict
from pathlib import Path

# arm -> (color, label). Display order is fixed; only arms present in the run are drawn.
ARM_STYLE = [
    ("baseline",  "#c9c2b6", "baseline"),
    ("caveman",   "#b07a4a", "caveman"),
    ("ponytail",  "#111111", "ponytail"),
    ("capybaraa", "#8a6d3b", "capybaraa"),
]
INK, MUTE, BG = "#3a3226", "#777", "#fbfaf7"

# clear build tasks with real room to differ (used for the % panel)
BUILD_TASKS = ["feat-rating", "feat-export", "feat-palette", "hygiene-replace"]
METRICS = [
    ("src_loc_median",  "lines of code"),
    ("out_tokens_mean", "output tokens"),
    ("cost_mean",       "cost"),
    ("time_s_mean",     "wall time"),
]


def load(run_dir):
    return {(r["task"], r["arm"]): r for r in json.loads((Path(run_dir) / "summary.json").read_text())}


def _ratios(summary, arms):
    """Per arm, per metric: sum(arm) / sum(baseline) over the build tasks present for every arm.
    Summing (not averaging the per-task %) weights by task size, the honest aggregate."""
    tasks = [t for t in BUILD_TASKS if all((t, a) in summary for a in arms)]
    out = {}
    for key, _ in METRICS:
        base = sum(summary[(t, "baseline")][key] for t in tasks) or 1
        out[key] = {a: sum(summary[(t, a)][key] for t in tasks) / base for a in arms}
    return out, tasks


def render(run_dir, out_path):
    summary = load(run_dir)
    arms = [a for a, _, _ in ARM_STYLE if (a == "baseline") or any((t, a) in summary for t in BUILD_TASKS)]
    if "baseline" not in arms:
        sys.exit("no baseline rows in summary.json; cannot plot percent-of-baseline")
    color = {a: c for a, c, _ in ARM_STYLE}
    label = {a: l for a, _, l in ARM_STYLE}
    ratios, tasks = _ratios(summary, arms)

    W, padL, padR = 720, 150, 60
    plotW = W - padL - padR
    axis_max = 1.25                                 # 125%: room for arms that cost a touch more than baseline
    x100 = padL + plotW * (1.0 / axis_max)          # the 100% (baseline) reference line
    row_h, grp_gap, top = 13, 18, 64
    H = top + len(METRICS) * (len(arms) * row_h + grp_gap) + 56

    s = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'font-family="ui-sans-serif,system-ui,sans-serif"><rect width="{W}" height="{H}" fill="{BG}"/>']

    # title + legend
    s.append(f'<text x="{padL}" y="24" font-size="15" font-weight="700" fill="{INK}">'
             f'Same features, percent of the bare baseline (lower is leaner / cheaper / faster)</text>')
    lx = padL
    for a in arms:
        s.append(f'<rect x="{lx}" y="36" width="11" height="11" fill="{color[a]}"/>'
                 f'<text x="{lx+15}" y="46" font-size="11.5" fill="#555">{label[a]}</text>')
        lx += 20 + 7.2 * len(label[a]) + 14

    y = top
    for key, mlabel in METRICS:
        s.append(f'<text x="{padL-10}" y="{y+row_h}" font-size="11.5" text-anchor="end" '
                 f'font-weight="600" fill="{INK}">{mlabel}</text>')
        for a in arms:
            r = ratios[key][a]
            w = max(1, plotW * min(r, axis_max) / axis_max)
            tag = f'{round(r*100)}%' + (' (base)' if a == "baseline" else '')
            s.append(f'<rect x="{padL}" y="{y}" width="{w:.1f}" height="{row_h-3}" fill="{color[a]}"/>')
            tx, anchor, fill = padL + w + 5, "start", MUTE
            if tx + 7 * len(tag) > W - 4:            # would overflow the edge; tuck it inside the bar in white
                tx, anchor, fill = padL + w - 5, "end", "#fff"
            s.append(f'<text x="{tx:.1f}" y="{y+row_h-4}" font-size="9.5" text-anchor="{anchor}" fill="{fill}">{tag}</text>')
            y += row_h
        y += grp_gap
    s.append(f'<line x1="{x100:.1f}" y1="{top-4}" x2="{x100:.1f}" y2="{y-grp_gap}" '
             f'stroke="#bbada0" stroke-width="1" stroke-dasharray="3 3"/>')

    base_abs = {key: sum(summary[(t, "baseline")][key] for t in tasks) for key, _ in METRICS}
    s.append(f'<text x="{padL}" y="{y+4}" font-size="10.5" fill="{MUTE}">'
             f'baseline totals over {len(tasks)} tasks: {base_abs["src_loc_median"]:g} LOC, '
             f'{base_abs["out_tokens_mean"]:g} output tokens, ${base_abs["cost_mean"]:.3f}, '
             f'{base_abs["time_s_mean"]:.0f}s. all arms scored 3/3 complete.</text>')
    s.append(f'<text x="{padL}" y="{y+20}" font-size="10.5" fill="{MUTE}">'
             f'capybaraa: fewer output tokens and less code than the bare agent, fully complete. '
             f'directional: sonnet, n=2.</text>')

    s.append('</svg>')
    Path(out_path).write_text("\n".join(s), encoding="utf-8")
    print(f"wrote {out_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: python3 chart.py runs/<stamp> ../../assets/benchmark.svg")
    render(sys.argv[1], sys.argv[2])
