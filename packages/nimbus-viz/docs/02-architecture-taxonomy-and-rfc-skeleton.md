# Architecture, Selection Taxonomy, and RFC Skeleton

_Companion to the Project Brief. Status: **prototype-validated** — the hybrid
below was built end-to-end in `packages/nimbus-viz` (91-entry catalog on ~45
components); this doc now records the decisions the prototype settled. See doc
09 for the build log._

## 1. The central design axis: catalog vs. grammar vs. hybrid — resolved: hybrid

"Agent picks from a known set of types" and "low-level, build any visualization"
pull against each other. **The prototype resolved this in favor of the hybrid**,
and it held up.

- **Catalog** — N discrete, named components (the microcharts model). Ideal for
  agent selection (the agent picks from an enum), but not "build anything."
- **Grammar / primitive layer** — e.g. visx, Observable Plot, or a
  Vega-Lite–style declarative spec. This is "build anything," but the agent must
  emit a _spec_ rather than a type name, which is harder to constrain and
  validate.
- **Hybrid (chosen, built)** — a small primitive core, a curated catalog of
  named visualizations on top, each carrying **machine-readable selection
  metadata**. The agent's default path is "pick a named type, pass data"
  (`resolveByName`) or "give an intent + data, get the best chart" (`resolve`);
  both fail safe to a DataTable. The escape hatch is a raw spec for the long
  tail — **`ChartFromSpec`, the one still-deferred piece.**

**Foundation — chosen: visx.** Of the candidates (visx, Observable Plot,
Vega-Lite, raw D3, Recharts), the prototype built on **visx**: it supplies the
marks/scales (so Layer 0 is provided, not ours), composes as plain React/SVG
(good SSR/RSC and per-chart lazy-loading), and takes theming as props.
Dependency reality to carry into the RFC: only `@visx/*` + `d3-array` /
`d3-format` / `d3-time-format` resolve at runtime — `d3-shape` / `d3-scale` /
`d3-time` are **not** deps; use the `@visx` wrappers. (Observable Plot /
Vega-Lite remain reasonable alternatives if a spec-first escape hatch becomes
primary; not needed for the catalog path.)

### Selection-metadata contract (per catalog entry) — as built

Each entry declares, in machine-readable form (the shipped shape — see doc 06):

- the **intents** it serves, each tagged `primary | secondary`;
- the **abstract data shapes** it accepts (`acceptedShapes`, the coarse filter);
- the **concrete data kinds** it can actually render (`dataKinds`, the render
  guard) — a distinction the prototype forced: abstract shape does not uniquely
  determine renderability (part-to-whole is both flat `CategoryDatum[]` → donut
  and `StackRow[]` → stacked bar);
- hard **constraints** (`maxCategories`, `requiresTarget`, `minSeries`,
  `requiresTimeAxis`, `minSampleSize`, `hierarchy`);
- `perceptualRank` and `bundleWeight` (ranking inputs);
- a human-readable **`questionString`** — the microcharts-style "question it
  answers," and the key that distinguishes presets sharing an intent × shape;
- **`canonical`** — whether it's a bare-intent answer (`resolve` ranks it) or a
  name-only preset (`resolveByName`);
- **`configLabel`** — the structural configuration signature (base + variant +
  overlay set) that dedups the catalog to its ~20 distinct configurations;
- optional `overlays[]` (composed overlay names) and `persona` (**provenance
  only** — personas generated the questions and the build order; they are not a
  selection axis).

This contract is what the backend and frontend key off. microcharts'
`catalog.json` / `llms.txt` / `openapi.json` are a concrete precedent.

## 2. Why data-agnostic selection works: intent × data shape

The library should not be shaped by today's backend. But for an agent to
_select_ a visualization, selection must key off something domain-agnostic and
stable. That something is the pair **(question intent × data shape)** — not the
domain meaning of the data. **Prototype-validated:** the resolver keys off
exactly this pair for its canonical answers, and the concrete `DataKind` (below)
is the render guard on top of the abstract shape.

This mirrors established selection frameworks (FT Visual Vocabulary; Andrew
Abela's Chart Chooser; Leland Wilkinson's Grammar of Graphics as realized in
Vega-Lite). microcharts already sorts its catalog this way, by question.

> **Two selection surfaces (see doc 06).** intent × shape is enough to pick the
> single **canonical** chart, but it is provably too coarse to disambiguate
> _presets_ (many are line + series + TREND). The distinguishing key there is
> the **question**, so the agent addresses presets by name (`resolveByName`)
> while bare intent + data goes through `resolve`. Personas are not part of this
> axis — they were only the generative source of the questions and the build
> ordering.

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

_Extends the FT Visual Vocabulary's 9 categories (deviation, correlation,
ranking, distribution, change-over-time, part-to-whole, magnitude, spatial,
flow) with commerce-native intents (TARGET, RANGE, RETAIN, VALUE)._

### Data-shape taxonomy (14)

single value · value vs target · time-ordered series · multiple time series ·
categorical magnitudes · ranking · part-to-whole · distribution · two-variable
relationship · **multivariate** · flows/net · cohort/retention matrix ·
geographic · event/timeline

> Started at 13; the prototype added a **14th, `multivariate`** (3+ variables
> per record), when radar / parallel-coordinates landed — the 13 had no home for
> it. RFC action: adopt the 14th shape. (Concrete render kinds are a separate,
> finer axis — 13 `DataKind`s in the implementation — see doc 06.)

### Intent × data-shape → candidate visualization

