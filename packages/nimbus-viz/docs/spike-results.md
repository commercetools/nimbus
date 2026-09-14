# Rendering-Foundation Spike Results — Phase 0

_Evidence, not opinions. Five spikes (doc 07) run against the two finalists,
visx and Vega-Lite, in a real Next.js App Router harness. Recharts excluded per
instruction. Where the evidence contradicts doc 07's scorecard, the evidence
wins — flagged inline with **⚠ vs doc 07**._

**Date run:** 2026-08-28 · **Harness:** throwaway Next.js app (discarded; only
this file is kept).

> **Update (post-review): single foundation required.** Doc 08's decision #3 is
> resolved as "one library only" — a two-library split is operationally off the
> table. That makes generality the deciding axis, so a **sixth test (Sankey)**
> was added to settle whether either finalist can carry the full specialist
> catalog alone. It does, decisively. The recommendation below is the
> **single-library verdict**; the earlier two-library reasoning is retained only
> where it explains the trade-offs. **Bottom line: visx.**

## Setup & versions (re-verified at build time)

| Thing             | Version                                  | Note                                                                              |
| ----------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| Node              | 24.12.0                                  |                                                                                   |
| pnpm              | 11.24.0                                  |                                                                                   |
| Next.js           | **16.3.3** (App Router, Turbopack build) | doc 07 predates it (assumed 15); **⚠ drift** — RSC/bundle behaviour is Next 16's. |
| React / react-dom | 19.2.8                                   |                                                                                   |
| visx (`@visx/*`)  | **4.0.0**                                | unchanged since doc 07 (Jun 2026).                                                |
| vega-lite         | **6.4.3**                                | unchanged since doc 07.                                                           |
| vega              | 6.4.0                                    | headless SVG runtime.                                                             |
| react-vega        | **8.0.0**                                | **⚠ API rewrite** — see Spike 1 note.                                             |
| vega-embed        | 7.1.0                                    | now a _peer_ of react-vega 8; must be installed explicitly.                       |
| @radix-ui/colors  | 3.0.0                                    |                                                                                   |

**Method.** One Next App-Router route per (spike × finalist). Bundle sizes are
gzip level-9 of the exact chunk set each prerendered route references (measured
from `.next` output — bundler-agnostic, not an estimate). The palette was
validated with the `dataviz` skill's `validate_palette.js` (Machado-Oliveira CVD
model), not eyeballed. Charts were visually confirmed in a headless browser.

---

## Results matrix

| Spike                                      | visx | Vega-Lite | One-line verdict                                                                                                                                                      |
| ------------------------------------------ | :--: | :-------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 · Specialist render** (cohort heatmap) |  ✅  |    ✅     | Both render the ragged cohort matrix correctly; VL is _more_ concise and gets a legend free. **⚠ vs doc 07.**                                                         |
| **2 · radix theming** (light/dark)         |  ✅  |    ✅     | Both switch cleanly, roles map to radix with no hard-coded hex. CB-safe sequence achievable (radix dark-amber caveat hits both).                                      |
| **3 · SSR / RSC**                          |  ✅  |    ✅     | visx: 0 JS static + clean hydrate. VL: **0 JS static via headless SVG** (no `window` error) or heavy if interactive. **⚠ vs doc 07.**                                 |
| **4 · Lazy + bundle**                      |  ✅  |    ⚠️     | visx chart **+35 kB gz**; VL interactive **+293 kB gz** (8×). Both defer via `dynamic()`; no cross-contamination. **⚠ vs doc 07 (target).**                           |
| **5 · Agent ergonomics**                   |  ✅  |    ✅     | Same finalist-agnostic resolver; `{type,data,options}`→chart typed cleanly; invalid input fails safe to DataTable. VL spec is a marginally more natural agent target. |

✅ pass · ⚠️ pass but with a material caveat

