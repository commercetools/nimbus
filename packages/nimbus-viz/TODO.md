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
- [x] **A3-tail — datum callbacks.** Done: `onDatumClick`/`onDatumHover` wired
      on 28 more charts via `extends DatumInteractionProps<Payload>` (the
      shared-interface form, matching `waterfall-chart`'s precedent rather than
      the older inline-props style some of the original 13 used) --
      beeswarm-plot, box-plot, bump-chart, calendar-heatmap, candlestick-chart,
      chord-diagram, connected-scatterplot, control-chart, cumulative-curve,
      diverging-bar-chart, diverging-stacked-bar, donut-chart, dumbbell-chart,
      gantt-chart, histogram, lollipop-chart, marimekko-chart,
      parallel-coordinates, population-pyramid, radial-bar-chart, rfm-grid,
      sankey-diagram, slope-chart, streamgraph, sunburst-chart, treemap,
      violin-plot, waffle-chart. Payload convention held throughout: report the
      chart's own raw input row/point type (never a clamped or
      internally-computed value); a chart with row/stack semantics reports the
      whole row with no `seriesId` (population-pyramid, marimekko-chart --
      extended with `seriesId` as the touched side/segment's key anyway, since
      it's free extra fixed to report and doesn't contradict "the datum is the
      row"); a chart with two distinct mark kinds (an entity vs. a relationship
      between two entities) reports the single-entity shape as `datum` and the
      other entity as `seriesId` (chord-diagram's arc-vs-ribbon,
      sankey-diagram's node-vs-link -- new exported `ChordEntity` type for
      chord-diagram since no single-entity row existed in `FlowMatrix`). Two
      structural fixups needed along the way: `bump-chart`'s mixed date-or-index
      x-axis formatter (`fmtX`) had to move from module scope into the component
      body in `A2-date` already, so it already had access to props here;
      `cumulative-curve`'s local `CdfPoint` and `streamgraph`'s local
      `StackDatum` had to be exported to use as the `DatumInteractionProps<T>`
      type argument.

      Deliberately excluded, each for a real reason: `gauge` / `stat-card`
                                                      (a single value has no discrete second "mark" to report a click on --
                                                      the whole chart already is the one datum, which is what `value`/`label`
                                                      already are); `sparkline` (explicitly minimal by design -- "no axes, no
                                                      gridlines, no tick labels", a decorative inline glyph, not an
                                                      interactive chart); `data-table` (the guaranteed no-throw HTML fallback
                                                      shell used internally by `ChartContainer`, not a chart with visual
                                                      marks -- its own doc comment already flags it as a temporary stand-in
                                                      pending a real `@commercetools/nimbus` `DataTable`).

                                                      Verified: `pnpm typecheck` / `pnpm test` (773 passing) / `pnpm build`
                                                      all green; eslint clean on every touched file (28 chart `.tsx` files).

