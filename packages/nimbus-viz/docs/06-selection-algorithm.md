# Preset Selection Algorithm — How the Agent Picks a Chart

_RFC section. Status: design proposal for ratification. The pipeline shape and perceptual rankings are grounded (see Sources); the specific weights and metadata are ours to define and tune._

## Problem
"Multiple chart types would work" is the normal case, not the edge case. The selector must take a question and a dataset and return **one** chart, **consistently**, while keeping good alternatives reachable.

## Division of labor
- **LLM / agent** does language: natural-language question → a **structured intent** (from the 15-intent taxonomy, doc 02) + **modifiers** (e.g. "over time", "breakdown", "spread", "vs goal") + which metric/dimension.
- **Deterministic resolver (library-side)** does selection: (intent + concrete data facts + context) → preset, via a documented, testable function.

The agent proposes the intent; the library disposes the chart. This keeps selection predictable, unit-testable, and independent of model variance.

## Inputs
- **Intent + modifiers** (from the agent).
- **Data facts** (derived from the backend response): data shape, cardinality (e.g. number of categories), series count, presence of a target/threshold field, time granularity, sample size, hierarchy present or not.
- **Context**: available display size, device, accessibility mode, locale, and what is already on screen.

## Pipeline: filter → rank → tie-break

### 1. Filter (hard constraints → feasibility)
Each preset declares hard constraints in its selection metadata: accepted data shapes, served intents, and limits such as `maxCategories`, `requiresTarget`, `minSeries`, `requiresTimeAxis`, `minSampleSize`. Keep only presets whose constraints the data satisfies. Output: the candidate set. Everything downstream ranks *within* it.

### 2. Rank (soft constraints → weighted score)
Each surviving candidate gets a weighted score from:
- **Intent primacy** — preset tagged primary vs. secondary for the intent (from the intent × shape matrix, doc 02). E.g. for RANK, horizontal bar primary; lollipop/dot secondary.
- **Perceptual effectiveness** — prefer encodings humans decode more accurately: position > length > angle/area > color intensity. (Cleveland & McGill; Mackinlay APT.) This is why, for many-slice part-to-whole, a segmented bar outscores a pie.
- **Data-characteristic fit** — soft bonuses/penalties on cardinality, series count, sample size (donut fine ≤~5 slices, penalized at 20; histogram needs enough points).
- **Question modifiers** — "over time" → temporal forms; "breakdown/mix" → part-to-whole; "spread" → distribution; "vs goal" → target forms.
- **Context** — does the display size fit axes? down-rank color-only encodings in accessibility mode; locale.
- **Consistency** — if the metric is already shown as a line elsewhere, keep it a line; avoid gratuitous variety.
- **Cost** — minor nudge on bundle/lazy-load weight.

`argmax` wins; the rest are retained as ranked **alternates**.

### 3. Tie-break & fallback
- Ties resolve by a **stable, documented priority order** so the same question always yields the same chart — predictability is what makes an auto-selected chart trustworthy.
- If two candidates are within an epsilon, surface the runner-up as a one-tap **toggle** ("view as bar / as line") rather than hiding it.
- If the filter empties, fall back to the guaranteed **DataTable**, or **ChartFromSpec** for long-tail cases.

## Worked example
Question: "what's our revenue split by channel?" → intent **PART-WHOLE**, shape part-to-whole, **12 categories**.
1. Filter admits: pie, donut, segmented bar, treemap.
2. Rank: pie and donut penalized on cardinality (>~6) and angle-vs-length perception; segmented bar and treemap survive; **segmented bar wins** for a flat set (treemap would win if hierarchical).
3. User still gets treemap offered as an alternate.

## Grounding
The **filter-then-rank** shape and the **perceptual rankings** are established, not invented:
- Cleveland, W. S. & McGill, R. (1984). *Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods.* JASA. — effectiveness ordering of visual encodings.
- Mackinlay, J. (1986). *Automating the Design of Graphical Presentations of Relational Information.* ACM TOG (APT). — expressiveness + effectiveness criteria for automated chart design.
- Moritz, D. et al. (2019). *Formalizing Visualization Design Knowledge as Constraints (Draco).* IEEE TVCG. — viz knowledge as hard + soft (weighted) constraints; the exact pattern used here.
- Wongsuphasawat, K. et al. (2016). *Voyager / CompassQL* and Satyanarayan, A. et al. (2017) *Vega-Lite.* — enumerate-then-rank chart recommendation in practice.

## Caveats
- The resolver's **design here is a proposal** for the RFC; only the pipeline pattern and perceptual rankings are sourced.
- It is **only as good as its weights.** Therefore: make every decision **explainable** ("chose bar over pie: 12 categories exceed pie's legibility threshold"), and **log** every question → intent → candidates → chosen tuple so the telemetry loop (doc 03) tunes weights against real usage instead of our guesses.

## Selection-metadata fields this depends on (per preset)
`name` · `baseComponent` · `overlays[]` · `intents[] (primary|secondary)` · `acceptedShapes[]` · `constraints{maxCategories, requiresTarget, minSeries, requiresTimeAxis, minSampleSize, hierarchy}` · `perceptualRank` · `questionString` · `bundleWeight`.

## Open questions
1. Where do initial weights come from before telemetry exists? (Proposed: seed from the perceptual literature, then learn.)
2. Is intent single-valued, or can the agent pass a ranked list of intents?
3. How much context (on-screen consistency, history) is worth wiring in for v1?