**Added test — 1b · Sankey (the single-library decider): visx ✅ · Vega-Lite
❌.** visx renders proper proportional ribbons via `@visx/sankey`; Vega-Lite has
no ribbon/sankey mark and cannot render one at all. Detail in "Spike 1b" below.

---

## Spike 1 — Specialist render (cohort retention heatmap)

Built a 12-cohort × 12-period **ragged** (triangular) retention matrix in each
finalist from the same dataset.

|                 | visx                                                                                                                                                                            | Vega-Lite                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Approach        | `scaleBand` × `scaleBand` + `<rect>` + `@visx/text` + `AxisTop/AxisLeft`, single-hue radix ramp via `scaleLinear`                                                               | one declarative spec: `rect` mark, ordinal x/y, quantitative color; text layer for cell labels |
| LOC (formatted) | ≈116                                                                                                                                                                            | ≈85                                                                                            |
| Ragged nulls    | trivial — skip `null` cells in the map                                                                                                                                          | trivial — drop nulls in tidy data                                                              |
| Legend          | **built by hand** (not shown here)                                                                                                                                              | **free** (gradient legend from the color encoding)                                             |
| Friction        | none; clean primitive composition. Minor: `@visx/text` wraps every label in an inner `<svg>` (104 `<svg>` nodes in output) — cosmetic DOM bloat, avoidable with plain `<text>`. | none for the heatmap itself. TS typing of the spec is loose (`as TopLevelSpec`).               |

**Verdict: both PASS**, no library-fighting hacks in either. Correct render
verified visually (78 cells = the exact triangular count).

**⚠ vs doc 07.** Doc 07 scored VL expressiveness `M/H*` with the footnote
"funnel/Sankey/**cohort** are awkward or non-native." For a cohort _retention
heatmap_ that is **wrong** — it is a rect-matrix, i.e. VL's home turf: 85 lines,
free legend, no friction. The footnote's concern is legitimate for **funnel and
Sankey** (genuinely non-grammatical in VL), **not** for the heatmap. Since the
spike's proposed primary was the heatmap, VL looks stronger on Spike 1 than the
scorecard implied.

**Residual risk → now tested (Spike 1b).** The heatmap doesn't stress the place
doc 07's VL-awkwardness actually bites — funnel/Sankey. That test was added at
review time and is decisive; see Spike 1b.

---

## Spike 1b — Sankey (single-library stress test, added on request)

The same commerce checkout-flow graph (8 nodes, 9 weighted links) built in both.
This is the test that matters once only **one** library may be chosen: can it
carry the FLOW specialists a generalist catalog needs?

|                 | visx                                                            | Vega-Lite                                                                     |
| --------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Result          | ✅ correct Sankey — proportional ribbons, colored nodes, labels | ❌ **not a Sankey** — nodes as bars, links as flat straight rules; no ribbons |
| Layout          | `sankey()` from `@visx/sankey` (wraps d3-sankey)                | **had to precompute with the same d3-sankey** — VL has no layout for it       |
| Ribbon marks    | `sankeyLinkHorizontal()` → SVG path, width = flow value         | **none** — VL grammar has no ribbon/variable-width area mark                  |
| LOC (formatted) | 93                                                              | 115 (and still no ribbons)                                                    |
| Verdict         | clean, idiomatic, server-safe                                   | fundamentally not expressible in VL                                           |

**This is the decisive finding.** Vega-Lite's grammar has no sankey/ribbon
primitive. The best VL can do is let d3-sankey (the exact dep visx wraps)
compute the geometry, then draw node rects via identity scales and links as
straight `rule` segments — the flow-magnitude ribbons, which are the entire
purpose of a Sankey, simply cannot be drawn. It took **more** code than visx to
produce something that is **not a usable Sankey**. Funnel, cohort-triangle,
waterfall and chord fall in the same non-grammatical bucket.

**Consequence for the single-library choice:** a generalist catalog (doc 04)
must include these Layer-3 FLOW/RETAIN specialists. Vega-Lite cannot render
them, so it **cannot be the single foundation.** visx can and did.

---

