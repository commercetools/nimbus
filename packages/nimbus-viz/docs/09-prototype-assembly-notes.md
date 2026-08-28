# Prototype Assembly Notes — RFC Input

_Living log. As we prototype components breadth-first, this captures what the
act of assembling them teaches us — the cross-cutting details a solid RFC must
settle. Not a spec; evidence for one. Newest findings appended per batch._

The prototype lives in `packages/nimbus-viz/`. Run the gallery with
`pnpm --filter @commercetools/nimbus-viz gallery` (Vite, dev-only, resolves the
library from `./src`). Foundation = visx + Nimbus tokens (settled in Phase 0).

---

## Batch 1 — foundation + LineChart, BarChart, StatCard (2026-08-28)

Three chart families on purpose (time-series w/ axes, categorical bars, no-axis
card), to put the shared chrome under cross-shape pressure immediately. Verified
rendering in the gallery in both light and dark. Library typechecks, tsup-builds
(ESM+CJS+DTS), and the gallery bundles.

### What's confirmed working

- **Theming maps 1:1 onto Nimbus tokens.** The Spike-2 categorical sequence is
  literally aliases onto `color.system-palettes.<hue>.<mode>.<step>`, reached
  through one seam (`systemStep(hue, step, mode)` → `resolveRoles(mode)`).
  Charts hold zero literal colors. Light and dark both correct in-browser.
- **Fixed-order categorical + single-hue magnitude.** Multi-series lines take
  categorical roles in order (blue/orange/teal, CVD-safe); magnitude bars use
  one accent hue (color carries no meaning there — the category axis does).
  Matches the dataviz non-negotiables.
