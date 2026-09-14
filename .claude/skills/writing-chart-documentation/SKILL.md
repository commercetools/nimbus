---
description: Create, update, or validate single-file MDX documentation for a nimbus-viz chart component
argument-hint: create|update|validate ChartName (e.g. create BarChart)
---

# Writing Chart Documentation Skill

You are the `@commercetools/nimbus-viz` chart documentation specialist. This
skill creates, updates, and validates the single `{chart}.mdx` doc that lives
beside each chart component in `packages/nimbus-viz/src/components/{chart}/`.

Charts are **not** core Nimbus components. They do **not** use the multi-tab
`.dev.mdx` / `.a11y.mdx` / `.guidelines.mdx` split, `jsx live-dev`, or
`.docs.spec.tsx` companions. A chart is documented in **one** `.mdx` file with
the shared page frontmatter and a **fixed body structure** (below).

## The core principle

**Consistency and source-truth.** All ~47 chart docs MUST share one section
order, one set of heading levels, and one set of section names, so a reader who
learns one chart page can navigate every chart page. And every factual claim
MUST come from the component source — never document a prop, capability, or
accessibility feature the chart does not actually implement.

A capable agent can write a good chart page freestyle. It will not write the
**same-shaped** page as the other 46, it will hand-write a props table that
drifts from the types, and it will skip the data-visualization accessibility
content. This skill exists to guarantee those three things.

## Modes

Parse `$ARGUMENTS` for the mode; default to **create**.

- **create** — write a new `{chart}.mdx` (or fully rewrite a thin stub).
- **update** — enrich/repair an existing `{chart}.mdx`, preserving what works.
- **validate** — check an existing `{chart}.mdx` against the checklist; report
  only, change nothing.

## Required research (all modes)

Do this BEFORE writing. Do not skip it — the body is derived from it.

1. **The component source** — `packages/nimbus-viz/src/components/{chart}/{chart}.tsx`.
   Read the `export interface {Chart}Props`, the JSX it renders, and which
   shared hooks/pieces it actually calls. Record, from the source:
   - the exact prop names, types, defaults, and which are required;
   - the **data prop** name and its type (`data`, `series`, `rows`, `graph`, …);
   - which config props exist (`orientation`, `variant`, `hue`, …);
   - whether it accepts overlays via `children`;
   - whether it wires interaction/selection (`InteractionProps`, hover, click);
   - which a11y hooks it uses (`useReducedMotion`, `useForcedColors`, patterns);
   - what it passes to `ChartContainer` (`ariaLabel`, `table`, `title`,
     `legend`, `loading`, `error`, …) — and therefore what it does NOT forward;
   - its empty/zero-size behavior (most return `null`).
2. **The data type** — the data prop is typed against
   `packages/nimbus-viz/src/chart/types.ts` (`CategoryDatum`, `Series`,
   `StackRow`, `ScatterPoint`, `HeatRow`, `FunnelStage`, `FlowGraph`, …) or a
   chart-local type in the `.tsx`. Read the actual definition; document that.
3. **The chart catalog** —
   `apps/docs/src/components/document-renderer/components/charts-home/charts-catalog.tsx`.
   Find this chart's **purpose** (FT Visual Vocabulary family) and the **other
   charts in the same purpose** — those are the "use instead" / "related"
   siblings. `<ChartMeta />` already renders this at the top of the page; your
   body sections restate the selection guidance in prose.
4. **The existing doc** (`{chart}.mdx`, if any) and **one neighbor doc** already
   written to this standard, to match voice and formatting.
5. **Shared infra APIs** you will reference: `ResponsiveContainer`
   (`packages/nimbus-viz/src/infra/responsive-container.tsx`),
   `ChartThemeProvider` + `coerceColorMode` (`src/theme/`), and `ChartContainer`
   (`src/chart/chart-container.tsx` — the source of the visually-hidden
   data-table fallback).

## Frontmatter — preserve, never invent

