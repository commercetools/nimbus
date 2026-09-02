# Prior Art — microcharts vs. Our Plan

_RFC appendix (alternatives / prior art). Status: analysis for context, not a decision._

**Honesty note:** this compares our plan against microcharts (https://microcharts.dev, https://microcharts.dev/charts) as observed from its public catalog, docs, and homepage claims — not its source. Where this describes microcharts' *internal* architecture it is inference and is flagged as such.

## Why compare at all
microcharts ships ~106 chart types. Our plan targets ~100 catalog entries. The surface numbers match, which invites the question "aren't we building the same thing?" We aren't — and unpacking why clarifies our own design.

## The headline
**Both land on ~100, but the number counts different things**, and that single fact drives every other difference.
- microcharts' ~106 are **distinct chart types** — each its own named component and drawing logic, sharing a uniform props API (`data`, `domain`, `color`, `title`) and theming contract.
- Our ~100 are **presets** — a base component + overlay(s) + default props + selection metadata. We write ~50 components (see doc 04) and compose the rest as configuration.

Same-size menu for the consumer; inverted structure underneath.

## Head-to-head

| Dimension | microcharts | Our plan |
|---|---|---|
| What "~100" counts | ~106 distinct chart types, each its own encoding | ~100 presets (config) over ~50 base/specialized components |
| Who selects the chart | The **author** — a developer, or a model writing a `{type, data}` fence — names the type | The **agent, at runtime**, via a library-side selector keyed on data shape + intent |
| Implementation topology | Wide-and-flat: many independent leaf components sharing conventions | Deep-and-layered: core → base components → overlays → presets |
| How variants are expressed | Ship a **separate type** (bullet, dual-sparkline, benchmark-strip, graded-band are all distinct) | One base + **composable overlays** (reference line, band, target, benchmark) covers many variants |
| Interactivity / scale | Minimal by design — focus readout, no axes/legends, static-render friendly, ~≤200px | Axes, legends, rich tooltips, brush/zoom, drill-down to table, full canvas |
| Theming | Derive a whole palette from **one accent** (`defineTheme`) | Map semantic roles onto **radix-colors** fixed 12-step scales |
| "Build anything" escape hatch | None — outgrow it and switch to a toolkit (Recharts) | Low-level core + `ChartFromSpec` is an explicit goal |
| Machine / agent interface | Strong: `catalog.json`, `llms.txt`, `openapi.json`, MCP | Same idea, extended — selection metadata drives *runtime* selection |

## The two rows that matter most

### 1. Flat catalog vs. layered catalog
microcharts appears to be ~106 hand-built components that share an API and theming contract but each carry their own drawing logic (its homepage stresses that unused types tree-shake away and each chart is independently ~2–7 kB — which reads like independent components, not presets over a shared kernel; **internals unconfirmed**). Our ~100 are mostly configuration over ~50 components. Theirs optimizes for **breadth of ready-made encodings**; ours for **reuse and extensibility**.

### 2. A menu vs. a maître d'
This is the real divergence. microcharts is remarkably AI-*friendly* — a model can emit a chart type and it renders — but the intelligence about *which* type answers *which* question lives in whoever writes the fence. Our plan pulls that decision into the library: a selector that takes the backend's data shape and the question's intent and returns the right preset (see doc 06). microcharts stops at "here are 106 things you can name"; we add "given this question and this data, here is the one to use," plus a low-level escape hatch for anything the catalog lacks.

## The honest footnote
Several of these differences trace upstream to the constraint we set aside (inline/word-sized). microcharts can *afford* ~106 independent components precisely because each is tiny and axis-less — little shared machinery (scales, axes, legends, tooltips) to duplicate. Once charts gain axes and interaction, duplicating that across 100 components is expensive, which is a large part of *why* our architecture leans on a shared core rather than a flat catalog. So the inline choice isn't fully separable from the "100 types" question — it is part of what makes their flat approach viable and ours impractical to copy directly.

## What to borrow anyway
Independent of the architecture difference, microcharts does several things we should copy: a machine-readable catalog surface (`catalog.json` / `llms.txt` / MCP), tagging every type with the plain-language *question it answers*, graceful rendering of bad data, and auto-generated alt text from the data. These map directly onto our selection-metadata contract and accessibility goals.

## Sources
- microcharts — https://microcharts.dev and https://microcharts.dev/charts (catalog, docs, homepage claims; internals not inspected).