## Spike 2 — radix-colors theming

A full semantic palette (accent · positive · negative · categorical 1..n ·
neutral ink) wired to radix scales, driven by a single `Theme` object, with a
light/dark toggle. Multi-series line chart exercising every role.

**Both PASS:** clean theme switch (verified light↔dark in-browser), every color
sourced from a radix scale (zero hard-coded hex in chart code), valence carried
by sign + arrow, never color alone.

- **visx:** colors are plain props → full control of legend swatches and the
  accent-emphasis series.
- **Vega-Lite:** theme injected via `config` + scale `range`; legend free. ⚠
  **Wrinkle:** emphasizing one series with a separate accent _layer_ desyncs
  VL's color legend (the legend reflects the color encoding, not the override).
  A hand-built legend (visx) or an encoding workaround is needed.

**Colour-blind-safe categorical sequence — computed, not eyeballed** (radix
step, hex; validated with `validate_palette.js`):

- **Light — fully passes all hard gates.** Sequence
  `blue9, orange9, teal9, amber11, pink9, grass9, violet9, tomato9`. Worst
  adjacent CVD ΔE **10.9** (target ≥8), worst normal-vision ΔE **19.6** (floor
  ≥15). Contrast is a WARN → relief via labels/legend (which the method mandates
  anyway). Note the _snap-to-step_: `amber9` (L 0.85) fails the lightness band;
  `amber11` (dark gold) lands in-band — radix's 12 steps make this snap easy.
- **Dark — CB-safety achievable, one documented radix limitation.** CVD and
  normal-vision floors pass for all 8, but **radix's amber & orange scales have
  no step that satisfies the perceptual dark band (L 0.48–0.67) _and_ the chroma
  floor at once** — their saturated steps are too light (L 0.69–0.85), the only
  in-band step (step-8) drops below the chroma floor (reads as a brown). You
  accept the bright band-exceeding solids (still CVD-safe, ≥3:1 contrast). This
  is the "different philosophies" friction doc 02 §3 predicted, now measured —
  and it is a **radix property, identical for both finalists**, not a library
  differentiator.

---

## Spike 3 — SSR / RSC (Next App Router)

| Case             | Route                               | Chart client JS | Result                                                                              |
| ---------------- | ----------------------------------- | --------------- | ----------------------------------------------------------------------------------- |
| visx static      | RSC, no `"use client"`              | **0 kB**        | Pure React/SVG server component. 24 kB inline SVG. ✅                               |
| visx interactive | client island                       | +35 kB gz       | Hydrates cleanly, hover tooltips work. ✅                                           |
| **VL static**    | async RSC → headless `view.toSVG()` | **0 kB**        | **Ran the Vega runtime in Node — no `window is not defined`.** 70 kB inline SVG. ✅ |
| VL interactive   | react-vega client island            | +293 kB gz      | Embeds a live Vega view, hydrates. ✅ (but heavy — see Spike 4)                     |

Verified: the static VL route references **zero** Vega runtime chunks — the
runtime stays on the server.

**⚠ vs doc 07.** Doc 07 rated VL SSR/RSC only `M` and framed react-vega as
"embeds a client Vega view (RSC friction)." That understates it: **VL has a
clean 0-client-JS static RSC path** by compiling the spec and rendering SVG
headless in Node. The friction is real _only when you need interactivity_. visx
`H†` is confirmed (strongest of the two). Trade for VL-static: the SVG is ~3×
heavier in HTML (70 vs 24 kB) and loses tooltips/interaction unless you ship the
runtime.

---

## Spike 4 — Lazy-load + bundle

All numbers gzip level-9, measured from emitted chunks.

- **Shared framework baseline (Next 16 + React 19):** **173.1 kB gz**, identical
  across every route → shared core is correctly factored out (not our library's
  cost; a Next consumer pays it regardless).

