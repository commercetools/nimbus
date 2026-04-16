# Design: ScrollArea

## Architecture Decision: Chakra UI Proxy with Single-Element API

Instead of building a custom `useScrollableRegion` hook with `ResizeObserver`
and a thin component wrapper (as originally proposed), we proxy Chakra UI's
built-in ScrollArea component. Chakra's ScrollArea is powered by Ark UI /
zag-js, which already provides:

- Overflow detection via a state machine (`hasOverflowX`, `hasOverflowY`)
- Custom scrollbar overlays with drag-to-scroll
- Scroll position tracking and scrollbar sizing
- Corner element for bidirectional scrolling

### Why proxy instead of custom?

1. **Less code to maintain** — overflow detection, ResizeObserver lifecycle,
   debouncing, and scrollbar rendering are all handled by zag-js.
2. **Better scrollbar UX** — Ark UI provides draggable scrollbar thumbs with
   proper hit areas, not just visual indicators.
3. **Consistent with Nimbus patterns** — other components (Float, Bleed) also
   proxy Chakra primitives with Nimbus recipes.

### What we add on top

Chakra's ScrollArea lacks several features from the original spec:

1. **Conditional `tabIndex`** — zag-js has a bug where `tabIndex={0}` is only
   set when BOTH axes overflow. We fix this by reading
   `useScrollAreaContext()` and setting `tabIndex={0}` when EITHER axis
   overflows.
2. **Keyboard focus ring** — Chakra provides no focus styling. We add a
   `:focus-visible` ring on the root element via `_focusWithin` +
   `:has(:focus-visible)`.
3. **Nimbus design tokens** — scrollbar colors, sizes, and transitions use
   Nimbus token scale.

## Single-Element API

Consumers interact with a single `<ScrollArea>` component. The compound parts
(`Viewport`, `Content`, `Scrollbar`, `Corner`) are assembled internally and
not exposed.

### Why hide compound parts?

- **Simpler API** — consumers don't need to understand the internal structure.
- **Safer** — consumers can't accidentally break the scrollbar/viewport
  relationship.
- **Orientation-driven** — scrollbar axes are controlled by a single
  `orientation` prop rather than manual `<Scrollbar orientation="...">`.

### Padding prop forwarding

With compound parts hidden, consumers cannot put padding on `Content` directly.
To make `<ScrollArea p="400">` work intuitively, the component extracts all 24
Chakra padding style props (via `extractPaddingProps` utility) and forwards them
to the `Content` slot rather than `Root`. This means padding lives inside the
scrollable area — matching native `overflow: auto` + `padding` behavior.

Without forwarding, padding on `Root` would create dead space between the
viewport and the absolutely-positioned scrollbar, and the `always` variant
gutter calculation would misalign.

## Two-Component Internal Structure

Internally, the implementation uses two components (only `ScrollArea` is
exported):

1. **`ScrollArea`** (public) — extracts `children`, `orientation`, `ref`;
   renders `<ChakraScrollArea.Root>` with forwarded props.

2. **`ScrollAreaParts`** (private) — renders inside `Root` so it can call
   `useScrollAreaContext()` to read overflow state. Sets conditional `tabIndex`
   on Viewport. Conditionally renders Scrollbar(s) and Corner based on
   `orientation`.

This split is necessary because `useScrollAreaContext()` must be called inside
the `Root` provider.

## Focus Ring Strategy

The focus ring cannot be placed on the viewport element because the root has
`overflow: hidden`, which clips child outlines. Instead:

- Viewport gets `outline: none` (no browser default)
- Root gets a focus ring via `_focusWithin` + `:has(:focus-visible)` — the
  ring appears on the root when the viewport receives keyboard focus
- This uses the global Nimbus focus ring design tokens

## Slot Recipe

The component uses a slot recipe registered as `scrollArea` (matching Chakra's
built-in key to override the default recipe). Slots:

| Slot | Purpose |
|------|---------|
| `root` | Outer container, receives focus ring styles |
| `viewport` | Scrollable content area, native scrollbar hidden |
| `content` | Inner content wrapper |
| `scrollbar` | Overlay scrollbar track |
| `thumb` | Draggable scrollbar thumb |
| `corner` | Corner piece for bidirectional scrolling |

### Variants

| Variant | Values | Default |
|---------|--------|---------|
| `variant` | `hover`, `always` | `hover` |
| `size` | `xs`, `sm`, `md`, `lg` | `sm` |

### Gutter Strategy for `always` Variant

When `variant="always"`, the scrollbar is permanently visible and must not
overlay content. The viewport reserves a gutter via CSS:

- **Vertical scrollbar**: `width: calc(100% - scrollbar-size - margin * 2)` —
  works because width always resolves against a definite parent.
- **Horizontal scrollbar**: `flex: 1` + `marginBottom` — height calc does not
  work because the root's height comes from `maxHeight`, and CSS `%` heights
  require an explicit `height` property on the parent.

Both approaches reference the `--scroll-area-scrollbar-size` custom property,
so the gutter automatically adapts to the active size variant.

### Scrollbar Stacking Context

The scrollbar uses `zIndex: 1` (with `position: relative` from the recipe) so
it paints above viewport content that establishes its own stacking context, such
as sticky-positioned headers.