- **One shared SVG shell works.** `ChartFrame` (render-prop handing inner dims)
  is reused by line and bar; StatCard opts out entirely (it's HTML). Good sign
  the frame boundary is roughly right.
- **null gaps** via visx `defined` render correctly (Profit series gap).
- **Valence never color-alone** — StatCard delta carries arrow + sign + color.
- **visx v4** is all-in-lockstep at 4.0.0, modular/tree-shakeable. `BarRounded`
  gives per-corner rounding (top for columns, right for ranked bars) = the
  dataviz "rounded data-end" for free.

### What the assembly surfaced (open questions for the RFC)

1. **Theme needs surface _levels_, not one `surface`.** Charts sit on cards on a
   page — at least page / raised(card) / plot. The gallery had to hack a page
   background via `systemStep("gray", 2)` because roles expose only one surface.
   → Add a small surface scale to `ChartRoles`.
2. **Color mode is a prop, not wired to the host.** `ChartThemeProvider` takes
   `mode` directly (fine for the gallery). Production wiring = read the active
   Nimbus color mode. → Decide the binding (context bridge vs. prop).
3. **Margins are fixed constants.** Long y-tick labels and long category names
   (the ranked bar hard-codes `left: 100`) will clip or float. → Derive margins
   from measured tick/label metrics, or expose a margin prop with sensible auto.
4. **Hover/tooltip is re-implemented per chart and inconsistent.** Line uses a
   crosshair + SVG readout by x-index; bar uses opacity-dim on `<g>` hover; no
   shared contract. Also, index-based hover assumes x-aligned series. → Factor a
   shared interaction primitive; pick SVG-tooltip vs HTML-portal; define the
   nearest-point strategy (bisector) and the aligned-vs-sparse data contract.
5. **Data model is per-chart** (`Series` vs `CategoryDatum`). The selection
   engine (doc 06) will need either one normalized shape or per-chart adapters.
   These concrete shapes are the raw material for that metadata contract.
6. **Legend is HTML, axes are visx, tooltip is SVG.** Mixed rendering is fine
   but means a chart is a `<div>` wrapping an `<svg>` wrapping HTML-again for
   legends. → Settle the outer composition (where legend/title/toolbar live
   relative to the SVG) as a `ChartContainer` contract.
7. **TS ergonomics:** visx `tickLabelProps` needs `as const` to satisfy the
   `textAnchor` literal type. Minor, but worth a shared axis helper that bakes
   the themed defaults so every chart doesn't repeat it.

### Deferred integrations (staged for momentum, not dropped)

- **@commercetools/nimbus components** (DataTable fallback, layout, icons) —
  nimbus isn't built in this checkout and has no `source` export condition, so
  importing it needs a build or a Vite source alias. Charts prototype on visx +
  nimbus-tokens for now; the DataTable fail-safe and layout reuse come when we
  exercise the selection engine.
- **SSR / server render** — not yet exercised in the gallery (client-only). Line
  and bar are pure SVG and should server-render; to be verified.

### Immediate refactors these suggest (before the catalog grows)

- `ChartRoles`: add surface levels (page/raised/plot).
- A themed `Axes` helper (bakes tick label props, grid, formats).
- A shared hover/tooltip primitive + the series-data contract.

---

## Batch 2 — 3 refactors + DonutChart, StackedBarChart, ScatterPlot, Heatmap (2026-08-28)

Added arc, stacking, point, and matrix marks — deliberately different from the
axis/line/bar of batch 1 — to see where the batch-1 chrome holds and where it
strains. All seven families verified in the gallery, light and dark; library
typechecks and builds (~36 kB ESM).

### The three refactors from batch 1 — done, and they held

- **Surface levels** (`surface` raised + `surfacePage` recessed, elevation
  inverted for dark) — cards now visibly float above the page in dark mode; the
  gallery dropped its `systemStep` page-bg hack. Confirmed the theme needs ≥2
  surfaces.
- **Axes helper** (`GridRows`, `leftTickLabel`, `bottomTickLabel`) — line, bar,
  stacked, and scatter all consume it; the repeated `as const` tick-label
  boilerplate is gone.
- **SvgTooltip** extracted — reused by line (index hover) and scatter (point
  hover) unchanged. The box travels; only the _pointer logic_ differs (see
  below).

### What the new marks confirmed / surfaced

- **Color-as-identity vs. color-as-nothing is per-chart, and correct.** Donut
  and stacked assign categorical hues by slice/key (identity); magnitude bars
  use one accent (the axis is the identity). The sequential heatmap uses a
  single-hue ramp. All three color jobs now exercised against the same token
  source.
- **A stable entity→color mapping is now the clearest missing primitive.** Four
  charts assign categorical colors independently (by series index, by slice
  index, by stack-key index). Nothing guarantees "Returning" is the same color
  in the stacked bar as it would be in a line chart, or that a filter dropping a
  category doesn't repaint the survivors (a dataviz non-negotiable). → Introduce
  a shared categorical **color scale keyed by entity id**, resolved once, that
  every chart consumes. This is probably the single most important pre-catalog
  refactor.
- **Two hover modes are real, not one.** Line/area/stacked want _index/category_
  hover (snap to a column); scatter/bubble want _nearest-point_. The shared
  SvgTooltip serves both, but the hit-testing is different. → The shared
  interaction primitive should expose both modes (index vs. quadtree-nearest),
  not force one.
- **Sequential needs a hue _name_, not a resolved role.**
  `sequentialColor(hue, mode)` takes a token family (e.g. "blue") because a ramp
  spans steps, whereas the categorical/semantic roles are pre-resolved values.
  Fine, but it means the theme has two shapes of color API (resolved roles +
  ramp factory). Heatmap also still lacks a **gradient legend** — a gap for any
  sequential/diverging chart.
- **Stacked assumes all rows share segment keys in order.** Works, but the real
  contract (sparse keys, consistent ordering, color-by-key) is the same
  entity→color question above. Grouped bar (next) will pull on the same thread.
- **`ChartFrame`'s `background` prop went unused** — cards supply the surface.
  Likely drop it, or reserve it for standalone (card-less) embedding.

### Catalog coverage so far (doc 04)

Layer-1: LineChart, AreaChart (variant), Vertical/Horizontal Bar, StackedBar,
StatCard, Donut, Heatmap (base). Layer-3 specialist base: cohort heatmap. Next
to stress assembly further: **GroupedBar** (multi-series categorical — forces
the entity→color scale), and a **FLOW specialist** (Funnel, then the decisive
Sankey via `@visx/sankey`).

---

## Batch 3 — entity→color scale + GroupedBar, FunnelChart, SankeyDiagram (2026-08-28)

Built the color primitive the batch-2 notes flagged, retrofitted the four
multi-entity charts onto it, then added a multi-series bar and the two FLOW
specialists. Ten families now verified in the gallery, light and dark; library
typechecks and builds (~46 kB ESM).

### The entity→color scale — built and it works

`createColorScale(domain, categorical)` + `<ColorScaleProvider>` +
`useEntityColors(domain)` (`src/theme/color-scale.tsx`). Colors are assigned by
entity id in fixed order, never by rank or filtered index. Line, Donut, Stacked,
Scatter, Grouped, and Sankey all consume it. Demonstrated live:
**"New/Returning/Wholesale" are the same hues in the stacked bar and the grouped
bar** because both resolve through one dashboard-level scale.

### What this batch surfaced (RFC-level)

- **A single entity-id convention is now a hard requirement.** The scale keys on
  whatever string a chart passes — LineChart keys by `series.id`, others by
  category / group / stack-key. When the shared domain listed _labels_
  (`"Revenue"`) but the line keyed by _id_ (`"rev"`), the series silently missed
  the scale and got first-seen colors. This bit us in the gallery. → The RFC
  must fix ONE entity-id concept spanning every chart's data shape **and** the
  selection metadata, or the shared scale doesn't bind.
- **One throwing chart took down the whole page.** A bad Sankey config threw
  and, with no error boundary, blanked the entire dashboard. → Confirms doc 06's
  fail-safe must be real (resolver → DataTable, never throw) **and** the host
  should wrap each chart in an error boundary. Concrete, not theoretical.
- **Grouped and stacked are the same data, different layout.** `GroupedBarChart`
  reuses `StackRow` unchanged; the only difference is side-by-side vs. stacked.
  → Candidate for one "categorical multi-series" data type (shared with the line
  chart's series) and possibly one component with a `layout` prop.
- **Sankey via `@visx/sankey` renders proper proportional ribbons** — the
  decisive capability visx has and Vega-Lite lacks, now real in-repo. Two
  gotchas worth a contract: (1) d3-sankey **mutates its input** → the component
  clones nodes/links each render; (2) the **link key space must match the node
  id accessor** — leaving `nodeId` default (index) matches index-based links;
  setting `nodeId=name` while links use indices throws `missing: 0`. The
  flow-graph data contract must state indices-vs-ids and hold to it.
- **Funnel** is single-hue magnitude; plain rounded rects read fine — trapezoid
  connectors are cosmetic polish, not required.
- **visx types are clean** once flow node/link are `type` aliases (not
  interfaces) so they satisfy d3-sankey's index-signature generic. No `any`, no
  casts needed.

### Still open / next

- **DataTable fallback + the selection engine (doc 06) are the biggest gap.** We
  have chart breadth but not yet the "agent picks a chart" brain, nor the
  guaranteed table fallback the crash-finding shows we need. Strong candidate
  for the next batch: selection metadata + registry +
  `resolve({type,data,options})` → chart, fail-safe to a DataTable, telemetry
  hook — the point of the library.
- Shared interaction primitive (index vs. nearest-point) still deferred.
- Gradient legend for sequential/diverging still missing.

### Catalog coverage (doc 04) after batch 3

Layer-1: line, area, vertical/horizontal bar, grouped bar, stacked bar, donut,
stat card (table still missing). Layer-3 specialists: cohort heatmap, funnel,
Sankey. Infra: theme, color scale, responsive, lazy (not yet), chart frame,
axes, legend, SVG tooltip.

---

## Batch 4 — parallel build: 6 charts + the selection engine (2026-08-28)

Ran three background subagents in parallel against disjoint directories
(orchestrator kept the barrel, gallery, and shared types), then integrated in
one pass. Added **WaterfallChart, BulletChart, Gauge** (TARGET/DELTA family),
**Histogram, BoxPlot, Treemap** (DIST + hierarchical), and **the selection
engine + DataTable fallback** (the brain). All 16 chart families plus the
resolver verified in the gallery, light and dark; integrated package typechecks
and builds (~95 kB ESM). The parallelization worked cleanly — each agent's dirs
typechecked in isolation and composed with a barrel + gallery edit only.

### The brain works — and is visible

`resolve({ intent, data }, size)` → filter → rank → stable tie-break → render,
with a guaranteed fail-safe. In the gallery: a **COMPARE** request resolves to a
bar chart; a **GEO** request (no chart serves it) falls back to the themed
**DataTable** with a human-readable reason; malformed data does the same without
throwing. `<ResolvedChart>` additionally wraps the chosen chart in a
**render-time error boundary** — so selection covers _choosing_ and the boundary
covers _rendering_, together closing the batch-3 "one throwing chart blanked the
page" finding.

### RFC-level findings this batch produced

- **Abstract `acceptedShapes` cannot gate rendering by itself — the strongest
  finding.** One abstract shape maps to incompatible concrete structures:
  _part-to-whole_ is served by Donut from a flat `CategoryDatum[]` **and** by
  StackedBar from `StackRow[]`. Filtering on the abstract shape alone would let
  a chart "accept" data it can't draw. The engine added a concrete
  **`DataKind`** render-guard as the operative filter; `acceptedShapes` stays as
  the doc-06 contract. **The RFC must decide whether the metadata shape key is
  the abstract taxonomy, a concrete kind, or both.**
- **The single entity-id convention is now codified** as `ENTITY_ID_ACCESSOR`
  per shape (`series.id`, `datum.category`, `row.category`/`segment.key`,
  `point.group`, `row.label`, `stage.stage`); the resolver, render adapters, and
  `useEntityColors` all key on the same string. This is the batch-3 live bug,
  now a contract — **the RFC should ratify it as spanning data shapes AND
  selection metadata.**
- **The preset model is validated.** BarChart is registered as **two presets** —
  `bar-chart` (COMPARE-primary, vertical) and `ranked-bar-chart` (RANK-primary,
  horizontal) — one React component, two catalog entries with different
  metadata. This is exactly the doc-04/05 "preset = base + defaultProps +
  metadata" idea, and it's what makes RANK vs COMPARE resolve to different
  layouts.
- **Coverage gap:** flat `CategoryDatum[]` PART-WHOLE with >6 categories has
  only Donut (capped at 6) → it falls back to the table. Doc-06's own worked
  example (12-category → segmented bar) isn't reachable from flat data because
  no flat "segmented / 100% single-bar" preset exists yet. A real preset gap to
  fill.
- **Theme gap: no on-accent / on-categorical text role.** Treemap labels sit on
  saturated categorical fills and need contrast-safe light text; only the
  heatmap avoids this by thresholding a sequential `t`. Categorical fills have
  no scalar to threshold → the theme needs an explicit "text-on-fill" role.

### Smaller, concrete items

- **`format.ts` needs `formatSignedCompact`** (Waterfall composed signs
  locally).
- **Radial gotchas:** `@visx/shape` `Arc` is generic with no default → needs an
  explicit `<Arc<unknown>>`; the d3-shape angle convention (0 at 12 o'clock,
  clockwise) warrants a shared radial-angle helper for future gauges/dials.
- **visx name collisions:** `@visx/stats` `BoxPlot` and `@visx/hierarchy`
  `Treemap` clash with our component names → import aliases. `@visx/hierarchy`
  re-exports `hierarchy` (no extra d3 dep).
- **Label density**, again: Waterfall's category axis labels overlap at small
  widths and Bullet's value label can collide with the target tick — reinforces
  the deferred "measured margins + label-collision handling" need.
- StrictMode double-renders `<ResolvedChart>` in dev, so telemetry can
  double-emit there (harmless; note for any real telemetry wiring).

### Catalog coverage (doc 04) after batch 4

Layer-1: stat card, line/area, vertical/horizontal/grouped/stacked bar, donut,
histogram, **data table (as the fallback)**. Layer-2/3 specialists: heatmap
(cohort), funnel, Sankey, waterfall, bullet, gauge, box plot, treemap. Layer-4:
theme + entity color scale + sequential ramp, responsive, chart frame, axes,
legend, SVG tooltip, **the selection engine (metadata + registry + resolver +
telemetry) with error-boundary + DataTable fail-safe**. Still missing: Layer-2
overlays (reference line/band, target, benchmark), the remaining Tier-3 tail
(scatter done; still bump/slope/dumbbell/radar/control-chart/pareto/geo/RFM/
parallel-coords/streamgraph/calendar), `ChartFromSpec`, lazy-loading, the
machine-readable catalog surface, a shared interaction primitive, and a11y
depth.

---

## Batch 5 — Layer-2 overlays: the composition contract (2026-08-28)

Built the seven overlays doc 04 calls for — **ReferenceLine, ThresholdBand,
TargetMarker, TrendLine, ErrorBars, ConfidenceBand, BenchmarkSeries** — and
wired three base charts (LineChart, ScatterPlot, vertical BarChart) to host
them. All verified in the gallery, light and dark; library typechecks and
tsup-builds (~107 kB ESM, +12 kB for the overlay set). This is the piece that
unlocks the preset multiplier: one base + a stock overlay = a new named preset,
no new component.

### The composition contract (the batch's central finding)

- **Overlays compose as `children`, reading a published scale context.** A base
  chart wraps its inner plot in `<ChartScaleProvider>`
  (`src/chart/scale-context.tsx`) exposing a uniform
  `{ yScale, xScale, xBandwidth, innerWidth, innerHeight }`; overlays call
  `useChartScales()` and draw in the same margin-inset space as the marks.
  Consumer API is exactly the idiom you'd hope for:
  `<LineChart …><ThresholdBand … /><ReferenceLine … /></LineChart>`. **The RFC
  should ratify this as the overlay contract** — it makes "preset = base +
  overlay + defaults" literally a base element with overlay children.
- **The base chart owns scale-shape adaptation; overlays stay scale-agnostic.**
  Each chart adapts its native scale (time / linear / band) to the uniform
  accessors — line wraps its time scale, scatter its linear, bar centres on its
  band. So one `ReferenceLine` works across every host without knowing the x
  type. This adaptation seam is the reason the contract stays small.
- **Overlays are non-interactive by construction.** Every overlay wraps in
  `<g style={{ pointerEvents: "none" }}>`, so a full-width `ThresholdBand` rect
  can render _on top of_ the marks without stealing the hover/crosshair beneath
  it. That single rule let us keep ONE `children` slot (annotations on top)
  instead of splitting underlay/overlay layers. It's a clean default; a
  production API may still want an explicit behind-marks slot for opaque fills.
- **Overlay values can exceed the base chart's domain.** The host computes its
  y-domain from its own series; a `ConfidenceBand`/`ReferenceLine` beyond that
  range draws outside the plot (into the margin) — we hand-tuned the demo band
  to ±10 % to stay in-frame. → **RFC/impl decision: should a chart optionally
  union its overlays' extents into its scale?** (Probably yes, opt-in, since a
  target line above every bar is a real and common case.)

### Overlay-specific notes

- **ReferenceLine vs. TargetMarker earn their separateness.** ReferenceLine is a
  full-width dashed level (threshold/SLA). TargetMarker is an axis-anchored
  caret
  - faint guide ("the goal is _here_") that reads over bars without a dominating
    line. Both are value-axis primitives; both took the same `OverlayVariant`
    role enum (`neutral | accent | positive | negative`) so an overlay never
    names a hue — same discipline as the base charts.
- **TrendLine fits in data space, maps only endpoints.** Least-squares slope /
  intercept computed from the raw points, then two points mapped through the
  scales — no per-pixel work, degenerate (vertical) fits guarded to `null`.
- **ConfidenceBand = continuous, ErrorBars = discrete.** Same `{x, low, high}`
  shape; the band is a visx `Area` with `y0/y1`, the bars are capped whiskers.
  Keeping both is worth it — forecast envelopes vs. per-point CIs are different
  asks that doc 04 lumped into one row.
- **Transposed value axis is the one gap.** The contract is expressed as x/y, so
  the _ranked_ (horizontal) BarChart — whose value axis is x — is not yet an
  overlay host (it accepts `children` but ignores them). → The RFC's contract
  may be better phrased as **value-axis / category-axis** than x/y, so a
  transposed chart hosts the same overlays unchanged.
- **Label collisions, yet again.** On the area demo the `ThresholdBand` and
  `ReferenceLine` labels both right-anchor and overlap when their levels are
  close. Third sighting of the deferred "measured margins + label-collision"
  need — now firmly an RFC must-have, not a nice-to-have.
- Added `formatSignedCompact` (`+~s`) to `format.ts` — the batch-4 to-do; useful
  for signed overlay/delta labels.

### Catalog coverage (doc 04) after batch 5

Layer-2 overlays now exist: ReferenceLine, ThresholdBand, TargetMarker,
TrendLine, ErrorBars, ConfidenceBand, BenchmarkSeries (+ the
`ChartScaleProvider` contract they compose through). Base hosts wired:
line/area, scatter, vertical bar. Next: the **preset-registration pass** — turn
base × overlay × defaults × metadata into named catalog entries and grow
`chartRegistry` toward ~100 from the doc-02 intent×shape matrix and doc-03
persona questions.

---

## Batch 6 — the declarative preset catalog: 8 → 66 entries (2026-08-28)

Turned the "preset = base + overlays + defaults + metadata" idea into a real,
declarative catalog. `src/selection/presets.tsx` defines a `PresetDefinition`
(pure data) and a `presetToEntry` factory; `PRESETS` is **58 persona-grounded
presets** authored straight from the docs/03 question tables, each reusing one
of the eight registered base charts — **zero new React components**. Registry
went 8 → **66 entries** (8 canonical + 58 presets); library typechecks and
tsup-builds (~130 kB ESM, +23 kB). Verified in the gallery (`resolveByName`
renders `sla-compliance-over-time` with its options-driven band + SLA line, and
`roas-by-channel`, both live).

### The batch's central findings (RFC-level)

- **Presets are pure config — doc-04 open question #2 answered.** Every one of
  the 58 is
  `{ name, base, overlays[], defaults, intents, shapes, dataKinds, constraints, question, persona }`
  fed through one factory. Nothing needed a bespoke component. The factory even
  threads overlay children into the overlay-hosting bases (line / vertical bar /
  scatter) and drops them for the rest. **The RFC should adopt the declarative
  preset as the catalog unit** and keep the ~100 count firmly on the config side
  of the components-vs-presets line.
- **A canonical/preset split keeps bare-intent resolution crisp AS the catalog
  grows — the load-bearing structural decision.** Flooding one registry with
  dozens of TREND-serving line presets would make `resolve({intent, data})` rank
  ~20 identical-scoring entries and tie-break by registration order — a
  semantically arbitrary pick (it can't tell "API error rate" from "revenue"
  when intent+shape are identical). So entries now carry `canonical?: boolean`:
  `resolve()` ranks **only canonical** entries (one-ish per intent×kind), and
  the persona presets are addressed **by name** via the new `resolveByName`.
  This directly matches doc-04's "the agent selects presets, not raw
  components": by-name is the _primary_ agent path; bare-intent `resolve` is the
  fallback for when the agent has only an intent. **The RFC must decide the two
  selection surfaces explicitly** — (1) intent×shape → canonical chart, (2)
  persona-question → named preset — because intent+shape alone is provably too
  coarse to disambiguate the ~100 catalog.
- **The persona question IS the disambiguating key.** What separates
  `refund-rate-trend` from `api-error-rate-trend` (both line, both series, both
  TREND/RANGE) is the `questionString` + `persona`, not the chart mechanics.
  That argues the machine-readable catalog surface the agent matches against
  should be keyed on the question/persona embedding, with intent+shape as a
  coarse pre-filter — not the other way round.

### Smaller, concrete items

- **`overlays[]` + `persona` are now real metadata fields** (types.ts), the
  fields docs/06 anticipated. `overlays` lists the composed overlay names for
  the catalog surface; 20 of the 58 presets compose at least one.
- **Overlay values arrive via `options`, not the data.** Presets bake sensible
  fallbacks (e.g. chargeback `VAMP 1.5%`) but read
  `options.target / rangeLow / rangeHigh / benchmark / band / errors` so a
  caller tunes the threshold to their metric. Data-derived overlays (TrendLine
  off the scatter's own points) need nothing. This is the clean division:
  **static thresholds = options; derived summaries = data.**
- **`resolveByName` is fail-safe like `resolve`.** Unknown name, malformed data,
  or a kind the preset can't draw all fall back to the DataTable with a readable
  reason; it never throws. Guarded on `dataKinds` only (the agent chose the
  preset deliberately — we don't second-guess intent/shape), so it's permissive
  where `resolve` is strict.
- **Extraction stayed `any`-free.** Option/data readers narrow `unknown` with
  small guards; the factory's per-base defaults (`RANK`/`WEIGHT`/`KIND`/`SHAPES`
  maps) keep each preset to just what's distinctive — most are 5–7 lines.
- **Adapters were extracted to `render-adapters.tsx`** so registry ↔ presets
  share the base renderers with no import cycle; the renderers gained an
  `overlays?: ReactNode` param.

### Path from 66 to ~100 (not a limitation of the model — a wiring gap)

The catalog is capped at the **8 bases the brain currently recognizes** (series
/ category / stack-row / scatter / heat-row / funnel). The DIST family
(histogram, box plot), VALUE (stat card), DELTA (waterfall), and GEO (map) chart
components exist but aren't yet wired into the resolver's `DataKind` taxonomy or
given render adapters — wiring those unlocks the ~30 DIST/VALUE/DELTA/GEO
persona questions in docs/03 and takes the catalog to ~100. That's the obvious
next batch.

### Catalog coverage (doc 04) after batch 6

Layer-5 presets are now real and declarative: **58 named presets** across TREND,
RANGE, TARGET, COMPARE, RANK, PART-WHOLE, COMP-TIME, REL, RETAIN, DIST(2nd), and
FLOW, spanning ~16 of the 17 personas, plus the two selection surfaces
(`resolve` canonical + `resolveByName`). Still missing (unchanged): the
DIST/VALUE/DELTA/GEO base-wiring above, the remaining Tier-3 chart tail,
`ChartFromSpec`, lazy-loading, a shared interaction primitive, measured
margins + label-collision handling (now sighted in every overlay/preset batch),
and a11y depth.

### Batch 6a — configuration signature: 66 entries collapse to 19 configs

Browsing the catalog surfaced that the **persona axis and the configuration axis
are separable**, and conflating them reads as duplication: `revenue-trend`,
`margin-trend`, `csat-nps-trend`, … are one configuration (`LineChart`) asked by
eight personas. Added a `configLabel` to the metadata — a structural signature
of **base + variant + sorted overlay set**, ignoring persona, annotation text,
and threshold values (two entries with the same label render identically for the
same data). The 66 entries collapse to **19 distinct configurations**; the
gallery's catalog browser now defaults to the deduped "Configurations" view
(with a "Presets" toggle for the per-persona list, and each config expandable to
the presets that share it).

**RFC finding:** the ~100 catalog is ~20 configurations × personas, not ~100
independent charts. That reframes the count honestly (a small, enumerable
configuration space; a large, open persona/question space) and suggests the
machine-readable catalog should carry the config signature as a first-class
field so an agent can reason about "distinct chart shapes" separately from
"which question."
