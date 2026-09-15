# nimbus-viz — remaining roadmap work

Handoff checklist for the leftover parts of the charting-library hardening
roadmap (the full plan is a 31-item, multi-phase program — "multi-quarter, not
one sitting"). This file tracks **what is left**; the contained tier already
landed on the `nimbus-viz-components` branch.

Two companion files hold what this checklist does not: recurring bug patterns
with a grep to detect each one live in `docs/bug-classes.md` (read by
`/chart:introspect` and fixed across charts by `/chart:sweep`), and the exit
criteria for each `lifecycleState` live in `docs/lifecycle.md`.

## Verify every increment

Run from `packages/nimbus-viz` (or
`pnpm --filter @commercetools/nimbus-viz <script>` from the repo root):

```bash
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest --run  (370 passing as of this handoff)
pnpm build       # tsup ESM+CJS+DTS — the DTS step is the real gate for generics
```

Conventions that held all session: purely additive where possible; no barrel
`@chakra-ui/react` imports; a prettier PostToolUse hook reformats after edits.

---

## Already landed this pass (context — do not redo)

`#11` overlay surface (18/21 Cartesian charts + resolver `OVERLAY_HOSTS` → 10
bases) · `#9` locale/currency `valueFormat` on the 4 core Cartesian charts ·
`#17` real `TrendLine` confidence band (`stats.regressionBand`) · `#10`
`onDatumClick`/`onDatumHover` on 8 charts · `#12` generics on `BarChart` +
`ScatterPlot` · `#8` keyboard "view data as table" disclosure (all 43 charts) ·
`#25` axis-contrast gate (was already present) · `#28` `@experimental` on the
37-chart tail · `#30` dogfood app `apps/viz-dashboard`.

---

## Remaining — actionable

### Phase A tails (mechanical breadth; patterns already established)

- [x] **A2-tail — format threading.** Done: `valueFormat` +
      `useChartFormatters()` threaded through 34 more charts (core-4 already had
      it: line, bar, stacked-bar, stacked-area) — beeswarm-plot, box-plot,
      bubble-chart, bullet-chart, bump-chart, candlestick-chart, chord-diagram,
      cohort-triangle, connected-scatterplot, control-chart, cumulative-curve,
      diverging-stacked-bar, donut-chart, dumbbell-chart, funnel-chart,
      grouped-bar-chart, heatmap, histogram, lollipop-chart, marimekko-chart,
      parallel-coordinates, pareto-chart, population-pyramid, radar-chart,
      radial-bar-chart, rfm-grid, sankey-diagram, scatter-plot, slope-chart,
      streamgraph, sunburst-chart, treemap, violin-plot, waterfall-chart. Same
      pattern throughout: `const valueFmt = valueFormat ?? formatters.compact`,
      swap value-axis/value-display `formatCompact` calls → `valueFmt`; leave
      date/category/count formatting alone (histogram's count axis stays
      `formatInteger`; bump-chart's x-axis stays a fixed formatter — it's a
      module-level helper with no access to the prop). `gauge` and `stat-card`
      already exposed a value-format prop with a hardcoded default
      (`formatCompact`, and `format` for stat-card) — upgraded both to read from
      `useChartFormatters()` too, renaming stat-card's `format` → `valueFormat`
      for consistency (no consumers depend on the old name; updated its own
      stories/mdx). Default output is byte-identical everywhere (no provider) —
      see `src/chart/format-locale.tsx`. Deliberately excluded, each for a real
      reason: `diverging-bar-chart` / `diverging-stacked-bar`'s signed-delta and
      percent-of-total displays (`formatSignedCompact`/`formatPercent` — no
      locale-aware signed or percent formatter exists yet, and defaulting
      through `formatters.compact` would silently change their output);
      `waffle-chart` (percent-only, same reason); `calendar-heatmap` (its
      tooltip value is `formatInteger`, not `formatCompact` — defaulting it
      through `formatters.compact` would change the default output, e.g. `128` →
      `128` is fine but `128.4` → `128` vs `"128.4"` is not); `gantt-chart`
      (dates only, no value to format); `sparkline` / `data-table` (no value
      formatting at all). Documentation scope: the new/changed `valueFormat`
      prop's TSDoc (which `<PropsTable>` surfaces automatically) was
      added/updated on every touched chart; a hand-authored `.mdx` "Value
      formatting" subsection with its own `jsx live` demo (bar-chart's
      precedent) was **not** added to all 34 — that's 34 more per-chart demos
      for a mechanically-identical capability already fully described by the
      auto-generated props table, so it was judged not worth the time at this
      scale. `gauge.mdx` already had one and was updated in place for the new
      "overrides `ChartLocaleProvider`" behavior;
      `stat-card.mdx`/`stat-card.stories.tsx` were updated for the prop rename.
