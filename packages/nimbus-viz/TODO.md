# nimbus-viz — remaining roadmap work

Handoff checklist for the leftover parts of the charting-library hardening
roadmap (the full plan is a 31-item, multi-phase program — "multi-quarter, not
one sitting"). This file tracks **what is left**; the contained tier already
landed on the `nimbus-viz-components` branch.

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

- [ ] **A2-tail — format threading.** Thread `valueFormat` +
      `useChartFormatters()` through the ~35 remaining value-formatting charts
      (core-4 done: line, bar, stacked-bar, stacked-area). Pattern: add hook at
      component top, `const     valueFmt = valueFormat ?? formatters.compact`,
      swap value-axis `formatCompact` calls → `valueFmt`; leave date/category
      formatting alone. Default output is byte-identical (no provider) — see
      `src/chart/format-locale.tsx`.
- [ ] **A3-tail — datum callbacks.** Extend `onDatumClick`/`onDatumHover` to the
      charts not yet wired (done: line, bar, scatter, grouped-bar, stacked-bar,
      bubble, waterfall, pareto). Pattern in `src/chart/interaction.ts`; fire
      from existing hover handlers with the raw input datum.
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

- [ ] **E2 — Storybook harness + stories (no Chromatic).** No `.storybook/`
      exists yet. Set up `main` + `preview` (wrap in `ChartThemeProvider`,
      light/dark toolbar, reuse `gallery/fixtures.ts`), a
      `vitest.storybook.config.ts` mirroring `packages/nimbus`, register it in
      the root `vitest.config.mts` projects, and add stories (core-6 first, then
      per chart). Needs a Storybook deps install. **Chromatic is intentionally
      dropped** — Storybook alone is the agreed bar.
- [ ] **E3 — recipe kit.** `src/recipes/` has `dashboard-kit.tsx` (1 of 3). Add
      revenue-overview, conversion-funnel, cohort-retention starters pre-wired
      to `ColorScaleProvider` + `ChartThemeProvider`.
- [ ] **E5 — core-6 depth.** Converge states / interaction / dense-data +
      label-collision polish + a full story/spec matrix on the core-6 (line,
      stacked-area, bar, stacked-bar, stat-card + bullet, funnel,
      cohort-triangle/heatmap).

### Wire the dormant primitives (built + unit-tested, but no chart consumes them)

- [ ] **`#16` scales.** Swap inline `scaleLinear` value axes for
      `src/chart/scales.ts` `makeValueScale("linear"|"log"|"symlog", …)`; expose
      a `yScale` prop (default `symlog`; guard `log` for strictly-positive).
- [ ] **`#17`-rest stats "compute from raw".** `box-plot` / `violin-plot`
      raw-sample entry via `stats.fiveNumberSummary` / `gaussianKde`;
      `ErrorBars` raw-samples (mean ± CI); keep precomputed paths. _(See the
      B-dedup note below first — the inline math diverges from the module.)_
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

- [ ] **B-dedup reconciliation.** `control-chart`, `histogram`, `violin-plot`
      still run inline math that the `stats` module was extracted from — but the
      module **diverged** during extraction and is **not** output-identical: -
      control-chart rebuilds UCL/LCL around a caller-supplied `center`; a single
      `controlLimits(values)` call can't reproduce that. - histogram passes an
      explicit `.domain(extent())`, which suppresses d3's `nice()`;
      `histogramBins` omits `.domain()` so d3 nice()s the edges → different
      bins. - violin's degenerate-sample bandwidth is `(hi−lo)/12` vs the
      module's Silverman fallback → different widths. The charts are **correct
      today**; deduping requires aligning the module to the charts (or
      vice-versa) — a deliberate behavior change (shifts bins/limits/widths),
      best done with visual regression in place.
- [ ] **A1b — orientation-aware overlay contract.** `dumbbell` + `beeswarm`
      (value on **x**, categories on a band **y**) and `gantt` (time-x,
      categorical rows) can't take the current `ChartScales` contract (which
      assumes vertical value-y). Give them overlays by making the contract
      orientation-aware (value/position scales + an `orientation`), touching
      `scale-context.tsx`, the ~10 overlay components, and the 18 providers.
      Only then can these 3 charts host `ReferenceLine`/`NowLine`/etc.

## Dropped (per product decision, 2026)

- **`#3` Chromatic** visual regression — the Storybook harness (E2) is still
  wanted; only the Chromatic cloud wiring is out.
- **`#22` geo / spatial charts** — anything needing GeoJSON/topojson/licensed
  boundary data. `tile-grid-map` (hand-laid grid cartogram) was also removed as
  out of scope for the design system.
- **`#27` per-chart subpath exports + lazy resolver** — not needed; also had a
  tsup multi-entry DTS OOM blocker.
