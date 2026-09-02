# Open Questions & Phased Plan — Handoff Cover Sheet

_The single best first-read for the doc set. Consolidates the open decisions
scattered across docs 00–07 and proposes a phased plan. Status: the phasing is a
proposal; the foundation decision is now settled by the Phase-0 spikes — see
`spike-results.md`._

> **Phase 0 complete (2026-08-28).** Foundation = **visx**, **single library**
> (no split); bundle budgets **deferred**. Evidence, rationale, and the six
> spike results are in [`spike-results.md`](./spike-results.md). Decisions #1
> and #3 below are closed and #2 is deferred; Phase 1 is the next step.

## Where we are

The strategy is set. We know the users, their questions, the intent × data-shape
model that maps questions to charts, the component inventory that implements
them, how the agent selects among them, and a shortlist of rendering foundations
with a spike plan to choose one. What remains is **empirical**: build throwaway
proofs to pick the foundation, then build the library. That work moves to Claude
Code.

## The doc set at a glance

| Doc                                       | What it settles                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 00 — narrative                            | The through-line: people → questions → (intents × shapes) → visualizations → components                            |
| 01 — project brief & decisions            | Locked decisions, constraints, microcharts framing, working preferences                                            |
| 02 — architecture, taxonomy, RFC skeleton | Catalog/grammar/hybrid axis, selection-metadata contract, 15 intents / 13 shapes / matrix, RFC outline, Tier 1/2/3 |
| 03 — personas & questions map             | 17 personas, ~200 questions tagged by intent + shape + candidate viz, sourced                                      |
| 04 — component inventory                  | ~50 React components (components ≠ ~100 presets), by layer, tagged                                                 |
| 05 — prior art: microcharts               | Flat vs layered catalog; "menu vs maître d'"; what to borrow                                                       |
| 06 — selection algorithm                  | filter → rank → tie-break; scoring signals; metadata fields; grounded in the literature                            |
| 07 — rendering foundation eval            | Current-state scorecard; finalists visx + Vega-Lite; the spike plan                                                |

## Open decisions register

Priority: **P0** blocks the next step, **P1** shapes core design, **P2** can be
deferred.

