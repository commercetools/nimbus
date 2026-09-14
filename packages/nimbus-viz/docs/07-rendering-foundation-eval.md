# Rendering Foundation — Desk Evaluation & Spike Plan

_RFC section. Status: desk evaluation → narrows candidates and defines the
spikes that finalize the decision. This does **not** settle the choice; see
"What this can and can't decide."_

> **RESOLVED by the Phase-0 spikes (2026-08-28).** Foundation = **visx**,
> **single library** (no split); bundle budgets deferred. The spikes overrode
> this desk eval on three points (VL cohort not awkward; VL has a clean 0-JS
> static RSC path; the ≤15 kB target is a marginal, not first-load, number) and
> added a sixth test — **Sankey** — that decided it: **Vega-Lite cannot render a
> Sankey at all**, so it can't be the single foundation for a generalist
> catalog. Full evidence: [`spike-results.md`](./spike-results.md). The desk
> eval below is retained as the reasoning that produced the shortlist.

## What this can and can't decide

- **This desk eval can:** establish current-state facts (versions, license,
  rendering model, SSR/RSC posture, maintenance), score candidates against our
  criteria, and narrow five to two — plus define the tests that convert judgment
  into evidence.
- **This desk eval can't:** finalize the choice. The deciding factors (radix
  theming ergonomics, real SSR/RSC behaviour in our setup, whether a library
  bends to the Layer-3 specialists, real bundle numbers) only surface in code.
  Those are the **spikes**, run in Claude Code (this environment can't build or
  measure).
- **Grounding:** version/license/support facts are cited. **Scores are my
  assessment**, not measurements — the spikes replace them with evidence.

## Candidates — current state (Aug 2026)

| Library                      | Version (latest)                                        | License | Model                                                                                                                     | Maintenance signal                                                                        |
| ---------------------------- | ------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **visx** (Airbnb)            | `@visx/*` 4.0.0, ~Jun 2026                              | MIT     | Low-level React + D3 **primitives**; modular packages, bring-your-own theming/animation                                   | v4 stable in 2026; `@visx/sankey` added v3.12 (Nov 2024); moderate cadence, Airbnb-backed |
| **Observable Plot**          | 0.6.17 (0.x, pre-1.0)                                   | ISC     | High-level **mark grammar**; imperative (returns a DOM node); React via `useRef`/`useEffect` or `toHyperScript()` for SSR | Pre-1.0; slower cadence; SSR/a11y described as ongoing                                    |
| **Vega-Lite** (+ react-vega) | vega-lite 6.4.3 (v6 Mar 2025); react-vega 8.0.0 (~1 yr) | BSD-3   | Declarative **grammar of graphics** (JSON spec) on the Vega runtime; React wrapper embeds a Vega view                     | Core VL very active (domoritz et al.); React wrapper staler                               |
| **D3**                       | v7                                                      | ISC     | Low-level primitives (scales/shapes/selections); DOM-oriented                                                             | Stable, mature, slow-moving                                                               |
| **Recharts** (baseline)      | 3.9–3.10, 2026 (v3 Jun 2025)                            | MIT     | Mid-level **composable React components** on D3 math                                                                      | Very active in 2026 (v3 rewrite: 3500 tests, tree-shaking tests, portals)                 |

