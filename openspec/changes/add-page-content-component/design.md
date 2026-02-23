# Design: PageContent Compound Component

## Context

MC's merchant-center-application-kit provides three separate page content
containers: `PageContentWide` (1200px, multi-column), `PageContentNarrow`
(742px, single-column), and `PageContentFull` (no constraint). The Wide variant
uses `Children.toArray()` to split children into columns, which is fragile and
implicit. Nimbus consolidates these into a single compound component with an
explicit API.

## Goals / Non-Goals

**Goals:**

- Single component replacing three MC variants via `variant` prop
- Explicit compound API (`PageContent.Column`) instead of implicit children
  splitting
- CSS grid-based centering matching MC's grid-template-areas pattern
- Sticky sidebar support with configurable top offset using Chakra spacing
  tokens
- Responsive collapse from multi-column to single column on small screens
- Style prop escape hatch for custom column configurations beyond built-in
  variants

**Non-Goals:**

- Nested PageContent components
- Scroll-aware header pinning

## Decisions

### Foundation: CSS Grid Centering

Following the MC pattern, Root uses a 3-column CSS grid for centering:
`grid-template-columns: 1fr minmax(min, max) 1fr` with
`grid-template-areas: '. content .'`. The center column holds the content area.

Max-width values mapped to closest Nimbus sizing tokens:

- **wide**: `minmax({sizes.sm}, {sizes.6xl})` — sm=384px, 6xl=1152px
- **narrow**: `minmax({sizes.sm}, {sizes.3xl})` — sm=384px, 3xl=768px
- **full**: `1fr` (no constraint, content takes full width)

### Column Layout: CSS Grid on Content Area

When `columns` is set to `"1/1"` or `"2/1"`, the content area within Root
becomes a CSS grid:

- `"1"`: single column (default), `minmax(0, 1fr)`
- `"1/1"`: equal columns, `repeat(2, minmax(0, 1fr))`
- `"2/1"`: main + sidebar, `minmax(0, 2fr) minmax(0, 1fr)`

Using `minmax(0, Xfr)` prevents content from breaking column dimensions (same
pattern as MC).

### Gap: Style Prop, Not Recipe Variant

MC uses two fixed gap sizes (spacing50=32px, spacing70=64px). Instead of
creating a recipe variant with abstract names, the recipe base sets a default
`gap: "800"` (32px, matching MC's smaller gap). Consumers override with
Chakra's standard `gap` style prop using spacing tokens:

```tsx
<PageContent.Root variant="wide" columns="1/1" gap="1600">
```

This avoids an unnecessary abstraction layer and uses the token system directly.

### Custom Column Configurations via Style Props

The three built-in `columns` variants cover standard use cases. For custom
layouts, consumers can override directly with Chakra style props on Root and
Column:

```tsx
// Custom 3-column layout via style prop override
<PageContent.Root variant="wide" gridTemplateColumns="1fr 2fr 1fr">
  <PageContent.Column>Nav</PageContent.Column>
  <PageContent.Column>Main</PageContent.Column>
  <PageContent.Column>Aside</PageContent.Column>
</PageContent.Root>
```

Style props override recipe defaults per standard Chakra behavior. This keeps
the built-in variants simple while allowing any CSS grid configuration.

### Compound API vs Implicit Children Splitting

MC uses `Children.toArray(props.children)` to extract left/right children.
This is fragile — it breaks with fragments, conditionals, or wrapper elements.

Nimbus uses explicit `<PageContent.Column>` children. In single-column mode
(`columns="1"` or omitted), children are rendered directly without needing
Column wrappers. In multi-column mode, consumers wrap each column's content
in `<PageContent.Column>`.

### Sticky Sidebar

MC automatically makes the right column sticky in `2/1` mode with `top: 0`.
Nimbus makes this explicit via a `sticky` prop on `PageContent.Column`:

- `sticky={true}`: applies `position: sticky; top: 0`
- `sticky="400"`: applies `position: sticky; top: {spacing.400}`

The prop is typed as `boolean | ConditionalValue<UtilityValues["top"]>` to
integrate with Chakra's token system and support responsive values.

### Responsive Behavior

Multi-column layouts collapse to single column on small screens via Chakra's
responsive breakpoint system. The recipe applies `gridTemplateColumns: "1fr"`
at the `mdDown` breakpoint, overriding the column layout.

### Semantic HTML

Root renders as `<div>` (not `<section>`) to avoid landmark proliferation.
Consumers can override via Chakra's `as` prop if semantic sectioning is needed.

## Risks / Trade-offs

- **Fixed column ratios as defaults** — Only 1, 1/1, 2/1 as recipe variants.
  Custom configurations available via style props on Root/Column. This matches
  MC's built-in patterns while keeping the escape hatch open.
- **Sizing token approximation** — MC uses exact pixel values (1200px, 742px).
  Nimbus maps to closest sizing tokens (6xl=1152px, 3xl=768px). This is a
  minor visual shift but keeps the component fully token-based.
