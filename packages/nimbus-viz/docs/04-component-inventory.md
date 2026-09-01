# Component Inventory — What We Actually Build

_Companion to docs 01–03. Status: **prototype-built** — the counts below are now
actuals from `packages/nimbus-viz`, not estimates. See doc 09 for the
batch-by-batch build log._

> **Update (2026-08): superseded counts.** This stays as the historical build
> log; the authoritative live catalog is the package **README**. Current shipped
> count is **46 components** (45 charts exported from the barrel + `DataTable`
> via the selection barrel), enforced by `src/components/catalog.spec.ts`. Since
> this log was written, `ChordDiagram` shipped (no longer "cut"/deferred), the
> empty `ridgeline-plot/` stub was removed, and `TileGridMap` was subsequently
> removed (tile-grid cartogram — dropped as out of scope).
> `EmptyState`/`LoadingSkeleton` (Layer 4) and
> `Brush`/`Zoom`/`AnnotationCallout` (Layer 2) remain unbuilt — tracked in the
> roadmap.

## Read this first

- **Components ≠ catalog presets — validated.** The agent-selectable catalog is
  mostly **presets**: a base component + overlay(s) + default props + selection
  metadata, registered under a name. A preset is configuration, not a new React
  component. Actuals: **~45 React components written**, driving a **91-entry
  catalog** (19 canonical + 72 presets) across **~32 distinct visual
  configurations**. The multiplier is real: a handful of bases × overlays ×
  defaults × question metadata = the catalog.
- **Build-vs-wrap — resolved.** We wrapped **visx**; Layer 0 (marks/scales) is
  provided, so we wrote only thin chart-chrome, not primitives. Dependency
  reality worth recording: only `@visx/*` + `d3-array` / `d3-format` /
  `d3-time-format` resolve at runtime — `d3-shape` / `d3-scale` / `d3-time` are
  **not** deps (use the `@visx` wrappers). typecheck-clean ≠ runtime-resolvable;
  the build is the gate.
- **Personas were scaffolding, not architecture.** The 17 personas (doc 03)
  existed only to generate the ~200 questions, which yielded the intent/shape
  taxonomy and the **build-order prioritization** (which chart types first).
  Beyond that they are not a first-class concern: on a preset the `persona` is
  optional **provenance**; the selection key is the **question**, not the
  persona.
- **"Exhaustive" now holds for Layers 1–4** (all built except the deferrals
  below); Layer 3's tail is complete bar the cut/deferred entries.

## Count summary (built vs. planned)

| Layer | What                     | Planned            | Built                                           | Remaining                                                         |
| ----- | ------------------------ | ------------------ | ----------------------------------------------- | ----------------------------------------------------------------- |
| 0     | Core primitives          | ~10 (0–3 wrapping) | chart-chrome only (visx provides marks)         | —                                                                 |
| 1     | Base chart families      | 18                 | 17                                              | **GeoMap** (deferred — no reliable boundary data)                 |
| 2     | Overlays / annotations   | 9                  | 7                                               | AnnotationCallout, Brush/Zoom (+ extract Crosshair)               |
| 3     | Specialized charts       | 17                 | 15                                              | **ChordDiagram** (cut — dense/niche, redundant w/ Heatmap+Sankey) |
| 4     | Infrastructure / shared  | 10                 | 6                                               | LazyChart, ChartFromSpec, EmptyState, LoadingSkeleton             |
| —     | **Components we write**  | **~54**            | **~45**                                         | ~9, of which only GeoMap is a real chart                          |
| 5     | Catalog presets (config) | ~100               | **91** (19 canonical + 72 presets, ~32 configs) | grows with more questions                                         |

---

## Layer 0 — Core primitives

_Build only if not wrapping a foundation. If wrapping, most are provided._

