# Specification: ScrollArea

## Overview

The ScrollArea component provides a scrollable container with custom-styled
scrollbar overlays and keyboard accessibility. It exposes a single-element API,
uses Nimbus design tokens, and conditionally manages keyboard focusability.
ARIA roles and accessible names are left to the consumer's discretion.

**Component:** `ScrollArea` (public API)
**Package:** `@commercetools/nimbus`
**Category:** Layout

## ADDED Requirements

### Requirement: Single-element API hides compound internals

The component SHALL present a single `<ScrollArea>` element to consumers,
assembling all internal parts (viewport, content, scrollbars, corner)
automatically.

#### Scenario: Basic vertical scroll

- **WHEN** `<ScrollArea maxH="200px">` is rendered with overflowing content
- **THEN** SHALL render a scrollable container with a vertical scrollbar overlay
- **AND** SHALL NOT require consumers to use compound sub-components

#### Scenario: Horizontal scroll

- **WHEN** `orientation="horizontal"` is set
- **THEN** SHALL render only a horizontal scrollbar
- **AND** SHALL NOT render a vertical scrollbar

#### Scenario: Both axes

- **WHEN** `orientation="both"` is set
- **THEN** SHALL render both vertical and horizontal scrollbars
- **AND** SHALL render a corner element

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

#### Scenario: Style props

- **WHEN** style props (e.g., `p`, `bg`, `maxH`, `w`, `borderRadius`) are passed
- **THEN** SHALL forward them to the root container element

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
- **THEN** SHALL apply the specified IDs to the corresponding internal elements
- **AND** consumers SHALL be able to use `getElementById` to access them

#### Scenario: Polymorphic rendering

- **WHEN** an `as` prop is passed (e.g., `as="nav"`, `as="main"`)
- **THEN** SHALL render the root element as the specified HTML element

#### Scenario: Children

- **WHEN** `children` are passed
- **THEN** SHALL render them inside the scrollable viewport
