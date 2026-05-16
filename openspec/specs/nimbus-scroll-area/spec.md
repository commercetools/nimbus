# nimbus-scroll-area Specification

## Purpose
TBD - created by archiving change add-scroll-area-component. Update Purpose after archive.
## Requirements
### Requirement: Single-element API hides compound internals

The component SHALL present a single `<ScrollArea>` element to consumers,
assembling all internal parts (viewport, content, scrollbars, corner)
automatically.

#### Scenario: Default orientation surfaces both scrollbars

- **WHEN** `<ScrollArea maxH="200px">` is rendered without an explicit
  `orientation` prop
- **THEN** SHALL default to `orientation="both"` and render both vertical and
  horizontal scrollbars whenever their axis overflows
- **AND** SHALL NOT require consumers to use compound sub-components

#### Scenario: Horizontal scroll

- **WHEN** `orientation="horizontal"` is set
- **THEN** SHALL render only a horizontal scrollbar
- **AND** SHALL NOT render a vertical scrollbar

#### Scenario: Both axes

- **WHEN** `orientation="both"` is set
- **THEN** SHALL render both vertical and horizontal scrollbars
- **AND** SHALL render a corner element

### Requirement: Strict orientations clip the opposite axis

When `orientation` is `"vertical"` or `"horizontal"`, the viewport SHALL
actively clip overflow on the opposite axis so descendant overflow cannot
scroll silently.

#### Scenario: Vertical-only suppresses horizontal overflow

- **WHEN** `orientation="vertical"` is set and descendant content is wider
  than the viewport
- **THEN** the viewport SHALL apply `overflow-x: hidden`
- **AND** the content wrapper SHALL be constrained to viewport width so
  sibling elements with `width: 100%` size against the viewport, not the
  widest descendant

#### Scenario: Horizontal-only suppresses vertical overflow

- **WHEN** `orientation="horizontal"` is set and descendant content is
  taller than the viewport
- **THEN** the viewport SHALL apply `overflow-y: hidden`

### Requirement: Conditional keyboard focusability

The viewport SHALL receive `tabIndex={0}` only when content overflows.

#### Scenario: Overflowing content

- **WHEN** content overflows on either the horizontal or vertical axis
- **THEN** the viewport SHALL have `tabIndex={0}`
- **AND** SHALL be reachable via Tab key
- **AND** SHALL be scrollable with Arrow keys, Page Up/Down, Home, End

#### Scenario: Non-overflowing content

- **WHEN** content does not overflow on any axis
- **THEN** the viewport SHALL NOT have `tabIndex`
- **AND** SHALL NOT appear in the Tab order

### Requirement: Keyboard-only focus ring

The component SHALL display a focus ring only during keyboard navigation.

#### Scenario: Keyboard focus

- **WHEN** the viewport receives keyboard focus (Tab key) and content overflows
- **THEN** a Nimbus focus ring SHALL appear on the root element
- **AND** SHALL use the global focus ring design tokens

#### Scenario: Mouse focus

- **WHEN** the viewport receives mouse focus (click)
- **THEN** a focus ring SHALL NOT appear

### Requirement: Scrollbar styling with Nimbus tokens

The component SHALL use Nimbus design tokens for scrollbar appearance.

#### Scenario: Scrollbar colors

- **THEN** scrollbar track SHALL use `neutral.4`
- **AND** thumb SHALL use `neutral.7` at rest
- **AND** thumb SHALL use `neutral.9` on hover/active

#### Scenario: Size variants

- **WHEN** `size="xs"` is set
- **THEN** scrollbar width SHALL be `sizes.100` (4px)
- **WHEN** `size="sm"` (default)
- **THEN** scrollbar width SHALL be `sizes.150` (6px)
- **WHEN** `size="md"`
- **THEN** scrollbar width SHALL be `sizes.200` (8px)
- **WHEN** `size="lg"`
- **THEN** scrollbar width SHALL be `sizes.300` (12px)

#### Scenario: Visibility variants

- **WHEN** `variant="hover"` (default)
- **THEN** scrollbar SHALL be hidden and appear on hover or during scrolling
- **WHEN** `variant="always"`
- **THEN** scrollbar SHALL be permanently visible
- **AND** the viewport SHALL reserve a gutter so the scrollbar does not overlay
  content

### Requirement: Per-axis scrollbar visibility

Each scrollbar SHALL be rendered only when its own axis overflows. A
vertical scrollbar SHALL NOT appear when only the horizontal axis overflows,
and vice versa.

#### Scenario: Only vertical axis overflows

- **WHEN** content overflows on the vertical axis but fits horizontally
- **THEN** the vertical scrollbar SHALL be visible
- **AND** the horizontal scrollbar SHALL NOT paint, regardless of the
  `orientation` prop rendering it into the DOM

#### Scenario: Only horizontal axis overflows

- **WHEN** content overflows on the horizontal axis but fits vertically
- **THEN** the horizontal scrollbar SHALL be visible
- **AND** the vertical scrollbar SHALL NOT paint

### Requirement: Content wrapper sizes to viewport by default

For default and `vertical` orientations, the content wrapper SHALL be sized
to the viewport (both width and height) so siblings with `width: 100%` size
against the viewport, and so consumers can vertically center a shorter child
with flex/grid + `height: 100%`.

