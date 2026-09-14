---
description:
  Full production-readiness audit for one @commercetools/nimbus-viz chart — API
  completeness, accessibility, missing capabilities, then writes real Storybook
  coverage and fixes what's approved
argument-hint: <ChartName or chart-dir-name> (e.g. BarChart, bar-chart)
allowed-tools: Glob, Grep, Read, Edit, Write, Bash, Agent
---

# /chart:introspect — Chart Production-Readiness Introspect

Audits one `packages/nimbus-viz` chart against its actual capability surface,
the accessibility contract, and real dogfooding evidence — then closes the gaps
it finds: fixes the component, refreshes its docs, writes real Storybook stories
(today every chart's story file is an 11-line stub with no play function —
`git log`/`ls -la` on any `src/components/*/*.stories.tsx` confirms this is
universal, not chart-specific), and verifies before committing.

This is the nimbus-viz counterpart to the general "does this component meet the
bar" question `/review` answers for `packages/nimbus` — but charts have no
recipe/slots/types-file split and a different accessibility contract (SVG
`role="img"` + data-table fallback, not ARIA widget roles), so this command
audits them on their own terms rather than reusing `docs/file-type-guidelines/`
verbatim.

## Input

`$ARGUMENTS` — a chart's export name (`BarChart`) or directory name
(`bar-chart`). If empty, list every directory under
`packages/nimbus-viz/src/components/` and ask which one.

## Process

### 0. Resolve & validate

Resolve `$ARGUMENTS` to `packages/nimbus-viz/src/components/{kebab-name}/` (try
an exact kebab-case match first, then kebab-case the PascalCase input). Confirm
all four exist: `{chart}.tsx`, `{chart}.stories.tsx`, `{chart}.mdx`, `index.ts`.
If any are missing, report which and stop — do not run a partial pipeline. Read
the `.mdx` frontmatter's `exportName` and confirm it matches the real export in
`{chart}.tsx` / `index.ts`; a mismatch is itself a 🔴 finding carried into
Step 2.

### 1. Gather facts (no judgment yet)

Read, and record verbatim what you find — this step is inventory, not opinion:

- **`{chart}.tsx`** — the exported `Props` interface (with TSDoc), whether
  `@experimental` is present, and which shared pieces it actually calls:
  `ChartContainer` (and which of `title`/`subtitle`/`caption`/`legend`/
  `legendSlot`/`table`/`loading`/`error`/`isEmpty`/`ariaLabel` it passes —
  `packages/nimbus-viz/src/chart/chart-container.tsx` is the full contract),
  `ChartScaleProvider`, `SvgTooltip`, `useChartTheme`, `useChartFormatters`,
  `useEntityColors`, `ResponsiveContainer`, any interaction props
  (`onDatumClick`/`onDatumHover`/`onSelectionChange`/`selection` — the shared
  contract is `InteractionProps<T>` in `chart/interaction.ts`, but as of this
  writing **zero** chart components declare `extends InteractionProps<T>`; each
  hand-rolls its own subset — note whether this chart's subset is a strict
  subset of the real contract or diverges from it), `useReducedMotion` /
  `useForcedColors` (`chart/use-reduced-motion.ts`, `chart/use-forced-colors.ts`
  — both exist and are exported, but as of this writing are called by zero chart
  components; treat wiring them as a capability to add only where the chart
  actually animates or encodes identity by fill color), `patternFill`/
  `ChartPatternDefs` (`chart/patterns.tsx`), `makeValueScale`
  (`chart/scales.ts`), `decimate`/`lttb` (`chart/decimate.ts`), and overlay
  `children` support.
- **The data prop's type** — from `chart/types.ts` (`CategoryDatum`, `Series`,
  `StackRow`, `ScatterPoint`, `HeatRow`, `FunnelStage`, `FlowGraph`, …) or a
  chart-local type. Note if it's ad hoc where a shared type would fit.