| Incremental over baseline           | route-specific gz                             |
| ----------------------------------- | --------------------------------------------- |
| **visx cohort chart** (interactive) | **+35.1 kB**                                  |
| **Vega runtime** (interactive)      | **+293.2 kB** (raw single chunk **801.8 kB**) |
| visx static                         | **0.0 kB**                                    |
| VL static (headless SVG)            | **0.0 kB** JS (+46 kB HTML)                   |
| visx lazy — first load              | +3.9 kB (chart chunk loads on demand)         |
| VL lazy — first load                | +4.4 kB (293 kB chunk loads on demand)        |

- **Unused types don't ship:** verified — visx routes never reference the Vega
  runtime chunk and vice versa; the lazy routes ship neither chart until the
  button is clicked.
- **The decisive asymmetry:** an interactive VL chart is **~8× the weight** of
  an interactive visx chart (293 vs 35 kB gz).

**⚠ vs doc 07 (the ≤15 kB target).** Doc 07 proposed "≤ ~15 kB gz for a visx
preset." The _first_ visx chart measured **35 kB**, because that first load also
pulls the shared visx/d3 primitives (scale/shape/axis/group/text). The 15 kB
target is only meaningful as a **marginal** per-preset cost once those
primitives are a common chunk — which needs ≥2 presets to confirm and was not
proven here (single-preset harness). See proposed budgets below, which split
one-time core from marginal preset.

### Bundle budgets — DEFERRED to Phase 1

> **Decision (post-review): deferred.** With visx chosen, the only bundle number
> that mattered was the 8× visx-vs-Vega gap — already settled. Per-chart kB
> targets are premature in 2026; we **keep the lazy-loading architecture**
> (which visx gives for free and is what keeps time-to-first-chart snappy in an
> agentic render) but **do not set or CI-enforce numeric ceilings now.** Revisit
> only if a chart balloons in practice. The table below is retained as reference
> evidence, not an active gate.

Framed as the **library's** contribution (excludes the host's React/Next
runtime), gzipped:

| Budget                                                                         | Target gz        | Rationale                                                                                               |
| ------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------- |
| Shared chart core (visx/d3 primitives + theme + responsive), loaded once       | **≤ 30 kB**      | ≈ what the first chart's 35 kB is mostly made of; amortized across the whole catalog.                   |
| Tier-1 preset marginal (line, bar, stat, part-to-whole, table)                 | **≤ 8 kB** each  | thin config + marks over the shared core.                                                               |
| Tier-2 preset marginal (grouped bar, bullet/gauge, funnel, heatmap, histogram) | **≤ 15 kB** each | doc 07's number — realistic as _marginal_, not first-load.                                              |
| Tier-3 specialist marginal (Sankey, cohort, control chart, geo, …)             | **≤ 30 kB** each | geo/Sankey pull extra d3 modules.                                                                       |
| `ChartFromSpec` (visx-based escape hatch), lazy + opt-in                       | **≤ 40 kB**      | a small spec→visx renderer over the shared core; no Vega runtime (single-library — see recommendation). |

_The marginal (≤8/≤15/≤30) figures assume the shared-core amortization proven in
Phase 1 with ≥2 presets; treat them as provisional until then. If you prefer one
number over the core+marginal split, the simplest equivalent is: **first chart
on a page ≤ ~40 kB, each additional chart ≤ ~15 kB.**_

---

## Spike 5 — Agent-selection ergonomics

Implemented doc 06's selection metadata + a deterministic resolver:
`{type, data, options}` → look up preset → **typed validate** → render, or
**fail safe to DataTable** with a human-readable reason. One registry, renderers
injected per finalist (same contract for both).

Verified in-browser, three payloads each:

1. valid cohort matrix → renders the heatmap;
2. unknown `type: "sankey-diagram"` → DataTable, reason "unknown type";
3. malformed data → DataTable, reason "need ≥ 3 cohorts, got 1" (the validator
   caught it).