Sources: npmjs.com/@visx/visx; github.com/airbnb/visx/releases;
npmjs.com/@observablehq/plot; observablehq.com/plot/getting-started;
npmjs.com/vega-lite; npmjs.com/react-vega;
en.wikipedia.org/wiki/Vega_and_Vega-Lite; npmjs.com/recharts;
github.com/recharts/recharts (issue #7355, v3.0.0 release).

## Criteria & weights (proposed)

1. **Expressiveness / full-catalog coverage incl. Layer-3 specialists** — H
2. **Agent-friendliness** (named types + validatable inputs, or a clean spec
   target) — H
3. **SSR / RSC support** — M/H
4. **radix-colors theming** — M
5. **Lazy-loading / bundle discipline** — M
6. **"Build anything" escape hatch** — M
7. **Maintenance / maturity / license** — M
8. **Time-to-MVP / build effort** — M

## Scorecard (assessment, to be validated by spikes)

H = strong fit, M = workable, L = weak. Rationale is condensed; see
per-candidate notes.

| Criterion                    | visx | Observable Plot | Vega-Lite | D3  | Recharts |
| ---------------------------- | ---- | --------------- | --------- | --- | -------- |
| Expressiveness / specialists | H    | M/H             | M/H*      | H   | M        |
| Agent-friendliness           | M/H  | M               | H         | L   | M/H      |
| SSR / RSC                    | H†   | M               | M†        | M   | L/M†     |
| radix theming                | H    | M/H             | M         | H   | H        |
| Lazy / bundle                | H    | M               | L/M       | H   | M        |
| Escape hatch                 | H    | M/H             | H         | H   | L        |
| Maintenance / maturity       | M/H  | M               | H (core)  | H   | H        |
| Time-to-MVP                  | L/M  | M               | H         | L   | H        |

\* Vega-Lite is strong for statistical charts but funnel/Sankey/cohort are
awkward or non-native in its grammar. † SSR/RSC ratings are assessments to
confirm in the spike (visx = pure React/SVG, server-renderable; Recharts
components are client-side and `ResponsiveContainer` needs the DOM; react-vega
embeds a client Vega view; Vega core can render SVG headlessly server-side).

## Per-candidate verdicts

- **visx — primary "build" foundation.** Low-level React+SVG primitives map
  exactly onto our layered/hybrid model (doc 02): we build the ~50 components
  and presets on top, own theming (radix-friendly — it deliberately adds no
  styling opinion), get tree-shakeable modular bundles, and pure-SVG output is
  SSR/RSC-amenable. It now ships building blocks for the hard cases
  (`@visx/sankey`, heatmap, shape). **Cost: most to build** — visx gives
  primitives, not charts.
- **Vega-Lite — primary "grammar / escape-hatch" candidate.** A declarative JSON
  spec is the natural target for an LLM and the natural implementation of
  `ChartFromSpec` (doc 04) for the long tail. Very broad coverage of statistical
  forms, active core. **Cost: heavy runtime/bundle, client-oriented React
  wrapper (RSC friction), weaker on commerce specialists (funnel/Sankey/cohort),
  and less pixel-control for a bespoke design system.**
- **Recharts — pragmatic MVP fallback.** Fastest path to Tier-1 charts as
  composable React components (a clean target for `{type, data, options}`), very
  active, MIT. **Ceiling:** bespoke specialists (cohort heatmap, control charts,
  box plots) and fine control require fighting it; SSR/RSC is a known friction;
  no low-level escape hatch → risk of rework against the full vision.
- **D3 — not recommended as the primary.** Maximum power, but in React you
  either use it for math + render yourself (which is essentially reimplementing
  visx) or for DOM (which fights React/RSC). Dominated by visx for our use; keep
  as a source of specific algorithms (force, sankey, contours).
- **Observable Plot — not recommended as the primary.** Elegant mark grammar,
  but pre-1.0 maturity, an imperative/black-box React integration, weaker
  specialist coverage and RSC story make it a risky long-term foundation.
  Reconsider if a spike shows its concise grammar dramatically cuts effort.

## Recommendation (to confirm by spike)

> **Spike outcome:** the two-library hypothesis below was the pre-spike lead,
> but a single foundation was then required operationally, and the spikes chose
> **visx** as that single foundation (see `spike-results.md`). The split below
> is retained only as the reasoning of record.

Narrow to **two finalists: visx and Vega-Lite.** The leading hypothesis is **not
"either/or" but a complementary split that is exactly the hybrid architecture in
doc 02:**

- **visx** builds the curated **preset catalog** (Tier 1–2, the ~80% of
  traffic), where we need control, radix theming, SSR/RSC, and small per-chart
  bundles;
- **Vega-Lite** (or a Vega-Lite–style spec) backs **`ChartFromSpec`**, the
  long-tail escape hatch for the rare/ad-hoc visualization the catalog doesn't
  cover.

**Recharts** remains a fallback: if the visx build cost is too high for the
timeline, use Recharts to ship Tier-1 fast and migrate specialists later. The
spikes exist to prove or break this hypothesis.

## Spike plan (run in Claude Code)

Time-box each; run against the finalists (visx, Vega-Lite; add Recharts to spike
1 and 4 if the MVP-speed question is live). Each has a binary acceptance test.

1. **Specialist render.** Build one Layer-3 specialist — proposed: **cohort
   retention heatmap** (or funnel/Sankey). _Pass:_ renders correctly from
   realistic data with reasonable code volume and no library-fighting hacks.
   _Records:_ lines of code, friction notes.
2. **radix-colors theming.** Wire a chart's full semantic palette (accent,
   positive, negative, categorical 1..n, neutral ink) to radix scales, with
   light/dark switch. _Pass:_ theme switches cleanly, semantic roles map without
   hard-coded hex, color-blind-safe categorical sequence achievable.