- [x] **A3 — controlled selection + interactive legend.** Done, on the
      `LineChart` reference chart (chosen: it already has both a multi-series
      legend and a hover model to compose against).

      `chart/interaction.ts`'s `useControlledSelection` extended from a
          2-tuple `[selected, toggle]` to a 3-tuple `[selected, toggle, isolate]`
          -- `isolate(id)` replaces the whole selection with `new Set([id])`,
          respecting the same controlled/uncontrolled duality as `toggle` (only
          writes local state when uncontrolled; always calls `onChange`).
          Backward-compatible: the existing spec only indexed `[0]`/`[1]`, so no
          existing test needed touching; two new tests cover `isolate` in both
          modes.

          `LineChart` now `extends InteractionProps<T>` (the full contract --
          datum callbacks + selection -- rather than just
          `DatumInteractionProps<T>`) and wires
          `useControlledSelection(selection, onSelectionChange)`. Semantics are
          crossfilter-style, matching `SelectionProps`'s own "linked views /
          crossfilter" doc comment: an empty selection is "no filter" (every
          series shown -- today's unchanged default); once non-empty, only series
          IN the selection are drawn. A legend click toggles that series' id in/out
          of the selection (so the FIRST click on an item filters down to just
          it, not "hide only this one"; a second item adds to the filter;
          clicking a selected item again removes it, shrinking back toward
          empty). Shift-click isolates via the new `isolate()`. This is on by
          default, unconditionally -- no new opt-in prop gates it, since it's an
          interaction affordance, not a rendering default; the byte-identical
          guarantee that matters here is the REST state (empty selection -> every
          series at full opacity, identical output to before this item) as
          `LineChart`'s own new `InteractiveLegend` story asserts explicitly.
          Legend items became real `<button>`s (`aria-pressed`, keyboard
          Tab/Enter/Shift+Enter all work as the native activation contract
          provides) instead of plain `<li>` text -- dimming a hidden series in
          the legend uses `text-decoration: line-through` on the label plus a
          lower `opacity` on the *decorative* swatch only, not on the button as a
          whole, because dimming the whole button (label included) dropped
          contrast below WCAG 4.5:1 and tripped `addon-a11y`'s `test: "error"`
          gate -- caught by the story's own run, not by inspection. Hidden series'
          drawn `LinePath`/`AreaClosed` get `opacity={0}` (kept in the DOM, not
          removed) and their hover-crosshair circle is skipped; the tooltip and
          data table are deliberately left unfiltered (documented in
          `line-chart.mdx` Limitations) -- they always list every series,
          selection or not.

          Not attempted: rolling `selection`/`onSelectionChange` /
          `InteractionProps<T>` out to any other chart, or an actual cross-chart
          linked-selection demo (e.g. two charts sharing one lifted `useState`) --
          both are real, mechanical follow-ups for whichever chart needs them
          next, following this same pattern.

          Verified: `pnpm --filter @commercetools/nimbus-viz typecheck` /
          `test` (816 passing, +3) / `build` all green; `eslint` clean on every
          touched file; the storybook project's own `Accessibility` story needed
          a fix (the new legend buttons add focusable stops ahead of the
          existing "view data as table" toggle, so a fixed-count `Tab` assumption
          broke -- replaced with a bounded tab-until-focused loop).

### Phase C — type surface

