# Project Brief — Generalist Data-Visualization Component Library

_Status: scoping / pre-RFC. Last updated from conversation on 2026-08-27._

## One-line goal
Build a generalist React visualization component library that an **agentic generative frontend** can use to visualize data that commerce stores generate, so store operators get an appropriate chart in answer to a natural-language question.

## How it works (the consuming architecture)
1. A store operator/admin asks a question in natural language (e.g., _"when do we sell most products?"_).
2. A backend service aggregates whatever data is available and either returns a result or declines.
3. The frontend receives the data and **automatically selects an appropriate visualization** from a known catalog.
4. Both backend and frontend are aware of the set of available visualization types.

The consumer of this library is therefore **an agent**, not a developer hand-picking a chart and not a merchant configuring a dashboard. This is the single most important framing decision.

## Locked decisions
- **Consumer = agent.** Selection is automated; the human reads the output.
- **Scale ≈ 100 visualization types**, **lazy-loaded on demand**. Breadth is explicitly fine; loading cost is managed by lazy loading.
- **Maximum generality.** Prefer a **low-level core that can express any visualization** over a library that ships ~10 out of the box and forces a second library for the other ~50.
- **Data-agnostic.** The library is tailored around **human questions**, not around what the backend can currently produce. It must work now and in the future regardless of backend shape.
- **radix-colors compatibility is required.** Whatever we build must map onto radix color scales.
- **Deliverable = an RFC.** We are not starting development yet. The RFC must contain the reasoning and the plan.

## Inspiration: microcharts.dev
Reference: https://microcharts.dev and https://microcharts.dev/charts

What is worth borrowing:
- A **fixed catalog of named types under one uniform API** (`data`, plus consistent `domain`/`color`/`title`).
- **Machine-readable catalog surfaces**: microcharts publishes `catalog.json`, `llms.txt`, and `openapi.json`, and exposes an MCP server. This is directly relevant to an agent that must pick a type.
- Every chart is **tagged with "the question it answers"** and browsable "by question" (e.g., _Is it trending? / What's it made of? / How much did it change? / Compare two things? / Show a distribution?_). Those questions are effectively **intents** — the bridge to our data-agnostic selection.
- Quality bar: **zero runtime deps, SSR/RSC-safe, accessible by default, per-chart bundle budgets, theme-from-one-color.**

What does **not** transfer:
- microcharts is deliberately **word-sized** (stops ~200px, no axes/legends/tooltips) and explicitly defers larger charts to a full toolkit like Recharts. Our charts are **not** constrained to a sentence, so we need axes, legends, and interactivity that microcharts intentionally omits.
- microcharts is a catalog, **not** a low-level "build anything" layer — which is the tension captured in the architecture doc.

## Open forks (to resolve in the RFC)
- **Catalog vs. grammar vs. hybrid** rendering architecture (see architecture doc).
- How the backend and frontend **negotiate/agree on types** (named-type enum vs. declarative spec).
- **radix-colors** mapping strategy for a palette that includes categorical scales and semantic valence.

## Working preferences captured for this project
- Claims/recommendations should carry a **source** (project file, URL, named expert/paper, or official docs). Prefer "I don't know" over guessing; retract unsupported claims.
- When working from documents, ground in **direct quotes** before analyzing.
- Default Jira project key: **FEC**.
