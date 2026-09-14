---
name: auto-optimize-viz
description: Use when the user wants to run continuous chart hardening — repeatedly picks the next nimbus-viz chart (demo-app usage first, then known bug-class hits, then oldest) and runs /chart:introspect on it until stopped
---

# Auto-Optimize Viz

Continuously introspect and harden `packages/nimbus-viz` chart components,
one at a time. This is the nimbus-viz counterpart to the personal
`auto-optimize` skill (which drives `/component:introspect` over
`grayce-ui`) — same shape, adapted to this repo's actual state.

## What This Does

1. Pre-flight: confirm nobody else is editing the package and the baseline
   typechecks.
2. Find the next chart (tiered pick, below).
3. Run `/chart:introspect` on it.
4. Repeat from step 2, indefinitely, until the user stops you or a stop
   condition fires.

## How to Run

### Step 0 — Pre-flight

This loop assumes it is the **single writer** to `packages/nimbus-viz`. Check
that before the first pick:

```bash
git status --porcelain -- packages/nimbus-viz      # must print nothing
pnpm --filter @commercetools/nimbus-viz typecheck  # baseline must pass
```

If the tree is dirty, stop and report: "packages/nimbus-viz has uncommitted
changes; commit or stash them before running the loop." Do not pick a chart.
If the baseline typecheck fails, stop and report the errors; a red baseline
means every pass would fail its gates for reasons unrelated to the chart.

Then kill anything left over from a previous run. `/chart:introspect` runs
the package's Storybook tests in headless Chromium via Playwright:

```bash
pkill -f "chromium" 2>/dev/null || true
pkill -f "playwright" 2>/dev/null || true
pkill -f "storybook" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
```

Report how many processes (if any) were killed. Then proceed immediately to
Step 1.

### Step 1 — Find the next chart

"Untested" below means the chart's `{chart}.stories.tsx` has no `play:`
function — it has not been through `/chart:introspect` yet.

```bash
cd packages/nimbus-viz/src/components
untested() { for d in */; do n=${d%/}; f="$n/$n.stories.tsx"; [ -f "$f" ] && ! grep -q "play:" "$f" && echo "$n"; done; }
pascal() { perl -pe 's/(^|-)([a-z])/\u$2/g'; }
```

(`untested` is a function piped into `while read`, not a variable expanded in
a `for` loop — zsh does not word-split an unquoted variable, so the `for` form
runs the whole list as one iteration.)

Pick the first non-empty tier, in this order:

**Tier 1 — untested charts the demo app renders, most-rendered first.** A
chart someone already put on a dashboard page is the one most likely to be
seen by a real person.

```bash
untested | while read -r n; do
  p=$(echo "$n" | pascal)
  c=$(grep -oE "<$p([^A-Za-z0-9]|$)" ../../../../apps/viz-dashboard/src/pages/*.tsx | wc -l | tr -d ' ')
  [ "$c" -gt 0 ] && echo "$c $n"
done | sort -rn
```

**Tier 2 — untested charts hit by a known bug class.** Run every `detect`
command in `packages/nimbus-viz/docs/bug-classes.md` (from the repo root) and
intersect the printed files with the output of `untested`. These charts have a
known silent-wrong render waiting to be asserted.

**Tier 3 — remaining untested charts, oldest stories file first.**

```bash
untested | while read -r n; do echo "$(stat -f %m "$n/$n.stories.tsx") $n"; done | sort -n
```

**Tier 4 — every chart already has a play function.** Second and later
cycles: oldest `{chart}.stories.tsx` across all charts (`ls -d */ | sed
's|/||'` in place of `untested`). Each chart is picked once per full cycle; a fresh
introspect pass rewrites its files, so its timestamp moves to the back.

Announce: **"Next: `<ChartName>` (tier N: \<reason\>)"** — e.g. "tier 1:
rendered 2× in apps/viz-dashboard, no play function" or "tier 2: BC-1 hit".

### Step 2 — Run introspect on it

Invoke `/chart:introspect` with the chart name.

`/chart:introspect` itself decides, per its own Step 8, whether to commit. If
a verification gate fails there, it leaves the chart's files in the working
tree and stops rather than committing broken work — treat that as **this
loop's stopping condition** too: report the failure and stop, don't skip to
the next chart. A broken chart needs a human before another one gets layered
on top of it.

### Step 3 — Clean up browser processes

Same `pkill` commands as Step 0. Non-fatal if nothing is running.

### Step 4 — Loop

Go back to Step 1. Do **not** ask for confirmation between iterations. Do
**not** stop between charts unless a stop condition fires.

## Stop conditions

Stop and report, without picking another chart, when:

- Step 0 finds a dirty `packages/nimbus-viz` tree or a failing baseline
  typecheck.
- A `/chart:introspect` gate fails (Step 2).
- A pass touched a shared file (`src/chart/*`, `src/theme/*`,
  `src/selection/*`, `src/stories/*`) and the whole-package `test` gate
  failed — that affects every chart, not just the one being hardened.
- The user presses Ctrl+C, types a message, or closes the session. If
  interrupted mid-chart, finish the current step cleanly before stopping.

## Notes

- The priority ordering matters most on the first cycle: the initial 46
  stories files were written in one commit with near-identical mtimes, so a
  pure "oldest first" pick would be arbitrary among untouched charts. Demo-app
  usage and known bug-class hits are the signals that make the first picks
  the ones that matter.
- Cross-chart bug classes are not fixed here one chart at a time. When a
  `detect` in `docs/bug-classes.md` prints many files, run `/chart:sweep <id>`
  first; the loop then finds those charts already fixed and spends its pass on
  docs, interaction, and the story matrix.
- This skill lives in the repo (not in `~/.claude/skills/`, unlike the
  personal `auto-optimize`) because it operates entirely on
  `packages/nimbus-viz` and is useful to anyone working on this repo, not
  just this user's own machine.
