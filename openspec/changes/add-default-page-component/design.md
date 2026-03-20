# Design: DefaultPage Compound Component

## Context

The Merchant Center application-components package provides eight separate page
layout components: four detail page variants (`TabularDetailPage`,
`InfoDetailPage`, `CustomFormDetailPage`, `FormDetailPage`) and four main page
variants (`FormMainPage`, `InfoMainPage`, `TabularMainPage`,
`CustomFormMainPage`). These share significant structural overlap — title bar,
content area, optional footer — but differ in back navigation (detail only),
footer controls, and tab support. Each bakes in specific form controls and tab
navigation, making them rigid and difficult to customize.

Originally, Nimbus planned two separate components (`DetailPage` and `MainPage`)
to replace the detail and main variants respectively. During implementation, it
became clear the only structural difference was back navigation. Maintaining two
nearly identical components would create unnecessary duplication in code,
documentation, tests, and mental model.

Nimbus consolidates all eight into a single `DefaultPage` compound component.
`BackLink` is optional — include it for detail views, omit it for main pages.
CSS `:has()` rules adjust the header grid automatically when BackLink is present.

## Goals / Non-Goals

**Goals:**

- Single compound component replacing all eight MC page variants
- Composable sub-components instead of configuration props for form controls
- Grid-based root layout: `auto 1fr auto` for header/content/footer
- Optional BackLink for detail views (CSS `:has()` adjusts header grid)
- Optional TabNav for tabbed pages (CSS `:has()` removes header padding)
- Optional Footer for form pages (grid row collapses when absent)
- Sticky header/footer variants for long-scrolling content
- Header with title, subtitle, and actions area (CSS grid layout)
- i18n support for BackLink default text

**Non-Goals:**

- Built-in form save/cancel buttons (consumers compose their own via Footer)
- Built-in tab routing (consumers use TabNav / Tabs components directly)
- Content wrapping PageContent (consumers compose PageContent inside Content)
- Built-in subtitle rendering rules (consumers decide when to show subtitles)

## Decisions

### Consolidation: One Component Instead of Two

The original plan called for separate `DetailPage` and `MainPage` components.
The only structural difference is `BackLink` — everything else (header, title,
actions, content, footer) is identical. Maintaining two components would mean:

- Duplicate recipes, types, slots, sub-components, stories, and docs
- Two migration guides for consumers
- Two components for new contributors to learn

Making `BackLink` optional and using CSS `:has()` to adjust the header layout
eliminates all duplication with no API compromise. Consumers get a single,
well-documented component that covers every page pattern.

### Foundation: CSS Grid Root Layout

Root uses a CSS grid with `grid-template-rows: auto 1fr auto` and
`grid-template-columns: 1fr`:

- **Row 1 (auto)**: Header — takes its natural height
- **Row 2 (1fr)**: Content — fills all remaining vertical space
- **Row 3 (auto)**: Footer — takes natural height when present, collapses to
  zero when absent

This is more natural than flexbox for the "fill remaining space" pattern.

### Header: CSS Grid with `:has()` Rules

The header uses CSS grid (`1fr auto` columns) instead of flexbox. This allows
named areas and automatic repositioning of the Actions slot based on whether
BackLink is present:

- **Without BackLink**: Actions spans rows 1-2 (title + subtitle rows)
- **With BackLink**: Actions shifts to rows 2-3 (title + subtitle rows,
  skipping the backLink row)

The `:has()` rule `&:has(.nimbus-default-page__backLink)` applies this shift
automatically — no JavaScript state or context needed.

Similarly, `&:has(.nimbus-default-page__tabNav)` removes `paddingBottom` from
the header when TabNav is present, since TabNav provides its own spacing.

### Content Is a Plain Container

`DefaultPage.Content` is a simple scrollable `<main>` element with padding. It
does NOT wrap `PageContent.Root` internally (deviating from the original MainPage
proposal). This keeps the components decoupled:

- Consumers compose `PageContent` inside `Content` when they need width
  constraints
- Not all pages need width constraints (e.g., full-bleed dashboards)
- Avoids forced dependency between DefaultPage and PageContent

### Sticky Variants

`stickyHeader` and `stickyFooter` are boolean recipe variants that apply
`position: sticky` with appropriate `top`/`bottom` values and a background color.
These are useful for long forms where the header or footer should remain visible
during scrolling.

### No Built-in PageContent

Unlike the original MainPage proposal, Content does not wrap PageContent
internally. Consumers compose it explicitly when needed. This is more flexible
and avoids coupling two layout components.

## MC Migration Table

| MC Component | Nimbus Equivalent |
|---|---|
| `<InfoMainPage title="..." />` | `<DefaultPage.Root>` + Header + Title + Content (no BackLink, no Footer) |
| `<FormMainPage title="..." onPrimaryButtonClick={...} />` | Same + `<DefaultPage.Footer>` with buttons |
| `<CustomFormMainPage formControls={...} />` | Same as Form — Footer accepts any children |
| `<TabularMainPage tabControls={...} />` | Same + `<DefaultPage.TabNav>` in Header with TabNav/Tabs inside |
| `<InfoDetailPage title="..." previousPathLabel="..." />` | Same as InfoMainPage + `<DefaultPage.BackLink href="...">` |
| `<FormDetailPage title="..." previousPathLabel="..." />` | Same as FormMainPage + BackLink |
| `<CustomFormDetailPage formControls={...} previousPathLabel="..." />` | Same as CustomFormMainPage + BackLink |
| `<TabularDetailPage tabControls={...} previousPathLabel="..." />` | Same as TabularMainPage + BackLink |

Key differences from MC components:

- **No built-in buttons**: Consumers compose their own buttons in Footer/Actions
- **No built-in tab controls**: Consumers place TabNav/Tabs inside Header/Content
- **No `customTitleRow`**: Consumers compose Header with whatever content they want
- **No `previousPathLabel` prop**: Use `<DefaultPage.BackLink href="...">label</DefaultPage.BackLink>`
- **No `Intl` static property**: Consumers use their own i18n for button labels

## Risks / Trade-offs

- **More verbose than MC components** — Consumers write more JSX to compose the
  page. This is intentional — composition provides flexibility and avoids the
  prop explosion of the MC components.
- **CSS `:has()` browser support** — Requires modern browsers. All target
  browsers support `:has()` (Chrome 105+, Firefox 121+, Safari 15.4+).
- **No PageContent coupling** — Consumers must compose PageContent manually when
  they need width constraints. This adds a small amount of boilerplate but keeps
  the components orthogonal.