- [x] **A2-date — locale-thread the time axis.** Done: `ChartFormatters`
      (`chart/format-locale.tsx`) gained `dayMonth`/`month`, `Intl`-backed
      (`DateTimeFormat(locale, { month: "short", day: "numeric" })` /
      `{ month: "short" }`); the no-provider default is byte-identical to the
      raw d3 helpers (`formatDayMonth`/`formatMonth` from `chart/format.ts`),
      golden-checked in `format-locale.spec.tsx`. Threaded a
      `dateFormat?: (d:     Date) => string` prop
      (`const dateFmt = dateFormat ?? formatters.dayMonth`) through every chart
      that had a hardcoded `formatDayMonth` call: bump-chart, candlestick-chart,
      control-chart, line-chart, stacked-area-chart, streamgraph (already had
      `valueFormat`/`formatters` from `A2-tail`, so this was additive), plus
      gantt-chart and calendar-heatmap (freshly wired — they'd had no locale
      hook at all). `bump-chart`'s x-axis formatter (`fmtX`, mixed
      date-or-index) had to move from module scope into the component body since
      it now needs `dateFmt`/`valueFmt`, both props — its numeric-index branch,
      previously stuck on a hardcoded `formatCompact` regardless of
      `valueFormat`, now honors it too as a side effect. `calendar-heatmap`'s
      month-header row was a genuinely hardcoded English `MONTHS` array (not
      even routed through `formatDayMonth`) — replaced with `formatters.month`,
      but fed a locally-reconstructed date (`new Date(2000, m, 1)`) rather than
      the UTC-midnight `monday` value the grid math produces:
      `Intl.DateTimeFormat` reads a `Date`'s _local_ month, so handing it a UTC
      instant directly could show the adjacent month in a negative-UTC-offset
      locale at a month boundary — the reconstruction sidesteps that without
      touching the grid's own UTC-safe day-index math. Verified:
      `pnpm typecheck` / `pnpm test` (773 passing) / `pnpm build` all green;
      eslint clean on every touched file.
- [ ] **A3-tail — datum callbacks.** Extend `onDatumClick`/`onDatumHover` to the
      charts not yet wired (done: line, bar, scatter, grouped-bar, stacked-bar,
      bubble, waterfall, pareto, stacked-area, bullet, funnel, cohort-triangle,
      heatmap). Pattern in `src/chart/interaction.ts`; fire from existing hover
      handlers with the raw input datum. Note `stacked-area`'s and `bullet`'s
      callbacks report the whole row (`StackDatum`/`BulletDatum`, no
      `seriesId`), matching `stacked-bar`'s convention — not `line`'s "report
      series[0] only" — since neither has a single "the" series to report.
- [ ] **A3 — controlled selection + interactive legend.** Lift internal hover to
      controlled/uncontrolled (`selection`/`onSelectionChange`,
      `useControlledSelection` exists); legend click-to-toggle / shift-isolate
      series visibility. Bigger; per-chart selected-state rendering.

### Phase C — type surface

