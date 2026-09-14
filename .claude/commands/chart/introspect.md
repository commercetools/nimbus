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
(check how many charts still have none:
`grep -L "play:" packages/nimbus-viz/src/components/*/*.stories.tsx | wc -l`),
and verifies before committing.

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
  contract is `DatumInteractionProps<T>` / `InteractionProps<T>` in
  `chart/interaction.ts`; count adopters live with
  `grep -l "extends DatumInteractionProps\|extends InteractionProps" packages/nimbus-viz/src/components/*/*.tsx`
  and note whether this chart extends the shared contract or hand-rolls the
  callbacks), `useReducedMotion` / `useForcedColors`
  (`chart/use-reduced-motion.ts`, `chart/use-forced-colors.ts` — both exported;
  count adopters live with a grep; no chart animates today, so
  `useReducedMotion` is N/A unless this chart adds motion, and `useForcedColors`
  matters only where identity is carried by fill color), `patternFill`/
  `ChartPatternDefs` (`chart/patterns.tsx`), the scale helpers `valueDomain` /
  `bandByIndex` / `makeValueScale` (`chart/scales.ts`) versus inline visx
  scales, `stackKeys` (`chart/stack.ts`), `devWarn` (`chart/dev-warn.ts`),
  `decimate`/`lttb` (`chart/decimate.ts`), and overlay `children` support.
- **The data prop's type** — from `chart/types.ts` (`CategoryDatum`, `Series`,
  `StackRow`, `ScatterPoint`, `HeatRow`, `FunnelStage`, `FlowGraph`, …) or a
  chart-local type. Note if it's ad hoc where a shared type would fit.
- **Known bug classes** — run every `detect` command in
  `packages/nimbus-viz/docs/bug-classes.md` (from the repo root) and record
  which ones print `{chart}.tsx`. Each hit is a pre-classified Lens E2 finding:
  the row's "plausible when" cell gives the plausibility call, its "fix pattern"
  cell the fix. Check the row's "Status" entry first — some hits are listed as
  legitimate exceptions. If the chart is one of many hits for a row, say so in
  the report: that class belongs to `/chart:sweep`, not to this pass.
- **Individual marks** — grep the JSX for how marks wire
  `onMouseEnter`/`onMouseLeave`/`onClick`. In every chart audited so far, marks
  are plain `<rect>`/`<circle>`/`<path>` elements with **no individual
  accessible role/name** — a play function can only reach one via a raw DOM
  query (`canvasElement.querySelectorAll(...)`), not `getByRole`. Record whether
  that's true here too; don't assume a role exists without checking.
- **The current `{chart}.stories.tsx`** and **`{chart}.mdx`** — length, story
  count, whether any `play:` exists, which frontmatter/sections are present.
- **Registry participation** — grep
  `packages/nimbus-viz/src/selection/registry.tsx` and
  `packages/nimbus-viz/src/selection/presets.tsx` for this chart's name (presets
  reach charts through `render-adapters.tsx`, so check both). Registry
  participation is optional, so absence is not automatically a finding — only
  flag it if the chart is a strong intent-match candidate that's conspicuously
  missing.
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

