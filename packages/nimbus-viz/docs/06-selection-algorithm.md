# Preset Selection Algorithm — How the Agent Picks a Chart

_RFC section. Status: **prototype-implemented and validated** (see
`packages/nimbus-viz/src/selection/*` and the batch log in doc 09). The pipeline
shape and perceptual rankings are grounded (see Sources); the specific weights
are ours to tune. This doc now reflects the shipped resolver, not just a
proposal._

> **Prototype note.** The algorithm below is implemented as `resolve()` /
> `resolveByName()` over a `chartRegistry` of 91 entries (19 canonical + 72
> presets). It never throws — every path fails safe to the `DataTable`. The
> concrete scoring formula, the canonical/preset split, and the concrete-kind
> render guard (all below) were discovered while building it.

## Problem

"Multiple chart types would work" is the normal case, not the edge case. The
selector must take a question and a dataset and return **one** chart,
**consistently**, while keeping good alternatives reachable.

## Division of labor

- **LLM / agent** does language: natural-language question → a **structured
  intent** (from the 15-intent taxonomy, doc 02) + **modifiers** (e.g. "over
  time", "breakdown", "spread", "vs goal") + which metric/dimension.
- **Deterministic resolver (library-side)** does selection: (intent + concrete
  data facts + context) → preset, via a documented, testable function.

The agent proposes the intent; the library disposes the chart. This keeps
selection predictable, unit-testable, and independent of model variance.

## Two selection surfaces (prototype-validated)

Building the resolver surfaced that "pick a chart" is really **two** questions
needing **two entry points** — conflating them makes selection worse as the
catalog grows:

1. **`resolve(intent, data)` — bare-intent selection.** Ranks only the
   **canonical** entries (≈ one per intent × concrete-kind region) and returns
   the single best chart via the filter → rank → tie-break pipeline below. Use
   it when the agent has only an intent + data.
2. **`resolveByName(name, data)` — the agent picks a named preset.** Addresses
   the full catalog directly by name, renders it if the data fits (guarding on
   concrete kind), else fails safe to the table. This is the primary agent path
   (doc 04: "the agent selects presets, not raw components").

Every registry entry is therefore tagged **`canonical: true|false`**. Canonical
entries are the bare-intent answers; presets are the name-addressable
question-specific configurations that would otherwise flood the ranker with
dozens of equal-scoring line charts. **This split is the load-bearing structural
decision** — without it, `resolve(TREND, series)` ties ~20 identical-scoring
presets and picks by registration order, which is semantically arbitrary.

**Why two surfaces, not a finer ranking key:** intent × shape is provably too
coarse to choose _among_ presets — `refund-rate-trend` and
`api-error-rate-trend` are both line + series + TREND. What distinguishes them
is the **question** (`questionString`), not the chart mechanics — so the
question is the preset's selection key, supplied by the agent choosing the named
preset. (Personas were only the generative source of those questions and the
build-order prioritization; on a preset the persona is optional **provenance**,
not a selection axis.)

## Inputs

- **Intent + modifiers** (from the agent).
- **Data facts** (derived from the backend response): data shape, cardinality
  (e.g. number of categories), series count, presence of a target/threshold
  field, time granularity, sample size, hierarchy present or not.
- **Context**: available display size, device, accessibility mode, locale, and
  what is already on screen.

## Pipeline: filter → rank → tie-break

### 1. Filter (hard constraints → feasibility)

Each entry declares hard constraints in its selection metadata: accepted data
shapes, served intents, and limits such as `maxCategories`, `requiresTarget`,
`minSeries`, `requiresTimeAxis`, `minSampleSize`. Keep only entries whose
constraints the data satisfies. For `resolve` (bare intent) the filter also
drops non-canonical presets (they are name-addressable only). Output: the
candidate set. Everything downstream ranks _within_ it.

**Abstract shape vs. concrete kind (prototype finding).** `acceptedShapes` (the
doc-02 taxonomy) is a coarse, human-facing filter — it does NOT uniquely
determine what an adapter can render: part-to-whole is served by both a flat
`CategoryDatum[]` (donut) and a `StackRow[]` (stacked bar). So each entry also
declares a concrete **`dataKinds[]`** — the actual runtime structures its render
adapter consumes — and the filter gates on that too. `deriveFacts` classifies
the data into exactly one `DataKind` by structural detection; an entry is
feasible only if its `dataKinds` includes it. **Both gates are needed:** shapes
for intent-level reasoning, kinds for render safety. (13 kinds are implemented;
the detection is order-sensitive — see the open contract below.)

### 2. Rank (soft constraints → weighted score)

Each surviving candidate gets a weighted score from:

- **Intent primacy** — preset tagged primary vs. secondary for the intent (from
  the intent × shape matrix, doc 02). E.g. for RANK, horizontal bar primary;
  lollipop/dot secondary.
- **Perceptual effectiveness** — prefer encodings humans decode more accurately:
  position > length > angle/area > color intensity. (Cleveland & McGill;
  Mackinlay APT.) This is why, for many-slice part-to-whole, a segmented bar
  outscores a pie.
- **Data-characteristic fit** — soft bonuses/penalties on cardinality, series
  count, sample size (donut fine ≤~5 slices, penalized at 20; histogram needs
  enough points).
- **Question modifiers** — "over time" → temporal forms; "breakdown/mix" →
  part-to-whole; "spread" → distribution; "vs goal" → target forms.
- **Context** — does the display size fit axes? down-rank color-only encodings
  in accessibility mode; locale.
- **Consistency** — if the metric is already shown as a line elsewhere, keep it
  a line; avoid gratuitous variety.
- **Cost** — minor nudge on bundle/lazy-load weight.

`argmax` wins; the rest are retained as ranked **alternates**. The prototype's
concrete score (tunable) is
`1.0·primacy + 0.5·perceptualRank + 0.25·dataFit − 0.05·(bundleWeight/100)`,
with `primacy` = 1.0 primary / 0.6 secondary — enough to make the pipeline
deterministic and testable while leaving the weights open for telemetry tuning.

### 3. Tie-break & fallback

- Ties resolve by a **stable, documented priority order** — the prototype uses
  **registration order** in the registry, so the same question always yields the
  same chart. Predictability is what makes an auto-selected chart trustworthy.
- If two candidates are within an epsilon, surface the runner-up as a one-tap
  **toggle** ("view as bar / as line") rather than hiding it. (The resolver
  already returns the full ranked `candidates[]` for exactly this.)
- If the filter empties **or a chosen chart throws at render time**, fall back
  to the guaranteed **DataTable**. Implemented: `resolve`/`resolveByName` never
  throw, and `ResolvedChart` wraps the render in an error boundary so even a
  runtime failure degrades to the table with a human-readable reason.
  **ChartFromSpec** (the long-tail escape hatch) is the one still-deferred
  piece.

## Worked example

Question: "what's our revenue split by channel?" → intent **PART-WHOLE**, shape
part-to-whole, **12 categories**.

1. Filter admits: pie, donut, segmented bar, treemap.
2. Rank: pie and donut penalized on cardinality (>~6) and angle-vs-length
   perception; segmented bar and treemap survive; **segmented bar wins** for a
   flat set (treemap would win if hierarchical).
3. User still gets treemap offered as an alternate.

## Grounding

The **filter-then-rank** shape and the **perceptual rankings** are established,
not invented:

- Cleveland, W. S. & McGill, R. (1984). _Graphical Perception: Theory,
  Experimentation, and Application to the Development of Graphical Methods._
  JASA. — effectiveness ordering of visual encodings.
- Mackinlay, J. (1986). _Automating the Design of Graphical Presentations of
  Relational Information._ ACM TOG (APT). — expressiveness + effectiveness
  criteria for automated chart design.
- Moritz, D. et al. (2019). _Formalizing Visualization Design Knowledge as
  Constraints (Draco)._ IEEE TVCG. — viz knowledge as hard + soft (weighted)
  constraints; the exact pattern used here.
- Wongsuphasawat, K. et al. (2016). _Voyager / CompassQL_ and Satyanarayan, A.
  et al. (2017) _Vega-Lite._ — enumerate-then-rank chart recommendation in
  practice.

## Caveats

- The resolver's **design here is a proposal** for the RFC; only the pipeline
  pattern and perceptual rankings are sourced.
- It is **only as good as its weights.** Therefore: make every decision
  **explainable** ("chose bar over pie: 12 categories exceed pie's legibility
  threshold"), and **log** every question → intent → candidates → chosen tuple
  so the telemetry loop (doc 03) tunes weights against real usage instead of our
  guesses.

## Selection-metadata fields this depends on (per entry) — as shipped

`name` · `baseComponent` · `intents[] (primary|secondary)` · `acceptedShapes[]`
(abstract, coarse filter) · **`dataKinds[]`** (concrete render guard) ·
`constraints{maxCategories, requiresTarget, minSeries, requiresTimeAxis, minSampleSize, hierarchy}`
· `perceptualRank` · `questionString` · `bundleWeight` · **`canonical`**
(bare-intent answer vs name-only preset) · **`configLabel`** (structural
configuration signature — base + variant + overlay set; the dedup key, see
doc 04) · `overlays[]` (composed overlay names) · `persona?` (provenance only).

## Open contracts (prototype findings, for the RFC)

- **Data discriminator vs. duck-typing.** `deriveFacts` classifies data by
  sniffing the first element's shape, and the order is **load-bearing**:
  RadarSeries `{id,label,values}` shadows HeatRow `{label,values}`; BubblePoint
  `{x,y,size}` shadows ScatterPoint `{x,y}`; DumbbellRow/CalendarDatum must
  precede the generic CategoryDatum. It works, but it's brittle — the RFC should
  weigh an explicit `kind`/`$schema` discriminator on the data (or a typed
  request) over structural inference.
- **Typed per-chart options contract.** Some charts need inputs the data can't
  carry — radar needs axis _names_, parallel-coordinates needs _dimension_ defs,
  control charts take limit overrides. Today these ride in an untyped
  `options: Record<string, unknown>` read defensively. The RFC should define a
  typed options contract per base.
- **Adding a chart = five coupled contracts** (a DataKind + its detection;
  `shapesForKind` + a `deriveFacts` case; an `ENTITY_ID_ACCESSOR` entry; a
  render adapter + the per-base maps; a registry entry). TypeScript `Record<>`
  exhaustiveness enforces four of the five at compile time — a good guardrail to
  keep.

## Open questions

1. Where do initial weights come from before telemetry exists? (Proposed: seed
   from the perceptual literature, then learn.)
2. **Resolved by the two-surface split:** `resolve` takes a single intent; the
   _question_ dimension (which of several presets) is handled by the by-name
   path, not by passing a ranked intent list.
3. How much context (on-screen consistency, history) is worth wiring in for v1?