- **Individual marks** — grep the JSX for how marks wire
  `onMouseEnter`/`onMouseLeave`/`onClick`. As of this writing marks are plain
  `<rect>`/`<circle>`/`<path>` elements with **no individual accessible
  role/name** (confirmed on `bar-chart.tsx`) — a play function can only reach
  one via a raw DOM query (`canvasElement.querySelectorAll(...)`), not
  `getByRole`. Record whether that's true here too; don't assume a role exists
  without checking.
- **The current `{chart}.stories.tsx`** and **`{chart}.mdx`** — length, story
  count, whether any `play:` exists, which frontmatter/sections are present.
- **Registry participation** — grep
  `packages/nimbus-viz/src/selection/registry.tsx` for this chart's name.
  Registry entries are optional (roughly a third of chart directories have none
  as of this writing), so absence is not automatically a finding — only flag it
  if the chart is a strong intent-match candidate that's conspicuously missing.
- **Catalog presence** — grep
  `apps/docs/src/components/document-renderer/components/charts-home/charts-catalog.tsx`
  for this chart's `exportName`. There is no automated test enforcing every
  chart appears here, so check by hand.
- **Real usage** — grep `apps/viz-dashboard/src/pages/*.tsx` for this chart's
  export name; record which props are actually passed in production-shaped code
  (e.g. `BarChart` is already used with `onDatumClick` for drill-down in
  `overview.tsx`).