- [x] **C1 — generics on the series/stack charts.** Done: `line-chart`,
      `stacked-area-chart`, `stacked-bar-chart`, `grouped-bar-chart`,
      `donut-chart` are now generic over their row type `T`, following the
      `BarChart<T = CategoryDatum>` reference exactly (two overloads — a
      concrete-shape signature plus a generic one requiring the accessors,
      memoized `getX`/`getY`/`getCat`/`getSeg` accessors, defaults preserve
      today's keys). `donut-chart` mirrors `BarChart` directly
      (`category`/`value` accessors, default `CategoryDatum`). `line-chart`
      needed `chart/types.ts`'s `Series` made generic
      (`Series<T = SeriesPoint>`, additive — every existing bare `Series` usage
      still resolves to `Series<SeriesPoint>`) plus `x`/`y` accessors;
      `stacked-area-chart` needed the same `x`/`y` accessors but its interaction
      payload stays the internally-derived `StackDatum` regardless of `T`
      (unaffected, since it's not the raw input row).
      `stacked-bar-chart`/`grouped-bar-chart` are generic over the ROW (not the
      segment) with `category`/`segments` accessors, defaulting to `StackRow`;
      `chart/stack.ts`'s `stackKeys()` gained an optional second `segmentsOf`
      accessor param (defaults to reading `.segments` directly, byte-identical
      for every existing caller) so a generic row without a literal `segments`
      field can still derive the key union. `grouped-bar-chart`'s interaction
      payload stays `StackSegment` (unaffected by `T`, same reasoning as
      `stacked-area-chart`). Verified: `pnpm typecheck` / `pnpm test` (773
      passing) / `pnpm build` (the DTS gate for generics) all green on every one
      of the 5 charts, each also re-run through its own `.stories.tsx` in
      isolation; eslint clean on every touched file.
- [x] **C2 — render-prop tooltip / legend.** Done, with a real scope finding:
      `SvgTooltip` (`content`/`contentWidth`/`contentHeight`) and
      `ChartContainer` (`legendSlot`) already had a node-level escape hatch
      before this item — a chart AUTHOR could already render fully custom
      tooltip/legend content. What was actually missing, and what this adds: a
      per-item legend override (`Legend` had none at all) and a chart-level PROP
      a CONSUMER can pass without forking the chart. `Legend` gains
      `renderItem?: (item, index) => ReactNode` (replaces, not merges with, the
      default swatch + label); `ChartContainer` gains `legendRenderItem`
      threading it to `Legend` (ignored when `legendSlot` is also given, since
      that replaces the legend outright). Threaded
      `renderTooltip?: (datum: StackSegment, index) => ReactNode` +
      `renderTooltipSize` and `renderLegendItem` through `GroupedBarChart` as
      the reference implementation (chosen over `BarChart` because it already
      has both a legend and an `SvgTooltip` call — `BarChart` has neither),
      proven end-to-end with a story that hovers a bar and asserts the custom
      tooltip content renders instead of the default two-line readout, and the
      legend rows show the custom render instead of the default swatch. Rolling
      `renderTooltip`/`renderLegendItem` out to every other chart with a
      tooltip/legend is a mechanical follow-up (same shape as
      `A2-tail`/`A3-tail`'s sweeps) explicitly left undone — not attempted here.
      Verified: `pnpm typecheck` / `pnpm test` (791 passing) / `pnpm build` all
      green; eslint clean on every touched file.
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

- [x] **D2 — texture / pattern fills.** Done on the three named families exactly
      (not just one representative — this one was cheap and low-risk enough
      per-chart to do all three): `DonutChart` (pie), `StackedBarChart`
      (stacked), `StackedAreaChart` (area) each gain an opt-in
      `texture?: boolean` prop. When `true`, the chart renders
      `<ChartPatternDefs colors={...} />` once (inside its `ChartScaleProvider`/
      `Group`) and switches every mark's `fill` from the flat categorical color
      to `patternFill(index)` — a `url(#...)` reference into the per-category
      `<pattern>` `chart/patterns.tsx` generates. Default `false`, unchanged
      rendering (flat color, same as always). Each got a `Texture` story
      asserting the real thing: `<defs>` has exactly one `<pattern>` per
      category/segment/series, and every mark's `fill` attribute is a
      `url(#...)` reference, not a flat color — plus a `jsx live` demo added to
      each chart's `.mdx` "Chart configuration". Verified: `pnpm typecheck` /
      `pnpm test` (807 passing) / `pnpm build` all green; eslint clean on every
      touched file.
- [x] **D3 — forced-colors / high-contrast.** Done, on the same three D2 charts:
      `chart/typography.ts`'s `chartRootStyle()` (every chart's root `<svg>` —
      `chart-frame.tsx`, plus `radar-chart`/`sparkline`'s own bare `<svg>`, per
      its only 3 call sites) gains `forcedColorAdjust: "none"` globally — the
      "SVG needs `forced-color-adjust`" half, applied to all 46 charts at once,
      since chart paint is inline `fill`/`stroke` set from JS, which the
      browser's automatic forced-colors override does not reliably reach anyway
      (the same reason the hook exists at all), so turning it off doesn't take
      away a working safety net that wasn't actually there.
      `DonutChart`/`StackedBarChart`/`StackedAreaChart` each call
      `useForcedColors()` and derive
      `effectiveTexture = texture ||     forcedColors` (textures turn on
      automatically, no prop needed) plus a
      `forcedColors ? "CanvasText" : <theme color>` swap for every mark AND the
      two `DonutChart` center-label `<text>` fills — real hues aren't preserved
      by the OS in a forced-colors context anyway, so one system foreground
      color plus the per-index pattern kind is the correct response, not a
      compromise. Known, explicitly-not-attempted remaining gap: axis tick
      labels, gridlines, and the `SvgTooltip` box on all three charts still use
      their normal theme ink colors under forced-colors (not switched to
      `CanvasText`) — narrower in scope than the mark-identity problem this item
      is centrally about, and left for a follow-up (same shape as `C2`'s and
      `#16`'s "rest of the charts" notes) rather than expanding this pass into a
      full text/gridline color audit. Tests: `chart-frame.spec.tsx` (new)
      asserts the root svg's `forced-color-adjust` style directly;
      `forced-colors-integration.spec.tsx` (new, under `chart/` since chart
      components conventionally get a `.stories.tsx` not a `.spec.tsx` — same
      precedent as `registry-invariants.spec.tsx`) stubs `matchMedia`
      (`storybook/test` doesn't re-export `vi`, so this couldn't be a Storybook
      story) and renders all three charts with NO `texture` prop, asserting
      patterns and `url(#...)` fills appear anyway, plus a control case proving
      the same charts draw flat colors with no `<defs>` when forced-colors is
      off. Verified: `pnpm typecheck` / `pnpm test` (813 passing) / `pnpm build`
      all green; eslint clean on every touched file.
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
- [x] **E3 — recipe kit.** Done: `RevenueOverviewKit`, `ConversionFunnelKit`,
      `CohortRetentionKit` added alongside `DashboardKit`, same shape
      (slot-based, not hard-coded to specific charts; `ChartThemeProvider`
      always, `ColorScaleProvider` only when `colorDomain` is given). Each has a
      layout suited to its named use case rather than reusing `DashboardKit`'s
      generic one verbatim: `RevenueOverviewKit` leads with a `headline` stat
      beside a `comparison` KPI row, then `trend`/`breakdown`; deliberately
      `ConversionFunnelKit` puts `metrics` beside `funnel` (reads as annotations
      on it) with `breakdown` as a full-width second row; `CohortRetentionKit`
      puts `grid`/`curve` side by side with `summary` as a KPI row underneath.
      Each has its own spec test (mirroring `dashboard-kit.spec.tsx`'s two
      cases: slots render inside the theme provider with `colorDomain`, and
      render fine without one). Exported from `src/recipes/index.ts` →
      `src/index.ts`. Verified: `pnpm typecheck` / `pnpm test` (780 passing) /
      `pnpm build` all green; eslint clean.
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

- [x] **`#16` scales.** Done on `bar-chart` as the reference chart (both
      orientations' value-axis `scaleLinear` calls) — swapped for
      `src/chart/scales.ts`'s `makeValueScale("linear"|"log"|"symlog", …)`
      behind a new `yScale?: ValueScaleKind` prop. Deliberately **not**
      defaulted to `"symlog"` as this item's text suggested: `symlog` compresses
      large values relative to `linear` (it is not pixel-identical to it, even
      over ordinary `[0, max]` data), so defaulting to it would have been a
      real, silent visual change to every existing consumer and to this
      session's own already-committed pixel-exact story assertions — the
      opposite of the "additive, byte-identical default" rule every other item
      this session followed. `yScale` defaults to `undefined` → `"linear"`,
      unchanged output; `symlog`/`log` are opt-in. `"log"` requires a strictly
      positive domain, which `BarChart`'s domain structurally never is
      (`[Math.min(0, valueMin), Math.max(0, valueMax)]` always includes 0) —
      `yScale="log"` detects this and falls back to `"linear"` with a one-time
      `devWarn`, verified to render pixel-identical to the default rather than a
      degenerate/NaN axis. `ValueScale`'s return type doesn't satisfy
      `@visx/axis`'s `AxisScale` structurally (by design — its own doc comment:
      declared narrow so the emitted `.d.ts` never has to name
      `@types/d3-scale`); cast at the one
      `<AxisLeft scale={... as unknown as AxisScale} />` call site (a
      function-body-local cast, confirmed not to leak into the built `.d.ts` —
      `AxisScale` doesn't appear there). Rolling `yScale` out to the other
      value-axis charts is a mechanical follow-up left undone, same as `C2`'s
      note. Stories: `ValueScaleSymlog` compares the same wide-dynamic-range
      data rendered once per scale and asserts the smallest-to-tallest bar
      height ratio is markedly larger under symlog (real compression, not just
      "it rendered"); `ValueScaleLogFallsBackToLinear` asserts the `"log"`
      render is pixel-identical, bar for bar, to the default render. Verified:
      `pnpm typecheck` / `pnpm test` (804 passing) / `pnpm build` all green;
      eslint clean on every touched file.
- [x] **`#17`-rest stats "compute from raw".** Done: `box-plot`'s `groups` prop
      now takes `BoxPlotGroup[]` = `BoxPlotGroupStats | BoxPlotGroupSamples` per
      entry (mixing both shapes in one chart is fine); a `BoxPlotGroupSamples`
      (`{ label, samples }`) is reduced via `stats.fiveNumberSummary` (Tukey,
      1.5·IQR fences). `ErrorBars`' `points` prop takes `ErrorBarInput[]` =
      `ErrorBarPoint | ErrorBarSamplesPoint`; an `ErrorBarSamplesPoint`
      (`{ x, samples, confidence? }`) derives mean ± CI, where the half-width is
      `zForConfidence(confidence) · SE` (SE = sample stddev / √n) — a new shared
      `stats.zForConfidence` helper (0.90→1.645, 0.95→1.96, 0.99→2.576),
      factored out of `regressionBand`'s own inline copy of the same three
      constants so the two call sites can't drift. Both keep the precomputed
      path as the default (a plain `BoxPlotGroupStats`/`ErrorBarPoint` computes
      nothing extra) and reuse the shared "report the raw input datum"
      convention: `BoxPlot`'s interaction payload is the original `BoxPlotGroup`
      (whichever shape was passed), not the derived summary. `violin-plot`
      already takes raw samples and (per B-dedup above) now computes its density
      via `stats.gaussianKde` directly, so it was never part of this item's
      remaining scope. Golden-value tests: `box-plot.stories.tsx`'s
      `RawSampleEntry` checks the derived five-number summary for samples
      `1..10` against the data-table view's exact rendered cells (min 1, Q1
      3.25, median 5.5, Q3 7.75, max 10 — hand-verified against d3-array's R-7
      quantile method); `error-bars.spec.tsx` (new) checks the derived mean ± CI
      for samples `[10,12,14,16,18]` against a hand-computed half-width, plus a
      custom confidence level, an n=1 collapse-to-mean case, and mixed
      precomputed/raw points in one overlay — using the same identity-yScale
      synthetic harness `annotation.spec.tsx` already established, so every
      assertion is an exact pixel-value check, not an approximation.
      `error-bars.stories.tsx` (new, following `#21`'s pattern) composes it as a
      real `children` overlay on a `LineChart`. Verified: `pnpm typecheck` /
      `pnpm test` (800 passing) / `pnpm build` all green; eslint clean on every
      touched file.
- [x] **`#18` FacetGrid.** Done: `facet-grid.stories.tsx` added with two
      stories, a 4-region "revenue by quarter" small-multiples grid in both.
      `SharedDomain` computes one `[0, max]` domain across every facet outside
      the grid and passes it into each cell (per the primitive's own doc comment
      — `FacetGrid` never touches domains itself, only layout + one shared
      legend below); `FreeDomain` lets each cell fit its own max. Since no chart
      component takes an external domain override, each cell is a small
      hand-drawn `scaleBand`/`scaleLinear` bar mini-chart rather than a full
      chart component — the realistic shape of how a caller actually wires a
      shared scale across cells today. Assertions check the geometry, not just
      "renders": in `SharedDomain`, NA's bars (the dataset's overall max) reach
      the cell top while EMEA's (a smaller region) don't, proving the scale is
      genuinely shared, not independently fit; in `FreeDomain`, every cell's own
      max reaches ITS OWN top. "Usage" scoped to this story-level composition
      rather than a new `apps/viz-dashboard` page/route — a real composition
      with a legend and two domain strategies, at a fraction of the cost of new
      routing/nav for a primitive with no existing per-facet time-series fixture
      data to reuse. Verified: `pnpm typecheck` / `pnpm test` (786 passing) /
      `pnpm build` all green; eslint clean.
- [x] **`#19` large-N.** Done: `LineChart` gains `decimateThreshold?: number` —
      past it, the DRAWN line/area (only; axes, hover, tooltip, and the data
      table still read every point) is downsampled via `chart/decimate.ts`'s
      LTTB. Opt-in and additive: omit it and every point draws exactly as
      before. Covers both the `variant="line"` and `variant="area"` cases
      ("line/area" in the item text), since one `variant` prop already drives
      both branches in this chart; `StackedAreaChart`'s own area is a
      multi-series stack sharing one x-index array across series, where LTTB
      (defined for a single y per point) doesn't have a clean per-series answer
      without breaking the stack's alignment — left out, not attempted.

      `ScatterPlot` gains `quadtreeHitRadius?: number` — when set, swaps each
                          point's own `onMouseEnter`/`onClick` listener for one plot-wide
                          `d3-quadtree` nearest-point lookup on a single transparent overlay
                          (one DOM listener regardless of point count, and the nearest point
                          wins even where dots overlap, unlike native per-element hit-testing
                          where whichever is on top of the DOM stack always wins). Chosen as the
                          reference chart over `BubbleChart` because it already has its own
                          tested `Interaction` story (real regression risk to rework); omitting
                          the prop keeps today's per-circle listeners byte-identical. New real
                          dependency: `d3-quadtree` (+ `@types/d3-quadtree`), added to the `viz`
                          pnpm catalog alongside the other `d3-*` deps (not the workspace
                          default catalog `pnpm add` reaches for by default — moved by hand to
                          keep the convention).

                          Found and fixed along the way: `apps/viz-dashboard/src/shell/ui.tsx`'s
                          `KpiTile` still forwarded its own `format` prop to `StatCard` as
                          `format={format}` — broken since `A2-tail` renamed that prop to
                          `valueFormat`, caught by running `viz-dashboard`'s own typecheck (not
                          part of the per-batch `nimbus-viz`-only gates used everywhere else this
                          session) after this batch. Fixed the one forwarding site; every
                          `KpiTile` call site elsewhere keeps its own `format` prop name
                          unchanged (that's `KpiTile`'s own API, not `StatCard`'s).

                          Stories: `line-chart.stories.tsx`'s `Decimated` (500 points, threshold
                          60) counts the drawn path's command letters directly, proving the
                          point count actually drops and the shape survives (not collapsed
                          flat); `scatter-plot.stories.tsx`'s `QuadtreeHitTest` fires a
                          `mousemove` at one point's exact rendered position and asserts
                          `onDatumHover` reports that point's real datum and index through the
                          one overlay listener.
                          Verified: `pnpm typecheck` / `pnpm test` (802 passing) / `pnpm build`
                          / `pnpm check:package-shape` / `pnpm check:bundle-size` all green;
                          `viz-dashboard`'s own `typecheck` and `build` also green; eslint clean
                          on every touched file.

- [ ] **`#20` brush / linked views.** Wire `src/chart/brush.tsx` + a
      `SelectionProvider` (broadcast a brushed domain / highlighted entity-set
      on `ENTITY_ID_ACCESSOR`); needs `@visx/zoom` for zoom.
- [x] **`#21` annotations demos.** Done: `annotation.stories.tsx`,
      `event-markers.stories.tsx`, `now-line.stories.tsx` added beside their
      components under a new "Overlays/" Storybook category (no chart story had
      composed ANY overlay before this, despite `#11`'s surface landing earlier
      — a real gap, not just these three). Each composes the overlay as a real
      `children` of a `LineChart` (not the synthetic mock scale context
      `annotation.spec.tsx` already unit-tests) and asserts the actual rendered
      geometry: `Annotation`'s ringed (`fill="none"`) marker at the scaled
      anchor with a non-degenerate leader line to the label; `EventMarkers`' one
      dashed full-height rule per event, each at a distinct x, with only the
      labeled ones showing text; `NowLine`'s one solid full-height rule, plus a
      second story proving a custom `label` actually replaces the default "Now"
      text rather than appending to it. Verified: `pnpm typecheck` / `pnpm test`
      (784 passing) / `pnpm build` all green; eslint clean.

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