The frontmatter is a live contract with the docs pipeline (routing,
`<ChartMeta />` lookup by `exportName`, sidebar icon, nav order). If the file
already has frontmatter, **keep it byte-for-byte** unless a field is factually
wrong. When creating from scratch, use exactly these fields and no others (extra
keys fail the docs-build Zod schema):

```yaml
---
id: Charts-{ExportName} # e.g. Charts-BarChart
title: { Human Title } # e.g. Bar Chart
exportName: { ExportName } # e.g. BarChart — the PropsTable / ChartMeta key
description: { one-line intent } # the question this chart answers
lifecycleState: Experimental # Experimental|Alpha|Beta|Stable|Deprecated|EOL
order: { number } # nav sort key within Charts
icon: { NimbusIconName } # e.g. BarChart, Insights
menu:
  - Charts
  - { Human Title }
tags:
  - chart
  - { keyword }
---
```

Do NOT add the research-style keys `chartType`, `dataShape`, `since`,
`category`, or `related` — chart type and related charts already come from
`<ChartMeta />` + the catalog; data shape is a body section.

## Fixed body structure

Top-level sections are `##`. Subsections are `###`. Emit them in **this exact
order**. REQUIRED sections appear on every chart; CONDITIONAL sections appear
only when the source supports them; RECOMMENDED sections appear when they add
value, in the position shown.

| #   | Section                           | Level | When                                                                   |
| --- | --------------------------------- | ----- | ---------------------------------------------------------------------- |
| 1   | `## {Human Title}`                | `##`  | REQUIRED — `<ChartMeta />`, one-paragraph intent, hero `jsx live` demo |
| 2   | `## When to use`                  | `##`  | REQUIRED — when to reach for it + a "use instead" table of siblings    |
| 3   | `## Getting started`              | `##`  | REQUIRED — `### Import` + the provider/container wrappers              |
| 4   | `## Data shape`                   | `##`  | REQUIRED — the data prop's type + a copy-paste sample                  |
| 5   | `## API reference`                | `##`  | REQUIRED — `<PropsTable id="{ExportName}" />` (see below)              |
| 6   | `## Chart configuration`          | `##`  | REQUIRED — `###` subsection per capability the source has              |
| 7   | `## Responsiveness & performance` | `##`  | REQUIRED — `ResponsiveContainer`; large-data notes if wired            |
| 8   | `## Accessibility`                | `##`  | REQUIRED — see `references/dataviz-accessibility.md`                   |
| 9   | `## States`                       | `##`  | RECOMMENDED — empty/loading/error handling                             |
| 10  | `## Limitations`                  | `##`  | RECOMMENDED — capabilities the chart deliberately lacks                |
| 11  | `## Related charts`               | `##`  | REQUIRED — links to same-purpose siblings                              |
| 12  | `## Resources`                    | `##`  | OPTIONAL — external links                                              |

Never reorder, rename, or change the level of these sections. If a REQUIRED
section has little to say, say the little there is — do not drop it.

### 1. `## {Human Title}` (lead)

Keep the established chart opening: the `##` title, then `<ChartMeta />`, then a
one-paragraph description of what the chart shows and the question it answers,
then one hero `jsx live` demo. This preserves the house style of the existing
chart docs.

### 2. `## When to use`

State the one job this chart does well, then a **"use instead"** table steering
readers to sibling charts for adjacent jobs (derive the rows from the catalog's
same-purpose set and neighboring purposes):

```markdown
| You want to…                         | Use instead       |
| ------------------------------------ | ----------------- |
| Compare several series per category  | `GroupedBarChart` |
| Show each bar's internal composition | `StackedBarChart` |
```

### 3. `## Getting started`

An `### Import` block, then explain the two required wrappers every chart needs:
`ChartThemeProvider` (the chart calls `useChartTheme()` and **throws** without
it) and `ResponsiveContainer` (charts take numeric `width`/`height` and do no
measuring themselves).

### 4. `## Data shape`