- **`packages/nimbus-viz/TODO.md`** — find every phase item that names this
  chart explicitly (e.g. "`A3-tail`... done: line, bar, scatter, grouped-bar,
  stacked-bar, bubble, waterfall, pareto") or that applies to it generically
  (`D2`/`D3` apply to every chart, since they're 0%-adopted repo-wide). Quote
  the exact item text — don't paraphrase the checklist into something it doesn't
  say.
- **`.changeset/viz-chart-refinements.md`** and
  **`.changeset/nimbus-viz-initial.md`** — check for this chart by name; these
  are real, dogfooding-sourced findings.

### 2. Capability & production-readiness audit

Work through each lens below. Classify every finding **🔴 Must Have** (would
leave real breakage, a WCAG failure, or an untested behavior in production),
**🟡 Nice to Have** (robustness/ergonomics, ships fine without it), or **🔵
Worth Noting** (deliberate scope boundary, or a repo-wide gap this one chart
shouldn't be singled out for). Only report lenses with findings.

| Lens                                  | Check against                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. API completeness & consistency** | TSDoc on every prop (required for `<PropsTable>`); data prop typed against `chart/types.ts` vs. ad hoc; naming vs. 1–2 same-purpose siblings from `charts-catalog.tsx`'s `purpose` grouping                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **B. `ChartContainer` coverage**      | `table` missing = 🔴 (WCAG 1.1.1, no data-table fallback); `legend` missing while ≥2 entities are color-coded = 🔴 (README's own stated rule: "any chart that distinguishes two or more entities by color carries a legend or direct labels"); `loading`/`error`/`isEmpty` — 🟡 unless dogfooding evidence shows async usage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **C. Accessibility**                  | Run the full checklist in `.claude/skills/writing-chart-documentation/references/dataviz-accessibility.md` §4 verbatim — `ariaLabel` default is Cesal-shaped, `table` wired, non-color encoding, palette (inherited, don't re-check), motion/forced-colors wired _only if_ the chart animates or relies on fill-color identity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **D. Interaction & selection**        | `onDatumClick`/`onDatumHover` present and justified by a real use case (drill-down evidence in `apps/viz-dashboard`); keyboard "view as table" disclosure reachable (this is `ChartContainer`'s `table` prop again — same finding, don't double-count)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **E. Data-shape & edge cases**        | empty data, single point, negative values (if a value axis exists), large-N decimation (only line/area families per `TODO.md #19`), `valueFormat`/`useChartFormatters` threading (`TODO.md A2-tail`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **E2. Boundary safety**               | Deliberately out of scope: `src/selection/` (the resolver/registry). This lens judges the component alone, on one question — **is this excluded input plausible for what this chart is _for_?** Answer it from the chart's own stated purpose/domain (its `.mdx` intent line, the kind of metric its family implies), not from whether some other layer would have steered a caller elsewhere; a sibling existing elsewhere in the library doesn't make an excluded case implausible for _this_ one; it makes it _have somewhere to go once found_, nothing more. **Implausible** for this chart's own domain (e.g. a five-dimensional input to a two-axis scatter plot) → a documented Limitation is sufficient; no runtime handling needed. **Plausible** (found piloting this on `BarChart`: `{category, value}` with a negative `value` — refunds, deltas, profit/loss by category are ordinary real data, and nothing in that shape signals "don't use `BarChart`" to whoever's holding it) → then actually exercise it (this is what an `EdgeCases` story does) and classify the result: **Loud** — visibly, obviously wrong (throws, or renders something a developer would immediately question) — 🔵 at most. **Silent-wrong** — renders something _plausible_ that doesn't match the input (`BarChart`'s negative value draws an invisible, zero-height bar — indistinguishable from an actual `0`) — always at least 🟡, escalate to 🔴 the more plausible the case. A `## Limitations` bullet or a "use instead" doc row does **not** resolve a Silent-wrong finding once the case is plausible — it only protects a developer who reads it _before_ making the mistake, not one whose chart is already wired to live data. The fix is component-local, not a resolver change: a dev-mode-only `console.warn` when the component detects the excluded case at render is the usual floor — cheap, changes nothing in production, and catches it the first time a real consumer hits it directly (which is how most consumers arrive — every chart's own "Getting started" import example is the direct API, not the resolver). |
| **F. Test coverage**                  | Does `{chart}.stories.tsx` have _any_ `play` function? `docs/file-type-guidelines/unit-testing.md` states verbatim: "All component behavior, interactions, and visual states are tested in Storybook stories with play functions. Unit tests are reserved for utilities and hooks only." (`testing-strategy.md`'s Story/Unit/Consumer table is the companion framing, not the source of that sentence — cite the file the exact words actually live in) — a chart with zero play coverage is failing the same bar every other Nimbus component is held to, not a chart-specific exemption                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **G. Documentation**                  | Invoke `writing-chart-documentation` in **validate** mode for this chart; fold its PASS/FAIL list in here rather than re-deriving it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **H. Dogfooding evidence**            | Does `apps/viz-dashboard` use this chart? With which props? Does it appear in either `.changeset/*viz*` file?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### 3. Compose the audit report

```
## Chart Audit: {ChartName} (`packages/nimbus-viz/src/components/{kebab-name}/`)

### Overall Assessment
1-3 sentences.

### 🔴 Must Have
- **[Title]** — gap, why it matters, cited source, concrete fix.

### 🟡 Nice to Have
(same format)

### 🔵 Worth Noting
(same format)
```

Be direct. If the chart is genuinely solid, say so — do not manufacture findings
to fill sections.

### 4. Adjudicate with `nimbus-reviewer`

Hand the full audit report to the `nimbus-reviewer` agent and ask it to decide,
per finding: which 🔴 items it agrees are blocking (all, unless it states an
explicit architectural exception), and which 🟡 items to do now vs. defer.
`nimbus-reviewer`'s own File Type → Skill Mapping table has no row for a chart's
single-file shape (no separate `.recipe`/`.slots`/`.types.ts`) — tell it
explicitly to apply `writing-chart-documentation`, not
`writing-developer-documentation`, to the `.mdx`, and that there is no
`writing-chart-stories` row yet in its mapping (this command invokes that skill
directly in Step 6). Report its full response — this is a report step, not a
confirmation gate; an unattended run (e.g. via `auto-optimize-viz`) must not
stall here.

Build the **approved change list**: every 🔴, plus whichever 🟡 items
`nimbus-reviewer` recommended doing now.

### 5. Apply approved fixes

Delegate implementation to the `nimbus-coder` agent, passing the approved change
list, per the repo's own Agent-Driven Development Workflow (`CLAUDE.md`).
Typical fixes: add missing TSDoc, wire a missing `ChartContainer` prop, add
`onDatumClick`/`onDatumHover` (converging toward `InteractionProps<T>` rather
than another one-off variant), thread `valueFormat`, wire
`useReducedMotion`/`useForcedColors` where justified. Then re-run
`nimbus-reviewer` against the diff; iterate at most twice — if not converged,
stop and report the disagreement rather than looping indefinitely.

### 6. Refresh documentation

Invoke `writing-chart-documentation update {ChartName}` so the `.mdx` reflects
any new/changed props, capability sections, and the accessibility section —
reuse that skill's rules rather than re-deriving them here.

### 7. Write real Storybook coverage

Invoke `writing-chart-stories create {ChartName}` (or `update`, if the stub
already has partial content) — see that skill for the fixed story set. No
Chromatic `tags: ["vrt"]` on any story: `packages/nimbus-viz/TODO.md` records
this as a **dropped-by-product-decision** item for nimbus-viz specifically
("Chromatic is intentionally dropped — Storybook alone is the agreed bar") — do
not silently reintroduce it.

### 8. Verification gates

Run, from the repo root, in this order — the same three
`packages/nimbus-viz/TODO.md` already names as "Verify every increment":

```bash
pnpm --filter @commercetools/nimbus-viz typecheck
pnpm --filter @commercetools/nimbus-viz test      # unit (jsdom) + storybook (headless Chromium, incl. addon-a11y)
pnpm --filter @commercetools/nimbus-viz build
pnpm lint
```

If any gate fails: do **not** commit. Report the failure verbatim and either
send it back to Step 5 (still inside the two-iteration cap) or stop and leave
everything staged. Do not skip to another chart on a gate failure, even inside
an unattended loop — a broken chart needs a human, not a sibling processed on
top of it.

**Known blocking issue (`TODO.md` `E6`, found piloting this command on
`BarChart`):** once a chart's `.stories.tsx` has more than ~2 real (non-
`RegistryPreview`) chart instances across its stories, the `test` gate fails
intermittently with axe's `landmark-unique` / `scrollable-region-focusable` — an
`isolate: false` story-accumulation issue in `vitest.storybook.config.ts`, not a
defect in the chart being introspected. Check `TODO.md`'s `E6` for current
status before spending a Step-5 iteration chasing it as if it were this chart's
bug — if `E6` is still open, stop and report it exactly as any other gate
failure rather than looping on it.

### 9. Update `TODO.md` and recommend a `lifecycleState`

For every phase item in `TODO.md` this pass genuinely completed for this chart,
append the chart's name to that item's existing "done: …" parenthetical (small,
targeted edits — don't restructure the file). Then, using the `.mdx`
frontmatter's `lifecycleState` enum
(`Experimental|Alpha|Beta|Stable|Deprecated|EOL` per
`writing-chart-documentation`), recommend at most a **one-notch** bump (e.g.
`Experimental` → `Alpha`) if every 🔴 finding is closed, tests are green, and
docs validate — never jump straight to `Stable` from a single pass, since that
implies an API-frozen commitment for the whole surface. Apply the bump to the
frontmatter only if the user (or `auto-optimize-viz`) has not opted out.

### 10. Final verdict

Answer the four questions this command exists to answer, for this chart
specifically:

- **Is it solid?** — verdict + the one or two things that most determine it.
- **Missing capabilities?** — list, each tagged with its `TODO.md` phase ref.
- **Production ready?** — verdict + the recommended `lifecycleState`.
- **API concerns?** — naming/consistency findings from Lens A.

### 11. Commit

Stage exactly the files touched for this chart (`{chart}.tsx`, `{chart}.mdx`,
`{chart}.stories.tsx`, the targeted `TODO.md` edit; flag separately if a
_shared_ `chart/*`/`selection/*` file was touched, since that affects other
charts too). `git diff --staged` to confirm before committing. Commit message:

```
feat(nimbus-viz): harden {ChartName} — capability audit, docs, and story coverage
```

If nothing changed (the chart was already fully compliant), skip the commit and
say so.
