# Design: MainPage Compound Component

## Context

The Merchant Center application-components package provides four separate main
page components: `FormMainPage`, `InfoMainPage`, `TabularMainPage`, and
`CustomFormMainPage`. These share significant structural overlap (title bar,
content area) but differ in footer controls and tab support. Each bakes in
specific form controls (save/cancel buttons) and tab navigation, making them
rigid and difficult to customize.

Nimbus replaces all four with a single `MainPage` compound component that uses
composition for flexibility. Consumers assemble the page from building blocks
(Header, Title, Actions, Content, Footer) rather than configuring a monolithic
component.

## Goals / Non-Goals

**Goals:**

- Single compound component replacing four MC main page variants
- Composable sub-components instead of configuration props for form controls
- Grid-based root layout: `auto 1fr auto` for header/content/footer
- `MainPage.Content` wraps `PageContent.Root`, forwarding `variant` and
  `columns` props
- Optional footer for form pages (omit entirely for info pages)
- Tabs integration via composition (Tabs placed inside Content)
- Header with title and actions area (flex layout, space-between)

**Non-Goals:**

- Built-in form save/cancel buttons (consumers compose their own via Footer)
- Built-in tab routing (consumers use Tabs component directly)
- Back navigation (that's DetailPage's responsibility)
- Built-in subtitle rendering (consumers can add Text inside Header)

## Decisions

### Foundation: CSS Grid Root Layout

Root uses a CSS grid with `grid-template-rows: auto 1fr auto` and
`grid-template-columns: 1fr`:

- **Row 1 (auto)**: Header — takes its natural height
- **Row 2 (1fr)**: Content — fills all remaining vertical space
- **Row 3 (auto)**: Footer — takes natural height when present, collapses to
  zero when absent

This is more natural than flexbox for the "fill remaining space" pattern and
matches the grid approach used by `PageContent`.

### Header: Flex Layout

The header uses `display: flex` with `justify-content: space-between` and
`align-items: center`. Title sits on the left, Actions on the right. This is
the standard pattern for page headers.

### Content Wraps PageContent

`MainPage.Content` renders `PageContent.Root` internally and forwards the
`variant` and `columns` props. This avoids forcing consumers to manually
compose `PageContent.Root` inside every main page, since the content area
always needs width constraints.

The Content sub-component accepts all PageContent variant props (`variant`,
`columns`) plus its own children. Additional PageContent props (like `gap`)
can be passed through as style props.

### Footer Is Optional

When `MainPage.Footer` is not rendered, the third grid row (`auto`) collapses
naturally. No conditional logic needed — CSS grid handles this automatically.

For form pages, consumers place `FormActionBar` (or custom buttons) inside
Footer. For info/read-only pages, Footer is simply omitted.

### Composition Over Configuration (MC Migration)

| MC Component | Nimbus Equivalent |
|---|---|
| `<InfoMainPage title="..." />` | `<MainPage.Root>` + `<MainPage.Header>` + `<MainPage.Content>` (no Footer) |
| `<FormMainPage title="..." onPrimaryButtonClick={...} />` | `<MainPage.Root>` + header + content + `<MainPage.Footer>` with buttons |
| `<CustomFormMainPage formControls={...} />` | Same as Form — Footer accepts any children |
| `<TabularMainPage tabControls={...} />` | `<MainPage.Root>` + header + `<MainPage.Content>` with `<Tabs.Root>` inside |

Key differences:

- **No built-in buttons**: Consumers compose their own buttons in Footer/Actions
- **No built-in tab controls**: Consumers place Tabs component inside Content
- **No `customTitleRow`**: Consumers compose Header with whatever content they
  want
- **No `Intl` static property**: Consumers use their own i18n for button labels

### No i18n

MainPage is a pure layout component with no user-facing text. No i18n file
needed.

## Risks / Trade-offs

- **More verbose than MC components** — Consumers write more JSX to compose the
  page. This is intentional — composition provides flexibility and avoids the
  prop explosion of the MC components (which had 10+ props for button
  configuration).
- **Depends on PageContent** — MainPage.Content wraps PageContent.Root, creating
  a dependency. This is appropriate since every main page needs width
  constraints.