| Lens                                  | Check against                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. API completeness & consistency** | TSDoc on every prop (required for `<PropsTable>`); data prop typed against `chart/types.ts` vs. ad hoc; naming vs. 1–2 same-purpose siblings from `charts-catalog.tsx`'s `purpose` grouping                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **B. `ChartContainer` coverage**      | `table` missing = 🔴 (WCAG 1.1.1, no data-table fallback); `legend` missing while ≥2 entities are color-coded = 🔴 (README's own stated rule: "any chart that distinguishes two or more entities by color carries a legend or direct labels"); `loading`/`error`/`isEmpty` — 🟡 unless dogfooding evidence shows async usage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **C. Accessibility**                  | Run the full checklist in `.claude/skills/writing-chart-documentation/references/dataviz-accessibility.md` §4 verbatim — `ariaLabel` default is Cesal-shaped, `table` wired, non-color encoding, palette (inherited, don't re-check), motion/forced-colors wired _only if_ the chart animates or relies on fill-color identity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **D. Interaction & selection**        | `onDatumClick`/`onDatumHover` present and justified by a real use case (drill-down evidence in `apps/viz-dashboard`); keyboard "view as table" disclosure reachable (this is `ChartContainer`'s `table` prop again — same finding, don't double-count)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **E. Data-shape & edge cases**        | empty data, single point, negative values (if a value axis exists), large-N decimation (only line/area families per `TODO.md #19`), `valueFormat`/`useChartFormatters` threading (`TODO.md A2-tail`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **E2. Boundary safety**               | Deliberately out of scope: `src/selection/` (the resolver/registry). This lens judges the component alone, on one question — **is this excluded input plausible for what this chart is _for_?** Answer it from the chart's own stated purpose/domain (its `.mdx` intent line, the kind of metric its family implies), not from whether some other layer would have steered a caller elsewhere; a sibling existing elsewhere in the library doesn't make an excluded case implausible for _this_ one; it makes it _have somewhere to go once found_, nothing more. **Implausible** for this chart's own domain (e.g. a five-dimensional input to a two-axis scatter plot) → a documented Limitation is sufficient; no runtime handling needed. **Plausible** (found piloting this on `BarChart`: `{category, value}` with a negative `value` — refunds, deltas, profit/loss by category are ordinary real data, and nothing in that shape signals "don't use `BarChart`" to whoever's holding it) → then actually exercise it (this is what an `EdgeCases` story does) and classify the result: **Loud** — visibly, obviously wrong (throws, or renders something a developer would immediately question) — 🔵 at most. **Silent-wrong** — renders something _plausible_ that doesn't match the input (`BarChart`'s negative value draws an invisible, zero-height bar — indistinguishable from an actual `0`) — always at least 🟡, escalate to 🔴 the more plausible the case. A `## Limitations` bullet or a "use instead" doc row does **not** resolve a Silent-wrong finding once the case is plausible — it only protects a developer who reads it _before_ making the mistake, not one whose chart is already wired to live data. The fix is component-local, not a resolver change: a dev-mode-only warning via `devWarn()` (`src/chart/dev-warn.ts`) when the component detects the excluded case at render is the usual floor — cheap, changes nothing in production, and catches it the first time a real consumer hits it directly (which is how most consumers arrive — every chart's own "Getting started" import example is the direct API, not the resolver). Before classifying, check the Step 1 bug-class hits: a hit on a `docs/bug-classes.md` row is already classified there. |
| **F. Test coverage**                  | Does `{chart}.stories.tsx` have _any_ `play` function? `docs/file-type-guidelines/unit-testing.md` states verbatim: "All component behavior, interactions, and visual states are tested in Storybook stories with play functions. Unit tests are reserved for utilities and hooks only." (`testing-strategy.md`'s Story/Unit/Consumer table is the companion framing, not the source of that sentence — cite the file the exact words actually live in) — a chart with zero play coverage is failing the same bar every other Nimbus component is held to, not a chart-specific exemption                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **G. Documentation**                  | Invoke `writing-chart-documentation` in **validate** mode for this chart; fold its PASS/FAIL list in here rather than re-deriving it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **H. Dogfooding evidence**            | Does `apps/viz-dashboard` use this chart? With which props? Does it appear in either `.changeset/*viz*` file?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

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
explicit architectural exception), and which 🟡 items to do now vs. defer. Its
File Type → Skill Mapping has a `packages/nimbus-viz` block (chart `.mdx` →
`writing-chart-documentation`, chart `.stories.tsx` → `writing-chart-stories`,
no Chromatic/VRT requirement); name the chart path so that block applies. Report
its full response — this is a report step, not a confirmation gate; an
unattended run (e.g. via `auto-optimize-viz`) must not stall here.

Build the **approved change list**: every 🔴, plus whichever 🟡 items
`nimbus-reviewer` recommended doing now.

### 5. Apply approved fixes

Delegate implementation to the `nimbus-coder` agent, passing the approved change
list, per the repo's own Agent-Driven Development Workflow (`CLAUDE.md`).
Typical fixes: add missing TSDoc, wire a missing `ChartContainer` prop, add
`onDatumClick`/`onDatumHover` by extending `DatumInteractionProps<T>` rather
than another one-off variant, thread `valueFormat`, replace an inline scale with
`valueDomain()` / `bandByIndex()` when a bug-class row names it, add a
`devWarn()` for a plausible excluded input (Lens E2), wire `useForcedColors`
where identity is carried by fill color. Then re-run `nimbus-reviewer` against
the diff; iterate at most twice — if not converged, stop and report the
disagreement rather than looping indefinitely.

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

Run, from the repo root, in this order. Fast-fail on the chart's own stories
first, then the whole package (the loop is the single writer to the package, so
whole-package gates are the rule, not the exception), then lint only what
changed — repo-wide lint is CI's job:

```bash
# 1. this chart's stories alone — fastest signal
pnpm vitest run --project nimbus-viz-storybook packages/nimbus-viz/src/components/{chart}/{chart}.stories.tsx
# 2. package gates
pnpm --filter @commercetools/nimbus-viz typecheck
pnpm --filter @commercetools/nimbus-viz test      # unit (jsdom, incl. the registry invariant spec) + storybook (headless Chromium, addon-a11y)
pnpm --filter @commercetools/nimbus-viz build     # the DTS step is the real gate for generics
# 3. lint the touched files
pnpm exec eslint <every touched file>
```

If any gate fails: do **not** commit. Report the failure verbatim and either
send it back to Step 5 (still inside the two-iteration cap) or stop and leave
the files in the working tree. Do not skip to another chart on a gate failure,
even inside an unattended loop — a broken chart needs a human, not a sibling
processed on top of it.

If a shared file (`src/chart/*`, `src/theme/*`, `src/selection/*`,
`src/stories/*`) was touched, the whole-package `test` gate is mandatory and the
change must be named in the commit body — it affects every chart.

Two axe failures have known, non-chart causes worth recognizing on sight:
`landmark-unique` means two chart instances on the page share an auto-generated
default `ariaLabel` (fix: distinct `ariaLabel` per instance — bug class `BC-7`);
`scrollable-region-focusable` was a shared `DataTable` gap fixed in `8df4a5636`.
Neither is an `isolate: false` accumulation issue; `TODO.md` `E6` records why
that theory was wrong.

### 9. Update `TODO.md` and recommend a `lifecycleState`

Route what this pass learned to the place the next pass will read it:

- A finding that could recur in another chart → a new row (or a Status update)
  in `packages/nimbus-viz/docs/bug-classes.md`, in this same commit.
- A finding specific to this chart → its `.mdx` "Limitations" or a story.
- A roadmap-level gap → a `TODO.md` phase item.

For every phase item in `TODO.md` this pass genuinely completed for this chart,
append the chart's name to that item's existing "done: …" parenthetical (small,
targeted edits — don't restructure the file). Then decide the `lifecycleState`
against the checklist in `packages/nimbus-viz/docs/lifecycle.md` (the enum is
`Experimental|Alpha|Beta|Stable|Deprecated|EOL` per
`writing-chart-documentation`): recommend at most a **one-notch** bump (e.g.
`Experimental` → `Alpha`) when the chart meets every criterion of the next state
— never jump straight to `Stable` from a single pass, since that implies an
API-frozen commitment for the whole surface. Apply the bump to the frontmatter
only if the user (or `auto-optimize-viz`) has not opted out.

### 10. Final verdict

Answer the four questions this command exists to answer, for this chart
specifically:

- **Is it solid?** — verdict + the one or two things that most determine it.
- **Missing capabilities?** — list, each tagged with its `TODO.md` phase ref.
- **Production ready?** — verdict + the recommended `lifecycleState`.
- **API concerns?** — naming/consistency findings from Lens A.

### 11. Commit

Commit with an explicit pathspec on **both** `git add` and `git commit`. A bare
`git commit` commits whatever is staged at that moment, which once swept twelve
unrelated files into a chart commit; the pathspec form cannot.

```bash
git status --porcelain -- packages/nimbus-viz .claude    # only this pass's files may appear
git add -- packages/nimbus-viz/src/components/{chart}/{chart}.tsx \
           packages/nimbus-viz/src/components/{chart}/{chart}.mdx \
           packages/nimbus-viz/src/components/{chart}/{chart}.stories.tsx \
           packages/nimbus-viz/TODO.md packages/nimbus-viz/docs/bug-classes.md   # plus any shared file touched
git diff --staged --stat
git commit -m "$(cat <<'EOF'
fix(nimbus-viz): harden {ChartName} -- <one line: the main finding>

<what was found, what changed, which bug-class rows were added or updated,
which shared files were touched and why>
EOF
)" -- <the same exact paths>
git show --stat HEAD                                       # file list must equal the intended list
```

Use `fix(...)` when the pass corrected a bug and `feat(...)` only when it added
a capability. If nothing changed (the chart was already fully compliant), skip
the commit and say so.