Document the actual data prop and its type from `chart/types.ts` (or the local
type), as a fenced `ts` interface plus a small `tsx` sample array. Note contract
details you can verify from source (uniqueness, ordering, sign, null handling).

### 5. `## API reference`

Use the auto-generated table — **never hand-write one**:

```markdown
<PropsTable id="{ExportName}" />
```

The docs build extracts the props (types, defaults, required, literal enums,
TSDoc) from `{Chart}Props` and renders them. A hand-written table drifts from
the source; this one cannot. Add at most a one-line note after it for behavior
that is not a prop (e.g. "renders `null` for empty data or non-positive size").

> If `<PropsTable id="{ExportName}" />` renders "component not found", the
> nimbus-viz types are not in the manifest yet — run `pnpm build:docs`
> (`apps/docs/scripts/build.ts` merges the viz component types). Do NOT fall
> back to a hand-written table.

Because `<PropsTable>` reads TSDoc, **prop descriptions only appear if the
source has them.** Required props (`width`/`height`/the data prop) are commonly
uncommented. In `create`/`update`, if key props lack a `/** … */` comment, add
concise TSDoc to `{Chart}Props` in the `.tsx` so the table is complete, and say
you did so. Also check for **misplaced** doc comments: a `/** … */` block
separated from its prop by a blank line, or sitting above the wrong prop, binds
to nothing — move it to sit immediately above the prop it describes. Never
fabricate a description in the doc that the type doesn't carry.

### 6. `## Chart configuration`

One `###` subsection per capability **the source actually has**. A "capability"
is either a **configurable prop** (`orientation`, `variant`, `hue`,
`valueFormat`, `children`/overlays, interaction callbacks…) **or** an important
**automatic behavior** the chart always does (its axes & scales, an
auto-appearing legend, a built-in hover tooltip). Document both — label the
automatic ones plainly as automatic / not configurable so the reader knows there
is no prop to set. Configurable concepts get a `jsx live` demo; automatic
behaviors can be prose.

Common subsections (include only the applicable ones): Orientation / layout /
variant · Axes & scales · Legend · Color & theming · Tooltips & interaction ·
Overlays (`children`) · Labels & value formatting.

`## Limitations` is a different thing: it lists capabilities the chart **does
not have** — e.g. it does not forward a `ChartContainer` feature it _could_
(`title`, `caption`, `loading`, `error`, empty-state), has no click/selection
handlers, or has fixed formatting. Present-but-non-configurable behaviors belong
in Chart configuration (labeled automatic), **not** in Limitations.

### 7. `## Responsiveness & performance`

Show `ResponsiveContainer` with a fixed `height` and with `aspectRatio` +
`minHeight`/`maxHeight`, and note the initially-hidden-container safety (it
renders nothing until it observes a positive size; the chart returns `null` for
non-positive size). Mention large-dataset handling only if the chart wires it
(e.g. `decimate`/`lttb` downsampling) — check the source.

### 8. `## Accessibility`

**REQUIRED and load-bearing for charts.** Read
`references/dataviz-accessibility.md` and follow it. In short: give the
**alt-text to write** (Amy Cesal formula, seeded from the chart type +
description), state what is **automatic** (SVG `role="img"` + `ariaLabel`, the
visually-hidden **data-table fallback** via `ChartContainer` for WCAG 1.1.1,
CVD-validated palette, non-color encoding), state the **consumer's job** (pass a
meaningful `ariaLabel`; keep the `ChartThemeProvider`), and end with the WCAG /
Chartability checklist. Document only the a11y features this chart actually wires
— verify each against the source (e.g. don't claim reduced-motion if the
component never calls `useReducedMotion`).

### 9–12. States / Limitations / Related charts / Resources

- **States** — the chart's empty/loading/error behavior and how to guard
  upstream (charts usually render `null`, not their own messaging).
- **Limitations** — capabilities the chart deliberately lacks (single-series,
  no click handlers, fixed formatting, no legend passthrough). Honest scoping,
  from source.
