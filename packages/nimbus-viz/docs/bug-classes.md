# nimbus-viz — known bug classes

Recurring bug patterns found while hardening charts. Each row is a pattern that
has produced a real, silent-wrong render in at least one chart and can plausibly
recur in others. `/chart:introspect` runs every `detect` command against the
chart it audits (its Step 1); `/chart:sweep <id>` fixes one row across every
chart it hits. The generic invariant test
(`src/selection/registry-invariants.spec.tsx`) cites these ids in its
`KNOWN_GAPS` allowlist.

## Rules

- **When to add a row.** A finding goes here, in the same commit as the fix,
  when it could apply to another chart. A finding specific to one chart goes to
  that chart's `.mdx` "Limitations" or its stories. A roadmap gap goes to
  `TODO.md`.
- **`detect` must be runnable.** Copy-paste from the repo root; it prints file
  paths, or nothing. Write `manual:` only when no grep can express the check.
- **Fixed does not mean deleted.** Keep the row; its `detect` is the regression
  guard. Record progress under "Status".
- **Plausibility** follows `/chart:introspect` Lens E2: a Silent-wrong render on
  plausible input is at least 🟡, and 🔴 the more plausible the input.

## Classes

| id   | class                                         | detect (run from repo root)                                                                                                                                                     | plausible when                                      | fix pattern                                                                                                           | first found                 |
| ---- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| BC-1 | band scale keyed by label/category text       | `grep -lE "domain: *\w+\.map\(\(\w+\) => (\w+\.(category\|label\|step\.label)\|getCat\(\w+\))\)" packages/nimbus-viz/src/components/*/*.tsx`                                    | rows carry display text; two rows may share a label | `bandByIndex()` (`src/chart/scales.ts`): domain, lookups and React keys by row index; labels via `tickFormat`         | cohort-triangle `388652041` |
| BC-2 | value domain anchored at `[0, max]`, no guard | `grep -lE "domain: \[0, *(max\|value\|count\|density\|grand)\w*" packages/nimbus-viz/src/components/*/*.tsx`                                                                    | values can be negative (refunds, deltas, P&L)       | `valueDomain()` (`src/chart/scales.ts`): includes 0 only when data does not cross it; see `bar-chart.tsx` `d9cff8e6d` | bar-chart `d9cff8e6d`       |
| BC-3 | degenerate `[v, v]` domain maps to range mid  | covered by BC-2 `detect`; also any `scaleSqrt`/`scaleLog` site                                                                                                                  | every value equal (all zero after a filter)         | `valueDomain()` widens to a non-zero span; `bubble-chart.tsx` `sizeScale` guard `08cb9391a`                           | bubble-chart `08cb9391a`    |
| BC-4 | signed delta drawn with the wrong valence     | `grep -lE "invertDelta\|delta" packages/nimbus-viz/src/components/*/*.tsx`                                                                                                      | KPI deltas where lower is better                    | `stat-card.tsx` after `ed4efc64b`: arrow follows sign, colour follows valence                                         | stat-card `ed4efc64b`       |
| BC-5 | stack keys read from row 0 only               | `grep -ln "data\[0\]?\.segments" packages/nimbus-viz/src/components/*/*.tsx`                                                                                                    | ragged rows (a segment missing in the first row)    | `stackKeys(rows)` (`src/chart/stack.ts`): union of keys across rows, first-seen order                                 | exploration 2026-09-14      |
| BC-6 | docs describe an overflow SVG actually clips  | manual: any "Limitations" bullet that says a mark is drawn wider/taller than the plot                                                                                           | always (doc accuracy)                               | an embedded `<svg>` has browser-default `overflow: hidden`; describe clipping, not overdraw                           | funnel-chart `526c67dd1`    |
| BC-7 | duplicate default `ariaLabel` on one page     | manual: a story or page rendering 2+ instances of one chart with the same data and no `ariaLabel`; hint: `grep -L ariaLabel packages/nimbus-viz/src/components/*/*.stories.tsx` | any multi-instance story or dashboard page          | pass a distinct, descriptive `ariaLabel` per instance (axe `landmark-unique` fails otherwise)                         | bar-chart `d9cff8e6d`       |