| Component                  | Notes                                 |
| -------------------------- | ------------------------------------- |
| ChartFrame / SVG container | viewBox, responsive sizing, margins   |
| Axis                       | one component, orientation prop (x/y) |
| Gridlines                  | major/minor                           |
| Legend                     | categorical / gradient                |
| Tooltip / FocusReadout     | hover + keyboard focus value readout  |
| Line (mark)                | primitive path                        |
| Area (mark)                | filled path                           |
| Rect / Bar (mark)          | primitive                             |
| Point / Symbol (mark)      | circle + symbol set                   |
| Arc (mark)                 | for donut/pie                         |
| TextLabel (mark)           | data labels                           |

Scales, color scales, and clip/gradient defs are utilities/hooks, not
components.

## Layer 1 — Base chart families

| Component                   | Accepts (data shapes)             | Serves (intents)                   | Tier |
| --------------------------- | --------------------------------- | ---------------------------------- | ---- |
| LineChart (1..n series)     | time series, multiple time series | TREND, TARGET, RANGE, BENCH, DELTA | 1    |
| AreaChart (+ stacked)       | time series, multiple series      | TREND, COMP-TIME                   | 1    |
| VerticalBarChart            | categorical magnitudes            | COMPARE, RANK                      | 1    |
| HorizontalBarChart (ranked) | ranking                           | RANK                               | 1    |
| GroupedBarChart             | categorical (multi-series)        | COMPARE                            | 2    |
| StackedBarChart (+100%)     | part-to-whole, categorical        | PART-WHOLE, COMP-TIME              | 1    |
| Histogram                   | distribution                      | DIST                               | 2    |
| BoxPlot                     | distribution                      | DIST                               | 2    |
| ScatterPlot                 | two-variable                      | REL                                | 3    |
| BubbleChart                 | two-variable + size               | REL, COMPARE                       | 3    |
| Heatmap / Matrix            | matrix, cohort, time×category     | TREND, RETAIN, DIST                | 2    |
| DonutChart / PieChart       | part-to-whole                     | PART-WHOLE                         | 2    |
| BulletChart                 | value vs target                   | TARGET, RANGE                      | 2    |
| Gauge                       | value vs target/threshold         | TARGET, RANGE                      | 2    |
| StatCard / BigNumber        | single value (+prior)             | VALUE, DELTA                       | 1    |
| GeoMap (choropleth/bubble)  | geographic                        | GEO                                | 3    |
| Sparkline                   | time series (micro)               | TREND                              | 1    |
| DataTable                   | any tabular                       | fallback for all                   | 1    |

## Layer 2 — Overlays / annotations

_Composable onto base charts; each is one component reused everywhere._

| Component                     | Adds intent     | Used on             |
| ----------------------------- | --------------- | ------------------- |
| ReferenceLine                 | TARGET          | line, bar, scatter  |
| ReferenceBand / ThresholdBand | RANGE           | line, area          |
| TargetMarker                  | TARGET          | bar, bullet         |
| TrendLine (regression)        | REL             | scatter             |
| ConfidenceBand / ErrorBars    | RANGE, COMPARE  | line, bar           |
| BenchmarkSeries               | BENCH           | line, bar           |
| AnnotationCallout             | —               | any                 |
| BrushSelection / Zoom         | — (interaction) | line, area, scatter |
| Crosshair cursor              | — (interaction) | line, area          |

## Layer 3 — Specialized charts

_Not reducible to base + overlay. Comprehensive but extensible._

