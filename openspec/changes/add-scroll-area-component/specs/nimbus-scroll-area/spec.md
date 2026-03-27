# Specification: ScrollArea

## Overview

The ScrollArea component provides a scrollable container with custom-styled
scrollbar overlays and keyboard accessibility. It wraps Chakra UI's ScrollArea
(powered by Ark UI / zag-js) with a single-element API, Nimbus design tokens,
conditional `tabIndex` for keyboard focusability, and TypeScript enforcement of
accessible names for `role="region"`.

**Component:** `ScrollArea` (public API)
**Package:** `@commercetools/nimbus`
**Category:** Layout

## ADDED Requirements

### Requirement: Single-element API hides compound internals

The component SHALL present a single `<ScrollArea>` element to consumers,
assembling Chakra's compound parts (`Viewport`, `Content`, `Scrollbar`,
`Corner`) internally.

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

The component SHALL use a custom Nimbus slot recipe for scrollbar appearance.

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

### Requirement: TypeScript enforcement for role="region"

TypeScript SHALL enforce an accessible name when `role="region"` is set.

#### Scenario: role="region" with aria-label

- **WHEN** `role="region"` and `aria-label` are provided
- **THEN** SHALL compile without TypeScript errors

#### Scenario: role="region" with aria-labelledby

- **WHEN** `role="region"` and `aria-labelledby` are provided
- **THEN** SHALL compile without TypeScript errors

#### Scenario: role="region" without accessible name

- **WHEN** `role="region"` is set without `aria-label` or `aria-labelledby`
- **THEN** SHALL produce a TypeScript compilation error

#### Scenario: No role

- **WHEN** `role` is not set
- **THEN** `aria-label` and `aria-labelledby` SHALL be optional
- **AND** SHALL compile without TypeScript errors

### Requirement: Developer warning for missing accessible name

The component SHALL warn developers in development mode when `role="region"`
is used without an accessible name.

#### Scenario: Missing accessible name in development

- **WHEN** `role="region"` is set
- **AND** neither `aria-label` nor `aria-labelledby` is provided
- **AND** the app is running in development mode
- **THEN** SHALL log a `[Nimbus]`-prefixed `console.warn`

#### Scenario: Production mode

- **WHEN** the app is running in production mode
- **THEN** SHALL NOT log any warnings

### Requirement: Component accepts Chakra style props

The component SHALL accept all Chakra style props and forward them to the
root element.

#### Scenario: Style props

- **WHEN** Chakra style props (e.g., `p`, `bg`, `maxH`, `w`, `borderRadius`)
  are passed
- **THEN** SHALL forward them to the root container element

#### Scenario: Ref forwarding

- **WHEN** a `ref` is passed to `ScrollArea`
- **THEN** SHALL forward the ref to the root DOM element

#### Scenario: Children

- **WHEN** `children` are passed
- **THEN** SHALL render them inside the scrollable viewport