## Status

- **BC-1** fixed everywhere. cohort-triangle and heatmap by hand (`388652041`,
  `eb30febb0`); candlestick-chart and rfm-grid were index-keyed from the start;
  the remaining 14 (bar-chart, box-plot, diverging-bar-chart,
  diverging-stacked-bar, dumbbell-chart, gantt-chart, grouped-bar-chart,
  lollipop-chart, pareto-chart, population-pyramid, radial-bar-chart,
  stacked-bar-chart, violin-plot, waterfall-chart) by `/chart:sweep BC-1`, each
  with an `EdgeCaseDuplicateLabels` story. The `detect` prints nothing; the
  registry invariant spec (INV-3) guards every base component. Side finding from
  the sweep: pareto-chart's `ChartScaleProvider` `xScale` fed a numeric rank
  into the text-keyed scale (overlays landed at 0); fixed with
  `band.center(index)`.
- **BC-2** fixed everywhere. bar-chart, line-chart, bullet-chart from the
  original passes; diverging-bar-chart and diverging-stacked-bar use symmetric
  domains. `/chart:sweep BC-2` closed most of the rest by clamping to 0 with a
  `devWarn`, raw value kept in the tooltip/table: grouped-bar-chart,
  pareto-chart, population-pyramid, funnel-chart (magnitude-only encodings, no
  honest signed picture), bubble-chart (negative `size` drawn at `R_MIN`),
  radial-bar-chart (drawn at the inner ring). lollipop-chart is signed —
  negatives drawn below/left of the zero baseline via `valueDomain()`.
  **stacked-bar-chart and stacked-area-chart draw negatives for real**, not
  clamped: a diverging stack offset (positives stack up from 0, negatives stack
  down from 0 — `@visx/shape`'s `offset="diverging"`, or the equivalent
  hand-rolled accumulator for `stacked-bar-chart`'s plain `<rect>`/`<path>`
  marks) — this was `TODO.md` `C3`, done directly rather than through
  `/opsx:propose` per an explicit decision to defer specs until past
  prototyping. Each gained an `EdgeCaseNegativeValues` (or
  `EdgeCaseNegativeSize`/`EdgeCaseNegativeStage`/`EdgeCaseNegativeValue`) story.
  Legitimate exceptions, left as they are: `violin-plot` (density axis,
  `[0, densityMax || 1]`), `histogram` (counts are never negative — see BC-3).
- **BC-3** fixed everywhere. bubble-chart (all-zero sizes); population-pyramid
  and radar-chart now use `valueDomain()` instead of the `|| 1` guard;
  histogram, stacked-bar-chart, stacked-area-chart, pareto-chart all adopted
  `valueDomain()` for their degenerate case as part of the BC-2 fix above;
  sankey-diagram now returns its empty-graph render (and warns) when every link
  is 0, closing the NaN-layout gap the registry invariant spec found.
- **Guard coverage.** `src/selection/registry-invariants.spec.tsx` catches BC-1
  for every chart (relabeling must not move marks) and any NaN / negative size
  (BC-3, and the bubble-chart negative-size half of BC-2). It cannot see a plain
  BC-2 extrapolation — a negative value drawn at a valid but wrong coordinate —
  so BC-2 stayed grep-guarded plus a per-chart `EdgeCase*` story. The `detect`
  now prints three files, none of them bugs: the `violin-plot` and
  `bubble-chart` exceptions above, and a doc comment in
  `radial-bar-chart.stories.tsx` describing the fix (matches the grep's text
  pattern, isn't code).
- **BC-4** fixed: stat-card.
- **BC-5** fixed: grouped-bar-chart, stacked-bar-chart, diverging-stacked-bar,
  marimekko-chart, population-pyramid (the last two were found by the `detect`
  itself, not by an audit) — all via `stackKeys(rows)` in the
  `/chart:sweep BC-1` commit. population-pyramid keeps its documented "first two
  segments" rule on top of the union. The `detect` prints nothing.
- **BC-6** fixed: funnel-chart docs.
- **BC-7** fixed: bar-chart stories; the rule is row 6 of
  `writing-chart-stories` "Common mistakes".