- **Related charts** — link same-purpose siblings by their route:
  `[Grouped bar chart](/charts/grouped-bar-chart)` (route = `/charts/{dir}`,
  the sibling's kebab-case component directory). Internal links start with `/`.
- **Resources** — optional external links.

## Code examples (`jsx live`)

- Use ` ```jsx live ` for runnable demos (NOT `jsx live-dev` — that is core
  Nimbus dev docs). Use ` ```tsx ` / ` ```ts ` for non-runnable snippets
  (imports, interfaces, upstream-guarding patterns).
- Every runnable demo defines `const App = () => ( … )` and wraps the chart in
  `<ChartThemeProvider>` + `<ResponsiveContainer>` using the render-prop form:
  `{(width, height) => <Chart width={width} height={height} … />}`.
- **No imports inside `jsx live` blocks.** The docs' react-live scope already
  provides every `@commercetools/nimbus-viz` export (charts, `ChartThemeProvider`,
  `ResponsiveContainer`, overlays, `coerceColorMode`, formatters), all Nimbus UI
  components (`Box`, `Stack`, …), and React hooks.
- Every demo includes its **data inline** and is copy-paste-runnable.
- The chart frame is transparent; for a dark-mode demo wrap it in a dark
  container (e.g. `<Box bg="…" p="400" borderRadius="300">`).

## Validate mode checklist

Report PASS/FAIL per item; fix nothing in validate mode.

**Frontmatter**

- [ ] Only the allowed keys; `id` = `Charts-{ExportName}`; `menu` starts with
      `Charts`; `lifecycleState` is a valid enum value.
- [ ] `exportName` matches the real component export.

**Structure**

- [ ] All REQUIRED sections present, in the fixed order, at the right level.
- [ ] Lead section has `<ChartMeta />` + intent + one hero `jsx live` demo.
- [ ] `## API reference` uses `<PropsTable id="{ExportName}" />`, not a table.
- [ ] `## Accessibility` covers alt-text (Cesal), the data-table fallback, and a
      WCAG/Chartability checklist.

**Source-truth**

- [ ] Every prop/capability mentioned exists in `{Chart}Props` / the source.
- [ ] No claimed a11y feature the component doesn't wire.
- [ ] Data shape matches the actual data prop type.

**Examples**

- [ ] Runnable blocks use `jsx live`, define `App`, wrap in provider +
      container, include inline data, and use no imports.

## Common mistakes

| Mistake                                                               | Fix                                                                                             |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Inventing your own section order / names                              | Use the fixed table above, every time.                                                          |
| Hand-writing the props table                                          | `<PropsTable id="{ExportName}" />`; add TSDoc to source if descriptions are missing.            |
| Adding `chartType`/`dataShape`/`since` to frontmatter                 | Not allowed by the schema; chart type comes from `<ChartMeta />`, data shape is a body section. |
| Documenting `ChartContainer` features the chart doesn't forward       | Only what the source passes; the rest goes under Limitations.                                   |
| Claiming reduced-motion / forced-colors / interaction the chart lacks | Verify each a11y feature against the source before documenting it.                              |
| Using `jsx live-dev` or adding imports in demos                       | Charts use `jsx live`; the react-live scope already has everything.                             |
| Rewriting existing frontmatter to be "better"                         | It is a routing/ChartMeta contract — preserve it.                                               |
| Skipping a REQUIRED section because it's short                        | Keep the section; say the little there is.                                                      |

## Supporting files

- `chart-doc-template.mdx` — the skeleton to copy, with placeholders and
  `{{TODO}}` markers for the judgment-only prose.
- `references/dataviz-accessibility.md` — the accessibility contract: Cesal
  alt-text formula, what nimbus-viz provides automatically, consumer duties, and
  the WCAG + Chartability (POUR+CAF) checklist.

Leave no `{{TODO}}` marker in a finished doc.