3. **SSR / RSC.** Server-render a static chart to HTML with no client JS;
   separately hydrate an interactive one. _Pass:_ renders on the server with no
   `window is not defined`, hydration is clean, static case ships ~0 client JS.
4. **Lazy-load + bundle.** Dynamic-import one preset; measure the incremental
   chunk and confirm unused types don't ship. _Pass:_ per-chart chunk within
   budget (**propose target ≤ ~15 kB gz for a visx preset**; set the number with
   the team), shared core factored out.
5. **Agent-selection ergonomics.** Represent a preset's selection metadata
   (doc 06) and render from a resolver payload `{type, data, options}`. _Pass:_
   clean, typed mapping from resolver output to a rendered chart; invalid inputs
   fail safe to the DataTable.

Deliverable of the spikes: a short results table (pass/fail + notes per finalist
per spike) that turns the scorecard above into evidence and picks the
foundation.

## Handoff notes for Claude Code

- Bring the whole doc set (00–07). Docs 02 (architecture), 04 (component
  inventory), 06 (selection) define what the spikes must satisfy.
- The spikes are **throwaway proofs**, not the start of the real library —
  optimize for answering the five questions, then discard.
- Re-verify versions at build time (this file's facts are Aug 2026 and will
  drift).

## Open questions — resolved

1. Two-library vs single foundation? → **Single foundation required (decided);
   the spikes chose visx.** VL ruled out as sole foundation (Spike 1b: can't
   render Sankey).
2. Bundle budget targets? → **Deferred to Phase 1.** Lazy-loading kept; no
   numeric per-tier gate set now (measured reference numbers in
   spike-results.md).
3. Recharts-first for MVP speed? → **Moot.** Recharts was excluded from this
   round by instruction; the foundation is visx.

## Sources

- visx: https://www.npmjs.com/package/@visx/visx ·
  https://github.com/airbnb/visx/releases ·
  https://sourceforge.net/projects/visx.mirror/
- Observable Plot: https://www.npmjs.com/package/@observablehq/plot ·
  https://observablehq.com/plot/getting-started
- Vega-Lite: https://www.npmjs.com/package/vega-lite ·
  https://www.npmjs.com/package/react-vega ·
  https://en.wikipedia.org/wiki/Vega_and_Vega-Lite_visualisation_grammars ·
  https://vega.github.io/vega-lite/ecosystem.html
- Recharts: https://www.npmjs.com/package/recharts ·
  https://github.com/recharts/recharts/issues/7355 ·
  https://github.com/recharts/recharts/releases/tag/v3.0.0
- React 19 current: https://en.wikipedia.org/wiki/React_(software)