| Component                       | Accepts                    | Serves           | Tier                 |
| ------------------------------- | -------------------------- | ---------------- | -------------------- |
| FunnelChart                     | ordered stages             | FLOW             | 2                    |
| SankeyDiagram                   | flows / net                | FLOW             | 3                    |
| WaterfallChart                  | signed components          | DELTA, FLOW      | 3                    |
| CohortRetentionHeatmap          | cohort matrix              | RETAIN           | 2                    |
| CohortTriangle                  | cohort matrix              | RETAIN           | 3                    |
| ControlChart (SPC)              | time series + limits       | BENCH, RANGE     | 3                    |
| ParetoChart                     | distribution (ranked+cum)  | DIST             | 3                    |
| Treemap                         | hierarchical part-to-whole | PART-WHOLE       | 3                    |
| RFMGrid                         | 2-D segmentation           | PART-WHOLE, DIST | 3                    |
| BumpChart                       | rank over time             | RANK, TREND      | 3                    |
| SlopeChart                      | two-moment change          | DELTA, COMPARE   | 3                    |
| DumbbellChart                   | paired categorical         | COMPARE          | 3                    |
| ParallelCoordinates             | multivariate               | REL              | 3                    |
| RadarChart                      | multivariate profile       | COMPARE          | 3                    |
| CalendarHeatmap (activity grid) | date-indexed values        | TREND, DIST      | 2                    |
| ChordDiagram                    | relationship matrix        | REL, FLOW        | 3 (candidate to cut) |
| Streamgraph                     | multiple series over time  | COMP-TIME        | 3                    |

_Candidates to reconsider in a commerce context: Candlestick/OHLC
(finance-specific), Chord (dense/niche)._

## Layer 4 — Infrastructure / shared

| Component / module         | Role                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| ThemeProvider              | radix-colors → semantic roles (accent, positive, negative, categorical 1..n, ink); light/dark |
| ResponsiveContainer        | size observation, aspect handling                                                             |
| LazyChart                  | dynamic import + suspense per chart type                                                      |
| ChartRegistry / Selector   | metadata-driven picker: filter by data shape, rank by intent (module, not visual)             |
| ChartFromSpec              | renders a declarative spec (the "build anything" escape hatch)                                |
| EmptyState / NoData        | graceful no-data render                                                                       |
| BadDataFallback            | renders on NaN/Infinity/empty without throwing                                                |
| LoadingSkeleton            | pre-data placeholder                                                                          |
| a11y helpers (hook)        | alt text from data, keyboard nav, role="img"                                                  |
| i18n/format helpers (hook) | currency/number/date across markets                                                           |

## Layer 5 — Catalog presets (config, not components) — validated

A preset is **pure config** —
`def({ name, base, overlays[], defaults, intents, dataKinds, constraints, question, canonical, persona? })`
turned into a registry entry by one factory (`presetToEntry`). No preset is a
new React component; every one reuses a Layer 1–3 base. Example:
`sla-compliance-over-time` = LineChart + ThresholdBand + ReferenceLine +
defaults, tagged `intents:[RANGE,TREND(2nd)]`. The agent selects presets by
name, not raw components.

**The ~100 = ~20 configurations × questions (config-signature finding).** Each
entry carries a `configLabel` — a structural signature of _base + variant +
overlay set_ that ignores persona/labels/threshold values. The 91 entries
collapse to **~32 distinct visual configurations** (many under 20 are the
workhorse bases; the rest are overlay combinations). So the catalog has a
**small, enumerable configuration space** and a **large, open question space**
layered on top. The RFC's machine-readable catalog should carry `configLabel` as
a first-class field so an agent can reason about "distinct chart shapes"
separately from "which question."

## Open questions for the RFC — mostly resolved by the prototype

1. **Build-vs-wrap — resolved:** wrapped visx; Layer 0 is provided.
2. **Are presets pure config? — resolved: yes.** All 72 presets are config
   through one factory; none needed a bespoke component. (A form needing truly
   bespoke layout would just be a new Layer 1–3 base with its own presets.)
3. **Which Layer 3 in v1? — resolved:** all built except **ChordDiagram** (cut)
   and **GeoMap** (deferred, Layer 1, pending a licensed boundary-data source).
4. **Selection-metadata schema — shipped** (see doc 06 "fields as shipped").
   Still open for the RFC: a **data discriminator** vs. structural duck-typing,
   and a **typed per-chart options contract** (radar axes, parallel dimensions,
   control limits currently ride an untyped options bag).
