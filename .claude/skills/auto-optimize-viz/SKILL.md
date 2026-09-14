---
description: Use when the user wants to run continuous chart hardening — repeatedly picks the least recently introspected nimbus-viz chart and runs /chart:introspect on it until stopped
---

# Auto-Optimize Viz

Continuously introspect and harden `packages/nimbus-viz` chart components,
one at a time. This is the nimbus-viz counterpart to the personal
`auto-optimize` skill (which drives `/component:introspect` over
`grayce-ui`) — same shape, adapted to this repo's actual state.

## What This Does

1. Find the next chart to introspect (priority seed first, then least
   recently introspected).
2. Run `/chart:introspect` on it.
3. Repeat from step 1, indefinitely, until the user stops you.

## How to Run

### Step 0 — Kill any orphaned browser processes

`/chart:introspect` runs `packages/nimbus-viz`'s Storybook tests in headless
Chromium via Playwright. Before starting the first iteration, and after every
iteration, clear out anything left over from a previous run:

```bash
pkill -f "chromium" 2>/dev/null || true
pkill -f "playwright" 2>/dev/null || true
pkill -f "storybook" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
```

Report how many processes (if any) were killed.

### Step 1 — Find the next chart

**Priority seed (first pass only).** `packages/nimbus-viz/TODO.md`'s `E5`
item names an explicit priority order — quote it exactly, don't re-derive it:
_"E5 — core-6 depth. Converge states / interaction / dense-data + label-
collision polish + a full story/spec matrix on the core-6 (line, stacked-
area, bar, stacked-bar, stat-card + bullet, funnel, cohort-triangle/heatmap)."_
That names nine components: `LineChart`, `StackedAreaChart`, `BarChart`,
`StackedBarChart`, `StatCard`, `BulletChart`, `FunnelChart`,
`CohortTriangle`, `Heatmap`. Work through this list in the order given,
skipping any chart whose `.stories.tsx` already has a real `play` function
(i.e. has already been through `/chart:introspect`).

**Once the seed list is exhausted** (or on any later cycle), fall back to the
same mechanism `auto-optimize` uses for grayce-ui — least recently touched
wins:

```bash
find packages/nimbus-viz/src/components -name "*.stories.tsx" \
  | while read f; do echo "$(stat -f %m "$f") $f"; done \
  | sort -n | head -1 | awk '{print $2}'
```

This returns a path like `.../src/components/treemap/treemap.stories.tsx`.
Extract the component name from the directory (e.g. `treemap`).

Announce: **"Next: `<ChartName>` (\<reason: next seed item / least recently
introspected\>)"**

### Step 2 — Run introspect on it

Invoke `/chart:introspect` with the chart name.

`/chart:introspect` itself decides, per its own Step 8, whether to commit. If
a verification gate fails there, it leaves the chart staged and stops rather
than committing broken work — treat that as **this loop's stopping
condition** too: report the failure and stop, don't skip to the next chart.
A broken chart needs a human before another one gets layered on top of it.

### Step 3 — Clean up browser processes

Same commands as Step 0. Non-fatal if nothing is running.

### Step 4 — Loop

Go back to Step 1. Do **not** ask for confirmation between iterations. Do
**not** stop between charts unless the user tells you to, or unless Step 2
hit a gate failure.

**Before starting a fresh run of this loop, check `packages/nimbus-viz/TODO.md`'s
`E6`.** It was open as of the first `/chart:introspect` pilot (`bar-chart`) —
an `isolate: false` test-infra issue that fails the verification gate on
essentially every chart once its stories include more than ~2 real chart
instances, independent of that chart's own quality. If `E6` is still open,
running this loop unattended means every iteration hits the same wall and
stops (per `/chart:introspect`'s own gate-failure behavior) rather than
making progress — check with the user before burning a cycle on a chart that
was only ever going to stall on a known, unrelated issue.

## Stopping

The user stops you by pressing Ctrl+C, typing a message, or closing the
session. If interrupted mid-chart, finish the current step cleanly before
stopping.

## Notes

- All ~46 chart `.stories.tsx` files were written in the same initial commit,
  so their mtimes are nearly identical until `/chart:introspect` starts
  rewriting them — this is exactly why the priority seed list matters for the
  first several picks; without it the fallback's "least recently modified"
  would be effectively arbitrary among untouched charts.
- After `/chart:introspect` runs, that chart's `.stories.tsx` (and `.tsx`,
  `.mdx`) get fresh timestamps, so the next iteration naturally picks a
  different chart — same self-correcting property as `auto-optimize`.
- Each chart should only be picked once per full cycle through all ~46.
- This skill lives in the repo (not in `~/.claude/skills/`, unlike the
  personal `auto-optimize`) because it operates entirely on
  `packages/nimbus-viz` and is useful to anyone working on this repo, not
  just this user's own machine.