**Both PASS.** The typed mapping is clean in both. VL's spec is a marginally
more natural raw-spec target (the payload's `data` drops straight into
`spec.data.values`) — a point in favour of a VL escape hatch _if a split were
allowed_. With the single-library constraint this edge is moot; the escape hatch
will be a small visx-based spec renderer instead (see recommendation).

---

## Recommendation

**Single foundation: visx.** With a two-library split ruled out, the choice is
decided by which library can be the _whole_ generalist catalog on its own — and
only visx can.

**Why visx wins outright under the single-library constraint:**

- **Generality (the decider).** A generalist catalog (doc 04) must include the
  FLOW/RETAIN specialists — Sankey, funnel, cohort, waterfall. Spike 1b showed
  **Vega-Lite cannot render a Sankey at all** (no ribbon mark); visx renders it
  cleanly via `@visx/sankey`. This alone disqualifies VL as the single
  foundation — it fails doc 01's locked "express any visualization" requirement.
- **Bundle.** 35 kB gz per interactive chart vs VL's 293 kB runtime. VL on every
  Tier-1 chart is a non-starter; lazy-loading only defers, not removes, the
  cost.
- **SSR/RSC.** 0-JS static + clean hydration (VL matches only in its static-SVG
  mode, which it can't use for the specialists it also can't draw).
- **radix theming.** Full control of every semantic role and the legend.

**What choosing visx costs us (accept with eyes open):**

- **More code per chart** (~1.4× a VL spec for simple charts) and we build/own
  axes, legends, tooltips — visx gives primitives, not charts. Budget the team
  time for a shared chart-chrome layer in Phase 1.
- **The escape hatch is now ours to design.** Doc 01 locks "build anything" and
  doc 04 has `ChartFromSpec`. Without Vega-Lite as the ready-made declarative
  target, `ChartFromSpec` becomes a **small visx-based spec renderer** (a thin
  grammar over our own primitives). Spike 5 showed the `{type,data,options}`
  contract maps cleanly onto visx renderers, so this is a design task, not a
  risk — but it is net-new work VL would have given us for free.
- **No free statistical breadth.** Histograms, box plots, etc. are ours to build
  (visx has the primitives; VL had them out of the box).

**Runner-up, for the record.** If the constraint were ever relaxed, Vega-Lite
would return _only_ as the `ChartFromSpec` escape hatch (its declarative JSON is
the natural agent target, Spike 5), lazy and server-SVG-first — never on the
Tier-1 path. It is not a viable sole foundation.

### Where the evidence overrode doc 07 (summary)

| Spike | doc 07 said                               | Evidence found                                                                                                                                               |
| ----- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | VL cohort "awkward or non-native"         | Cohort _heatmap_ is concise & natural in VL (free legend). Friction is real for funnel/Sankey — **confirmed in Spike 1b: VL cannot render a Sankey at all.** |
| 3     | VL SSR/RSC `M`; react-vega = RSC friction | VL has a **clean 0-JS static RSC path** via headless SVG; friction only on the interactive path.                                                             |
| 4     | visx preset "≤ ~15 kB gz"                 | First visx chart is **35 kB** (bundles shared core); 15 kB holds only as a _marginal_ target — budget re-proposed as core + marginal.                        |

### Decisions closed (doc 08)

- **#1 Foundation = visx.** Single library. Layer-0 is largely wrapped (visx
  primitives), so the component count firms toward doc 04's "≈44 excl. Layer 0."
- **#3 Single library, no split.** Vega-Lite ruled out as sole foundation (Spike
  1b: cannot render Sankey/funnel/cohort-triangle).
- **#2 Bundle budgets — DEFERRED to Phase 1.** Keep lazy-loading; set no numeric
  ceilings now (see the deferral note above).

### Carried into Phase 1

- **Design the visx-based `ChartFromSpec`** (the escape hatch VL would have
  provided) — a spec task, low risk given Spike 5.
- Build a shared chart-chrome layer (axes/legends/tooltips) — the main cost of
  choosing primitives over a batteries-included library.
- Revisit bundle sizes only if a chart balloons in practice.