| Intent     | Typical data shape       | Primary viz           | Secondary viz                    |
| ---------- | ------------------------ | --------------------- | -------------------------------- |
| TREND      | time series              | line / area           | sparkline, candlestick           |
| DELTA      | time series / two values | slope, stat+delta     | waterfall, diverging bar         |
| RANK       | ranking                  | horizontal bar        | lollipop, ordered dot            |
| PART-WHOLE | part-to-whole            | stacked bar, donut    | treemap, pie, icicle             |
| COMPARE    | categorical magnitudes   | grouped bar           | dumbbell, small multiples, radar |
| DIST       | distribution             | histogram             | box plot, violin, Pareto         |
| TARGET     | value vs target          | bullet                | gauge, progress bar              |
| RANGE      | value + threshold band   | line + reference band | gauge, control chart             |
| REL        | two-variable             | scatter               | bubble, heatmap, hexbin          |
| COMP-TIME  | multiple series          | stacked area          | streamgraph, 100% stacked bar    |
| GEO        | geographic               | choropleth            | bubble map, flow map             |
| FLOW       | flows / net              | Sankey                | waterfall, chord, funnel         |
| BENCH      | time series + band       | line + benchmark band | control chart, bullet            |
| RETAIN     | cohort matrix            | retention heatmap     | cohort line curves               |
| VALUE      | single value             | KPI stat card         | big-number + sparkline           |

## 3. Theming on Nimbus tokens (resolved & built)

**Decision — "built on Nimbus":** the library depends on `@commercetools/nimbus`

- tokens, and theming resolves from the Nimbus **system-palette** tokens (the
  radix-style 12-step scales the design system already ships) into a small set
  of **semantic roles** (`ChartRoles`) that charts consume — charts never name a
  hue or a token step, they ask for a role. Built and validated:

* **accent** (primary emphasis),
* **positive / negative** (valence — carried WITH a non-color cue, never color
  alone; honored throughout, e.g. control-chart out-of-control points are
  shape+color),
* **categorical 1..n** — a **CVD-safe fixed sequence** (validated in Spike 2
  against the token scales; assigned in fixed order, never cycled), keyed by a
  stable **entity id** so a series keeps its color across charts and a filter
  that changes the series count never repaints survivors,
* **sequential** — a single-hue ramp for magnitude (heatmaps, calendar, RFM,
  cohort triangle),
* **neutral ink / muted ink / grid / axis / surface**, with light/dark resolved
  from the token mode (elevation inverts in dark).

What began as "radix-compatible, a constraint to validate" is now the shipped
theming layer. Remaining RFC nuance: an **on-accent / on-fill text-color role**
(labels drawn on dark fills — treemap, RFM) is the one role still chosen ad hoc.

## 4. RFC skeleton

1. **Problem & goals** — the agentic-selection framing; why generality; success
   criteria.
2. **Users & jobs** — the persona/question research (see personas map doc) —
   framed as _how we prioritized which chart types to build first_. Personas are
   scaffolding for the question set + build order, not an ongoing selection
   axis.
3. **Selection taxonomy** — the intent × data-shape model and matrix above, plus
   the two selection surfaces (canonical `resolve` vs. name-addressable
   `resolveByName`) and the abstract-shape / concrete-`DataKind` distinction.
4. **Visualization catalog** — the prioritized type list derived from coverage
   (tiers below).
5. **Architecture decision** — catalog vs. grammar vs. hybrid; chosen
   foundation; the selection-metadata contract; how backend↔frontend agree on
   types.
6. **Theming on Nimbus tokens** — semantic `ChartRoles` mapped from
   system-palette tokens, light/dark, CVD-safe categorical + entity-id keying,
   sequential ramps, accessibility of color (valence never color-alone).
7. **Cross-cutting** — accessibility (keyboard, role="img", alt from data),
   SSR/RSC, responsiveness, i18n (currency/number/date across markets), bundle
   budgets & lazy loading.
8. **Agent integration** — machine-readable catalog surface
   (catalog.json/llms.txt equivalent), input validation, graceful degradation to
   a data table.
9. **Prioritization & phasing** — Tier 1/2/3 (below), telemetry-driven
   re-ranking.
10. **Open questions & risks** — most of the original forks are now settled by
    the prototype (hybrid chosen, visx foundation, presets-are-config, metadata
    schema, theming). The two contracts still genuinely open: **(a)** a data
    **discriminator** (explicit `kind`/`$schema`) vs. today's structural
    duck-typing in `deriveFacts` (order-sensitive, brittle); **(b)** a **typed
    per-chart options contract** (radar axes, parallel dimensions, control
    limits currently ride an untyped options bag). Plus the deferrals:
    **GeoMap** (needs licensed boundary data) and the Layer-4 production modules
    (LazyChart / ChartFromSpec / EmptyState / LoadingSkeleton).

### First-pass prioritization (from coverage analysis)

- **Tier 1 (ship first — appear for nearly every persona):** KPI stat card
  (+delta/sparkline), time-series line/area, horizontal ranked bar,
  part-to-whole (stacked bar/donut/treemap), data table (universal fallback).
- **Tier 2 (broad, not universal):** grouped/comparison bar & small multiples,
  bullet/gauge/progress (TARGET/RANGE), funnel, heatmap (hour×day and cohort),
  histogram/box plot.
- **Tier 3 (specialized, decisive for specific jobs):** scatter/bubble,
  waterfall, choropleth/map, Sankey/chord/flow map, control chart / line+band,
  Pareto, stacked area/streamgraph, RFM grid, bump chart, parallel coordinates,
  radar.

**Guidance:** roughly five primitives (stat card, line, bar, part-to-whole,
table) satisfy the majority of natural-language questions. Build Tier 1
robustly; make Tier 2 solid; treat Tier 3 as progressively-enhanced specialists
triggered when the backend returns the matching data shape. Instrument
question→intent→viz telemetry from day one to replace this first-pass ranking
with measured demand.