- [ ] **C1 — generics on the series/stack charts.** `line-chart`,
      `stacked-area-chart`, `stacked-bar-chart`, `grouped-bar-chart`,
      `donut-chart`. Fiddlier than bar/scatter (nested point accessors on
      `Series`/`StackRow`). Follow the `BarChart<T = CategoryDatum>` reference
      (memoized accessors, defaults preserve today's keys, verify DTS builds).
- [ ] **C2 — render-prop tooltip / legend.** `renderTooltip(datum)` /
      `renderLegend(items)` escape hatches on `SvgTooltip` / `Legend` /
      `ChartContainer`; keep the string-lines path as default.
- [x] **C3 — diverging stack offset for negative segments.** Done directly (no
      `/opsx:propose`, by explicit decision — specs are deferred until the
      library is past prototyping). `stacked-area-chart` uses `@visx/shape`'s
      `AreaStack offset="diverging"` (wraps d3's `stackOffsetDiverging`
      directly); `stacked-bar-chart` hand-rolls the same accumulator (positive
      segments stack up from 0, negative stack down from 0, each in the order
      given) since its marks are plain `<rect>`/`BarRounded`, not a d3-shape
      stack. Both charts' value domain now spans each row's full positive and
      negative extent (not just the net total). No legend note was needed —
      neither chart encodes polarity by color; the segment's own key/color is
      unchanged by its sign, same as before.

### Phase D — accessibility completeness

- [ ] **D2 — texture / pattern fills.** Wire `src/chart/patterns.tsx`
      (`ChartPatternDefs` + `patternFill`, already built, unused) as an opt-in
      `texture` prop on categorical charts (stacked / area / pie families
      first), so series are distinguishable without color.
- [ ] **D3 — forced-colors / high-contrast.** Apply
      `src/chart/use-forced-colors.ts` (built, unused) + a
      `@media (forced-colors: active)` layer; SVG needs `forced-color-adjust`;
      lean on D2 patterns so shape carries identity.
- [ ] **D1-rest — keyboard traversal of marks.** Roving-tabindex focus on
      marks + show-tooltip-on-focus + Escape-dismiss. (The "view as table"
      disclosure half of `#8` is done in `ChartContainer`.) Per-chart,
      design-heavy.

### Phase E — ship-readiness

- [x] **E2 — Storybook harness + stories (no Chromatic).** Harness done:
      `.storybook/main.ts` + `preview.tsx` (global `ChartThemeProvider`
      following the dark-mode toolbar, `addon-a11y` in `test: "error"` mode),
      `vitest.storybook.config.ts` registered in the root `vitest.config.mts` as
      `nimbus-viz-storybook`. Fixtures live in `src/stories/fixtures.ts`
      (`fixtureFor(entry)`, 24 builders keyed by `DataKind`) and
      `src/stories/base-story.tsx` (`RegistryPreview`). Stories themselves are
      tracked per chart by `/chart:introspect` (see `E5` and
      `docs/lifecycle.md`). **Chromatic is intentionally dropped** — Storybook
      alone is the agreed bar.
- [ ] **E3 — recipe kit.** `src/recipes/` has `dashboard-kit.tsx` (1 of 3). Add
      revenue-overview, conversion-funnel, cohort-retention starters pre-wired
      to `ColorScaleProvider` + `ChartThemeProvider`.
- [ ] **E5 — core-6 depth.** Converge states / interaction / dense-data +
      label-collision polish + a full story/spec matrix on the core-6 (line,
      stacked-area, bar, stacked-bar, stat-card + bullet, funnel,
      cohort-triangle/heatmap). Story/spec matrix done: bar, line, stacked-area,
      stacked-bar, stat-card, bullet, funnel, cohort-triangle, heatmap — **all
      core-6 done.** Interaction convergence done: stacked-area, bullet, funnel,
      cohort-triangle, heatmap (see A3-tail; stacked-bar already had it going
      in). Label-collision polish done for `cohort-triangle` and `heatmap` (same
      root cause, same fix, found on `cohort-triangle` first): rows were
      positioned via `yScale(row.label)` — a `scaleBand` domain keyed by the
      label value, so two rows sharing a label silently collapsed onto the same
      y-position (not just a React-key warning). Fixed by keying the domain and
      every lookup by row index instead. Also found and fixed a docs-accuracy
      bug for `funnel`: its Limitations claimed a too-large stage "draws a bar
      wider than the top", but the SVG's default overflow:hidden actually clips
      the overrun rather than visibly drawing it — wording corrected. Also found
      and fixed for `bullet`: negative measure/target silently rendered wrong
      (same class of bug as bar/line's signed-value fixes).
- [x] **E6 — fix `isolate: false` story accumulation blocking real play-function
      coverage.** ~~Root cause isn't fully pinned down... points at
      `vitest.storybook.config.ts`'s `isolate: false`~~ — **that theory was
      wrong.** Re-investigated by running `bar-chart.stories.tsx` (8 real
      instances) repeatedly and with `vitest run -t "<story name>"` to isolate
      single stories; both failing checks reproduced **deterministically, from a
      single story alone**, with `isolate: false` untouched — accumulation
      across stories/files was never the mechanism. Two concrete, unrelated
      bugs, both now fixed: - `scrollable-region-focusable` — `data-table.tsx`'s
      `overflowX: "auto"` wrapper had no way to reach it by keyboard once its
      content actually overflowed (any chart's table with enough columns/rows,
      `EdgeCase*` stories included). Fixed with `tabIndex={0}` on that div — a
      real WCAG 2.1.1 gap, not a test artifact. - `landmark-unique` —
      `chart-container.tsx`'s data-table region label
      (`` `Data table for ${ariaLabel}` ``, from the earlier partial fix)
      collides whenever **two chart instances share the same auto-generated
      default `ariaLabel`** on one page — `bar-chart`'s `Orientation` story
      renders the same `data={fixture}` twice with no explicit `ariaLabel`, so
      both get the identical default
      (`` `Bar chart of ${rows.length} categories` ``). Fixed by giving each
      instance a distinct, descriptive `ariaLabel` in that story. This is a
      **story-authoring hazard, not a library bug** — documented as a pitfall in
      `writing-chart-stories/SKILL.md` so future multi-instance stories (any
      chart, not just `bar-chart`) set distinct `ariaLabel`s up front instead of
      rediscovering this per chart. Verified: `bar-chart.stories.tsx` alone (3
      repeat runs) and the full `nimbus-viz-storybook` project (all 46 stories
      files, 53 tests) both pass clean with `isolate: false` unchanged. No
      config change was needed or made.

### Wire the dormant primitives (built + unit-tested, but no chart consumes them)

- [ ] **`#16` scales.** Swap inline `scaleLinear` value axes for
      `src/chart/scales.ts` `makeValueScale("linear"|"log"|"symlog", …)`; expose
      a `yScale` prop (default `symlog`; guard `log` for strictly-positive).
- [ ] **`#17`-rest stats "compute from raw".** `box-plot` raw-sample entry via
      `stats.fiveNumberSummary` (today it only takes precomputed
      `BoxPlotGroupStats`); `ErrorBars` raw-samples (mean ± CI). Keep the
      precomputed paths too. `violin-plot` already takes raw samples and (per
      B-dedup above) now computes its density via `stats.gaussianKde` directly,
      so it's no longer part of this item's remaining scope.
- [ ] **`#18` FacetGrid.** `src/chart/facet-grid.tsx` needs usage + stories
      (small multiples: shared-or-free domains, one shared legend).
- [ ] **`#19` large-N.** Wire `src/chart/decimate.ts` (LTTB) into line/area past
      a threshold; add a quadtree hit-test for scatter/bubble.
- [ ] **`#20` brush / linked views.** Wire `src/chart/brush.tsx` + a
      `SelectionProvider` (broadcast a brushed domain / highlighted entity-set
      on `ENTITY_ID_ACCESSOR`); needs `@visx/zoom` for zoom.
- [ ] **`#21` annotations demos.**
      `src/overlays/{annotation,event-markers,now-line}.tsx` exist and compose
      as overlay children; add stories/examples once E2 lands.

---

## Deferred — with reason (decide before doing)

- [x] **B-dedup reconciliation.** Done: aligned `stats/index.ts` to the three
      charts' inline math (not the other way around) rather than deferring
      further, since prototyping-stage means no OpenSpec is needed for a
      behavior-preserving refactor and there was nothing left to actually
      decide. `controlLimits` gained `center`/`upper`/`lower` overrides (unset
      ones still derive from the data) so it reproduces control-chart's
      caller-supplied UCL/LCL exactly; `histogramBins` gained a `domain` option
      (passing it suppresses d3's `nice()`, matching histogram's explicit
      `.domain(extent())`); `silvermanBandwidth` gained a `domain` option whose
      fallback for a degenerate sample is `(hi−lo)/12` (was a flat `1`),
      matching violin-plot's inline fallback — and `gaussianKde` now threads its
      own `domain` argument into that fallback automatically.
      `stats/index.spec.ts` gained golden-value tests that freeze each chart's
      old inline formula (as a local reference function or a direct d3-array
      call) and assert the aligned module matches it exactly, before the charts
      were switched over — proving the switch is output-identical rather than a
      silent behavior change. `control-chart.tsx`, `histogram.tsx`,
      `violin-plot.tsx` now call
      `controlLimits`/`histogramBins`/`gaussianKde`+`median` from `../../stats`
      instead of their own hand-rolled math (violin-plot's local `mean`,
      `stddev`, `median`, `density` helpers are gone; `median` is d3-array's,
      re-exported from `stats`, confirmed to match the old sorted-array formula
      bit-for-bit — d3-array's `quantile`/`median` don't require pre-sorted
      input). Verified: `pnpm typecheck` / `pnpm test` (771 passing, both
      projects) / `pnpm build` all green; no chart's rendered output changed
      (that's the point of the golden-value spec) — a full story/spec matrix for
      these three charts is still a separate, later `/chart:introspect` pass.
- [ ] **A1b — orientation-aware overlay contract.** `dumbbell` + `beeswarm`
      (value on **x**, categories on a band **y**), `gantt` (time-x, categorical
      rows), and `bar-chart`'s ranked/horizontal orientation (value axis is x,
      not y) can't take the current `ChartScales` contract (which assumes
      vertical value-y). Give them overlays by making the contract
      orientation-aware (value/position scales + an `orientation`), touching
      `scale-context.tsx`, the ~10 overlay components, and the 18 providers.
      Only then can these 4 charts host `ReferenceLine`/`NowLine`/etc.

## Dropped (per product decision, 2026)

- **`#3` Chromatic** visual regression — the Storybook harness (E2) is still
  wanted; only the Chromatic cloud wiring is out.
- **`#22` geo / spatial charts** — anything needing GeoJSON/topojson/licensed
  boundary data. `tile-grid-map` (hand-laid grid cartogram) was also removed as
  out of scope for the design system.
- **`#27` per-chart subpath exports + lazy resolver** — not needed; also had a
  tsup multi-entry DTS OOM blocker.