| #   | Decision                                                                  | Priority | Blocks                                                | How it resolves                                                                           |
| --- | ------------------------------------------------------------------------- | -------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | **Rendering foundation** (build-vs-wrap; catalog/grammar/hybrid)          | P0       | Layer-0 scope, exact component count, bundle strategy | **RESOLVED → visx**, wrap the foundation (spike-results.md)                               |
| 2   | **Bundle budget targets** per tier (concrete gz numbers)                  | P0       | Makes spike 4 pass/fail meaningful                    | **DEFERRED to Phase 1** — keep lazy-loading, no numeric gate now                          |
| 3   | **Single foundation vs. two-library** (visx + Vega-Lite spec)             | P1       | Escape-hatch design                                   | **RESOLVED → single library** (Spike 1b: VL can't render Sankey)                          |
| 4   | **Selection-metadata schema** (contract each component/preset declares)   | P1       | Selector, agent integration                           | Dedicated spec; partly depends on #1                                                      |
| 5   | **Backend↔frontend type negotiation** (named-type enum vs. spec vs. both) | P1       | Agent protocol                                        | Design decision + spike 5                                                                 |
| 6   | **Presets: pure config vs. some dedicated components**                    | P1       | Component count                                       | Default: pure config unless bespoke layout; settle in Phase 1                             |
| 7   | **Which Layer-3 specialists in v1** vs. deferred                          | P2       | Scope of v1                                           | Default: Tier-2 specialists in v1, Tier-3 progressive                                     |
| 8   | **Initial selection weights** before telemetry exists                     | P2       | Selector quality                                      | Seed from perceptual literature, then learn                                               |
| 9   | **Intent single-valued vs. ranked list**                                  | P2       | Selector input shape                                  | Design decision                                                                           |
| 10  | **Selector context depth for v1** (on-screen consistency, history)        | P2       | Selector complexity                                   | Design decision                                                                           |
| 11  | **radix role → scale mapping specifics**                                  | P2       | Theming                                               | **Validated in Spike 2** — light passes all gates; dark amber/orange caveat (see results) |

## Parallel / ongoing tracks (not blockers)

- **Persona-map validation** — check docs 03's personas/questions against a real
  question log or a stakeholder; the map is currently sourced-but-composite (see
  doc 03 caveats).
- **Telemetry** — instrument question → intent → candidates → chosen from day
  one; it replaces the first-pass prioritization (doc 03) and tunes the selector
  weights (doc 06) against real usage.

## The critical path

Decision #1 was the keystone — now resolved (**visx**, single library). With the
foundation chosen, Layer 0 is largely wrapped (visx primitives), the component
count firms toward doc 04's "≈44 excl. Layer 0," and the register unblocks: what
remains is design work (selection-metadata schema, the visx-based
`ChartFromSpec` escape hatch), not open forks.

## Phased plan (proposal)

| Phase                                              | Goal                                                                                                                                                                                                                                             | Exit criterion                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **0 — Spikes & foundation**                        | Run doc 07's five spikes on visx + Vega-Lite (+Recharts on 1 & 4); pick the foundation; set bundle budgets                                                                                                                                       | **✅ ACHIEVED** — visx; Layer-0 wrapped; #1/#3 closed, #2 deferred |
| **1 — Core + Tier 1 + selection skeleton**         | Layer 0 (built or wrapped), ThemeProvider (radix), ResponsiveContainer, LazyChart, DataTable; Tier-1 components (stat card, line/area, ranked bar, part-to-whole, table); selection-metadata schema + minimal registry/selector; telemetry wired | Agent asks → gets a Tier-1 chart → decision logged                 |
| **2 — Tier 2 + overlays + full selector**          | Overlays (reference line/band, target, benchmark) so one base serves many intents; Tier-2 components (grouped bar, bullet/gauge, funnel, heatmap, histogram/box); full filter→rank→tie-break with explainability + alternates toggle             | Majority of persona questions answered end-to-end                  |
| **3 — Tier 3 specialists + escape hatch + tuning** | Specialist tail (scatter, waterfall, geo, Sankey, cohort, control chart, Pareto…) progressively; `ChartFromSpec` escape hatch for the long tail; telemetry-driven weight tuning; persona-map validation                                          | Full catalog + escape hatch; selector tuned by data                |
| **4 — Hardening**                                  | Accessibility (alt-from-data, keyboard), i18n (currency/number/date), SSR/RSC across the catalog, enforced bundle budgets, docs + machine-readable catalog surface (catalog.json / llms.txt equivalent)                                          | Production-ready, agent-consumable catalog                         |

## Claude Code handoff

1. **Make the docs visible.** They live in `/mnt/user-data/outputs` as
   downloads, not in the project or any repo. Download all of 00–08 and put them
   in the working repo (e.g. `docs/`); point Claude Code at that folder as its
   first read.
2. **Opening instruction (tight, not "here are some docs"):** _"Read docs/00–07.
   Then execute the five spikes in doc 07 against visx and Vega-Lite (add
   Recharts to spikes 1 and 4) — one throwaway proof each — and report a
   pass/fail table with notes. Don't re-derive strategy; it's settled in the
   docs."_
3. **Let evidence win.** The spikes will surface things the desk eval couldn't,
   and some may contradict doc 07's scorecard — that's the point. Where spikes 1
   (specialist render), 3 (SSR/RSC), and 4 (bundle) disagree with the
   assessment, the spikes rule.
4. **Re-verify versions at build time** — doc 07's facts are Aug 2026 and will
   drift.

## Caveat

The phase sequencing and priorities here are a proposed plan, not sourced fact;
adjust against team capacity and timeline. The research-grounded parts live in
docs 03 (with sources) and 06/07 (with citations).