Descendant overflow on either axis SHALL still be surfaced as viewport
scroll via `scrollHeight` / `scrollWidth`, so scrolling is unaffected.

For `orientation="horizontal"`, the wrapper SHALL instead preserve Zag's
`min-width: fit-content` so a row of items can scroll horizontally.

#### Scenario: `width: 100%` sibling of a wide child

- **WHEN** a `ScrollArea` with default or vertical orientation contains a
  sibling with `width: 100%` alongside an intrinsically wider element
- **THEN** the `width: 100%` sibling SHALL size against the viewport width,
  not the wider element's width

#### Scenario: Vertical centering of a short child

- **WHEN** a consumer renders a single child with flex/grid centering and
  `height: 100%` inside a `ScrollArea` whose children are shorter than the
  viewport
- **THEN** the child SHALL be vertically centered within the viewport
- **AND** the content wrapper SHALL fill the viewport vertically so the
  child's `height: 100%` resolves against a definite height

#### Scenario: Horizontal orientation preserves fit-content

- **WHEN** `orientation="horizontal"` is set with a row of items whose
  total width exceeds the viewport
- **THEN** the content wrapper SHALL grow to fit its widest descendants
- **AND** the horizontal scrollbar SHALL reflect that overflow

### Requirement: Scrollbar paints above viewport content

The scrollbar SHALL paint above content inside the viewport, such as
sticky-positioned elements.

#### Scenario: Sticky content in viewport

- **WHEN** the viewport contains sticky-positioned elements with z-index
- **THEN** the scrollbar SHALL paint above them

### Requirement: ARIA role support

The component SHALL accept an optional `role` prop of type `React.AriaRole`
and forward it to the root element. `aria-label` and `aria-labelledby` SHALL
be optional and forwarded to the root element. No compile-time or runtime
enforcement is applied — accessibility validation is left to the consumer's
tooling.

#### Scenario: Custom role

- **WHEN** `role="region"` and `aria-label` are provided
- **THEN** SHALL forward both attributes to the root element

#### Scenario: No role

- **WHEN** `role` is not set
- **THEN** no role attribute SHALL be rendered
- **AND** `aria-label` and `aria-labelledby` SHALL remain optional

### Requirement: External scroll area control via `value` prop

The component SHALL support external control by accepting a `value` prop
containing a scroll area machine created via `useScrollArea()`.

#### Scenario: External machine provided

- **WHEN** a `value` prop is passed (from `useScrollArea()`)
- **THEN** SHALL use `RootProvider` instead of `Root` internally
- **AND** the external machine SHALL provide access to scroll state
  (`hasOverflowX`, `hasOverflowY`, `isAtTop`, `isAtBottom`, `isAtLeft`,
  `isAtRight`) and methods (`scrollTo()`, `scrollToEdge()`,
  `getScrollProgress()`)

#### Scenario: No value prop

- **WHEN** `value` is not provided
- **THEN** SHALL create the scroll area machine internally (default behavior)

### Requirement: Component accepts style props

The component SHALL accept style props and forward them to the root element.
Style props that would collide with the component's internal overflow
contract (`overflow`, `overflowX`, `overflowY`) SHALL be removed from the
prop surface at the type level.

#### Scenario: Style props

- **WHEN** style props (e.g., `bg`, `maxH`, `w`, `borderRadius`) are passed
- **THEN** SHALL forward them to the root container element

#### Scenario: Overflow props rejected

- **WHEN** a consumer attempts to pass `overflow`, `overflowX`, or
  `overflowY`
- **THEN** the prop SHALL NOT be accepted by the `ScrollArea` type

#### Scenario: Padding props

- **WHEN** padding style props (e.g., `p`, `px`, `py`, `pt`) are passed
- **THEN** SHALL forward them to the Content slot inside the scrollable area
- **AND** SHALL NOT apply them to the root container element
- **AND** padding SHALL behave like native `overflow: auto` with padding

#### Scenario: Ref forwarding

- **WHEN** a `ref` is passed to `ScrollArea`
- **THEN** SHALL forward the ref to the root DOM element

#### Scenario: Viewport ref

- **WHEN** a `viewportRef` is passed to `ScrollArea`
- **THEN** SHALL forward the ref to the scrollable viewport element
- **AND** consumers SHALL be able to use it for programmatic scrolling, scroll
  event listeners, and reading scroll position

#### Scenario: Custom element IDs

- **WHEN** an `ids` prop is passed (e.g., `ids={{ viewport: "my-viewport" }}`)
- **THEN** SHALL apply the specified IDs to the corresponding internal
  elements
- **AND** consumers SHALL be able to use `getElementById` to access them
- **AND** the accepted keys SHALL be limited to `root`, `viewport`, and
  `content` — the only parts the underlying state machine honors

#### Scenario: Polymorphic rendering

- **WHEN** an `as` prop is passed (e.g., `as="nav"`, `as="main"`)
- **THEN** SHALL render the root element as the specified HTML element

#### Scenario: Children

- **WHEN** `children` are passed
- **THEN** SHALL render them inside the scrollable viewport

