# Component Inventory — What We Actually Build

_Companion to docs 01–03. Status: design proposal for RFC ratification._

## Read this first
- **Components ≠ catalog presets.** The ~100 agent-selectable types are mostly **presets**: a base component + overlay(s) + default props + selection metadata, registered under a name. A preset is configuration, not a new React component. Therefore the number of React components we *write* is ~45–60; the *catalog* built on them is ~100.
- **This is a proposal, not sourced fact.** Personas/intents/shapes (docs 02–03) are researched; this component split is an architecture decision for the RFC to confirm.
- **Counts are conditional on the build-vs-wrap fork (doc 02 §1).** If we wrap visx / Observable Plot / Vega-Lite, Layer 0 is largely provided; if we build on raw D3, we own Layer 0.
- **"Exhaustive" is honest for Layers 1/2/4, comprehensive-but-extensible for Layer 3** (the specialist long tail will grow as we work through the catalog).

## Count summary
| Layer | What | Approx. components |
|---|---|---|
| 0 | Core primitives | ~10 (0–3 if wrapping) |
| 1 | Base chart families | 18 |
| 2 | Overlays / annotations | 9 |
| 3 | Specialized charts | 17 |
| 4 | Infrastructure / shared | 10 |
| — | **Components we write** | **~54 (≈44 excl. Layer 0 if wrapping)** |
| 5 | Catalog presets (config, not components) | ~100 |

---

## Layer 0 — Core primitives
_Build only if not wrapping a foundation. If wrapping, most are provided._

| Component | Notes |
|---|---|
| ChartFrame / SVG container | viewBox, responsive sizing, margins |
| Axis | one component, orientation prop (x/y) |
| Gridlines | major/minor |
| Legend | categorical / gradient |
| Tooltip / FocusReadout | hover + keyboard focus value readout |
| Line (mark) | primitive path |
| Area (mark) | filled path |
| Rect / Bar (mark) | primitive |
| Point / Symbol (mark) | circle + symbol set |
| Arc (mark) | for donut/pie |
| TextLabel (mark) | data labels |

Scales, color scales, and clip/gradient defs are utilities/hooks, not components.

## Layer 1 — Base chart families

| Component | Accepts (data shapes) | Serves (intents) | Tier |
|---|---|---|---|
| LineChart (1..n series) | time series, multiple time series | TREND, TARGET, RANGE, BENCH, DELTA | 1 |
| AreaChart (+ stacked) | time series, multiple series | TREND, COMP-TIME | 1 |
| VerticalBarChart | categorical magnitudes | COMPARE, RANK | 1 |
| HorizontalBarChart (ranked) | ranking | RANK | 1 |
| GroupedBarChart | categorical (multi-series) | COMPARE | 2 |
| StackedBarChart (+100%) | part-to-whole, categorical | PART-WHOLE, COMP-TIME | 1 |
| Histogram | distribution | DIST | 2 |
| BoxPlot | distribution | DIST | 2 |
| ScatterPlot | two-variable | REL | 3 |
| BubbleChart | two-variable + size | REL, COMPARE | 3 |
| Heatmap / Matrix | matrix, cohort, time×category | TREND, RETAIN, DIST | 2 |
| DonutChart / PieChart | part-to-whole | PART-WHOLE | 2 |
| BulletChart | value vs target | TARGET, RANGE | 2 |
| Gauge | value vs target/threshold | TARGET, RANGE | 2 |
| StatCard / BigNumber | single value (+prior) | VALUE, DELTA | 1 |
| GeoMap (choropleth/bubble) | geographic | GEO | 3 |
| Sparkline | time series (micro) | TREND | 1 |
| DataTable | any tabular | fallback for all | 1 |

## Layer 2 — Overlays / annotations
_Composable onto base charts; each is one component reused everywhere._

| Component | Adds intent | Used on |
|---|---|---|
| ReferenceLine | TARGET | line, bar, scatter |
| ReferenceBand / ThresholdBand | RANGE | line, area |
| TargetMarker | TARGET | bar, bullet |
| TrendLine (regression) | REL | scatter |
| ConfidenceBand / ErrorBars | RANGE, COMPARE | line, bar |
| BenchmarkSeries | BENCH | line, bar |
| AnnotationCallout | — | any |
| BrushSelection / Zoom | — (interaction) | line, area, scatter |
| Crosshair cursor | — (interaction) | line, area |

## Layer 3 — Specialized charts
_Not reducible to base + overlay. Comprehensive but extensible._

| Component | Accepts | Serves | Tier |
|---|---|---|---|
| FunnelChart | ordered stages | FLOW | 2 |
| SankeyDiagram | flows / net | FLOW | 3 |
| WaterfallChart | signed components | DELTA, FLOW | 3 |
| CohortRetentionHeatmap | cohort matrix | RETAIN | 2 |
| CohortTriangle | cohort matrix | RETAIN | 3 |
| ControlChart (SPC) | time series + limits | BENCH, RANGE | 3 |
| ParetoChart | distribution (ranked+cum) | DIST | 3 |
| Treemap | hierarchical part-to-whole | PART-WHOLE | 3 |
| RFMGrid | 2-D segmentation | PART-WHOLE, DIST | 3 |
| BumpChart | rank over time | RANK, TREND | 3 |
| SlopeChart | two-moment change | DELTA, COMPARE | 3 |
| DumbbellChart | paired categorical | COMPARE | 3 |
| ParallelCoordinates | multivariate | REL | 3 |
| RadarChart | multivariate profile | COMPARE | 3 |
| CalendarHeatmap (activity grid) | date-indexed values | TREND, DIST | 2 |
| ChordDiagram | relationship matrix | REL, FLOW | 3 (candidate to cut) |
| Streamgraph | multiple series over time | COMP-TIME | 3 |

_Candidates to reconsider in a commerce context: Candlestick/OHLC (finance-specific), Chord (dense/niche)._

## Layer 4 — Infrastructure / shared
| Component / module | Role |
|---|---|
| ThemeProvider | radix-colors → semantic roles (accent, positive, negative, categorical 1..n, ink); light/dark |
| ResponsiveContainer | size observation, aspect handling |
| LazyChart | dynamic import + suspense per chart type |
| ChartRegistry / Selector | metadata-driven picker: filter by data shape, rank by intent (module, not visual) |
| ChartFromSpec | renders a declarative spec (the "build anything" escape hatch) |
| EmptyState / NoData | graceful no-data render |
| BadDataFallback | renders on NaN/Infinity/empty without throwing |
| LoadingSkeleton | pre-data placeholder |
| a11y helpers (hook) | alt text from data, keyboard nav, role="img" |
| i18n/format helpers (hook) | currency/number/date across markets |

## Layer 5 — Catalog presets (config, not components)
A preset = `{ name, baseComponent, overlays[], defaultProps, selectionMetadata }`. This is where the ~100 count comes from; presets reuse Layer 1–3 components. Example: `sla-compliance-over-time` = LineChart + ReferenceBand + defaults, tagged `intents:[RANGE,TREND] shapes:[time series]`. The agent selects presets, not raw components.

## Open questions for the RFC
1. Build-vs-wrap decision determines whether Layer 0 is ours.
2. Are presets pure config, or do some warrant dedicated components? (Proposed: pure config unless a form needs bespoke layout.)
3. Which Layer 3 types are in v1 vs deferred? (Proposed: Tier-2 specialized in v1; Tier-3 progressively.)
4. Selection-metadata schema (the contract each component/preset declares) — needs its own spec.
