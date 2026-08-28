# Architecture, Selection Taxonomy, and RFC Skeleton

_Companion to the Project Brief. Status: scoping / pre-RFC._

## 1. The central design axis: catalog vs. grammar vs. hybrid

"Agent picks from a known set of types" and "low-level, build any visualization" pull against each other. Reconciling them is the RFC's central decision.

- **Catalog** — N discrete, named components (the microcharts model). Ideal for agent selection (the agent picks from an enum), but not "build anything."
- **Grammar / primitive layer** — e.g. visx, Observable Plot, or a Vega-Lite–style declarative spec. This is "build anything," but the agent must emit a *spec* rather than a type name, which is harder to constrain and validate.
- **Hybrid (recommended to evaluate first)** — a small primitive core, a curated catalog of named visualizations built on top, each carrying **machine-readable selection metadata**, all lazy-loaded. The agent's default path is "pick a named type, pass data"; the escape hatch is a raw spec for the long tail.

Candidate low-level foundations to evaluate in the RFC (not yet recommended): **visx**, **Observable Plot**, **Vega-Lite**, raw **D3**, **Recharts**. Each must be assessed for: expressiveness ("can it build any of the ~100?"), agent-friendliness (named types + validatable inputs), SSR/RSC support, bundle/lazy-loading behavior, and radix-colors theming.

### Selection-metadata contract (per catalog entry)
Each visualization in the catalog should declare, in machine-readable form, at minimum:
- the **intents** it serves,
- the **data shapes** it accepts,
- required/optional encodings and constraints,
- a human-readable "question it answers" string (microcharts-style),
- bundle size / lazy-load chunk.

This contract is what the backend and frontend key off. microcharts' `catalog.json` / `llms.txt` / `openapi.json` are a concrete precedent.

## 2. Why data-agnostic selection works: intent × data shape

The library should not be shaped by today's backend. But for an agent to *select* a visualization, selection must key off something domain-agnostic and stable. That something is the pair **(question intent × data shape)** — not the domain meaning of the data.

This mirrors established selection frameworks (FT Visual Vocabulary; Andrew Abela's Chart Chooser; Leland Wilkinson's Grammar of Graphics as realized in Vega-Lite). microcharts already sorts its catalog this way, by question.

### Question-intent taxonomy (15)
1. **TREND** — Is it trending over time?
2. **DELTA** — How much did it change (signed)?
3. **RANK** — Where does it rank?
4. **PART-WHOLE** — What is it made of (composition)?
5. **COMPARE** — Compare two or more things.
6. **DIST** — Show a distribution.
7. **TARGET** — Progress toward a goal/target.
8. **RANGE** — Is it in range / within a threshold?
9. **REL** — Relationship between two (or more) variables.
10. **COMP-TIME** — Composition over time.
11. **GEO** — Where geographically?
12. **FLOW** — What's the flow (in vs out / net)?
13. **BENCH** — Is this normal vs a benchmark?
14. **RETAIN** — Retention / cohort behavior.
15. **VALUE** — What is the single value / magnitude right now?

_Extends the FT Visual Vocabulary's 9 categories (deviation, correlation, ranking, distribution, change-over-time, part-to-whole, magnitude, spatial, flow) with commerce-native intents (TARGET, RANGE, RETAIN, VALUE)._

### Data-shape taxonomy (13)
single value · value vs target · time-ordered series · multiple time series · categorical magnitudes · ranking · part-to-whole · distribution · two-variable relationship · flows/net · cohort/retention matrix · geographic · event/timeline

### Intent × data-shape → candidate visualization

| Intent | Typical data shape | Primary viz | Secondary viz |
|---|---|---|---|
| TREND | time series | line / area | sparkline, candlestick |
| DELTA | time series / two values | slope, stat+delta | waterfall, diverging bar |
| RANK | ranking | horizontal bar | lollipop, ordered dot |
| PART-WHOLE | part-to-whole | stacked bar, donut | treemap, pie, icicle |
| COMPARE | categorical magnitudes | grouped bar | dumbbell, small multiples, radar |
| DIST | distribution | histogram | box plot, violin, Pareto |
| TARGET | value vs target | bullet | gauge, progress bar |
| RANGE | value + threshold band | line + reference band | gauge, control chart |
| REL | two-variable | scatter | bubble, heatmap, hexbin |
| COMP-TIME | multiple series | stacked area | streamgraph, 100% stacked bar |
| GEO | geographic | choropleth | bubble map, flow map |
| FLOW | flows / net | Sankey | waterfall, chord, funnel |
| BENCH | time series + band | line + benchmark band | control chart, bullet |
| RETAIN | cohort matrix | retention heatmap | cohort line curves |
| VALUE | single value | KPI stat card | big-number + sparkline |

## 3. radix-colors integration (constraint to validate)

radix ships **fixed 12-step scales** with light/dark/alpha variants built in. microcharts derives an **entire palette from a single accent**. These are different philosophies, so "radix-compatible" is a real requirement to design against — mainly a matter of mapping semantic roles onto radix scales:
- **accent** (primary emphasis),
- **positive / negative** (valence — must never be conveyed by color alone),
- **categorical 1..n** (a color-blind-safe sequence),
- **neutral ink** (default stroke/weight),
- plus light/dark handling.

Deserves its own RFC section; not a blocker now.

## 4. RFC skeleton

1. **Problem & goals** — the agentic-selection framing; why generality; success criteria.
2. **Users & jobs** — the persona/question research (see personas map doc).
3. **Selection taxonomy** — the intent × data-shape model and matrix above.
4. **Visualization catalog** — the prioritized type list derived from coverage (tiers below).
5. **Architecture decision** — catalog vs. grammar vs. hybrid; chosen foundation; the selection-metadata contract; how backend↔frontend agree on types.
6. **Theming & radix-colors** — semantic role mapping, light/dark, categorical scales, accessibility of color.
7. **Cross-cutting** — accessibility (keyboard, role="img", alt from data), SSR/RSC, responsiveness, i18n (currency/number/date across markets), bundle budgets & lazy loading.
8. **Agent integration** — machine-readable catalog surface (catalog.json/llms.txt equivalent), input validation, graceful degradation to a data table.
9. **Prioritization & phasing** — Tier 1/2/3 (below), telemetry-driven re-ranking.
10. **Open questions & risks.**

### First-pass prioritization (from coverage analysis)
- **Tier 1 (ship first — appear for nearly every persona):** KPI stat card (+delta/sparkline), time-series line/area, horizontal ranked bar, part-to-whole (stacked bar/donut/treemap), data table (universal fallback).
- **Tier 2 (broad, not universal):** grouped/comparison bar & small multiples, bullet/gauge/progress (TARGET/RANGE), funnel, heatmap (hour×day and cohort), histogram/box plot.
- **Tier 3 (specialized, decisive for specific jobs):** scatter/bubble, waterfall, choropleth/map, Sankey/chord/flow map, control chart / line+band, Pareto, stacked area/streamgraph, RFM grid, bump chart, parallel coordinates, radar.

**Guidance:** roughly five primitives (stat card, line, bar, part-to-whole, table) satisfy the majority of natural-language questions. Build Tier 1 robustly; make Tier 2 solid; treat Tier 3 as progressively-enhanced specialists triggered when the backend returns the matching data shape. Instrument question→intent→viz telemetry from day one to replace this first-pass ranking with measured demand.
