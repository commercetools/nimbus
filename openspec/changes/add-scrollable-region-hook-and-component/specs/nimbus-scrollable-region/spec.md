# Specification: ScrollableRegion

## Overview

The ScrollableRegion capability provides a `useScrollableRegion` hook and a
`ScrollableRegion` component that make scrollable containers accessible to
keyboard and screen reader users. The hook detects content overflow via
`ResizeObserver`, dynamically manages ARIA attributes and focus ring, and
returns spread-ready props. The component is a thin wrapper around the hook.

**Hook:** `useScrollableRegion`
**Component:** `ScrollableRegion`
**Package:** `@commercetools/nimbus`
**Category:** Utility / Accessibility

## ADDED Requirements

### Requirement: Hook accepts configuration options
The hook SHALL accept an options object to configure scroll behavior and
accessibility.

#### Scenario: Default options
- **WHEN** `useScrollableRegion` is called with only `aria-label`
- **THEN** SHALL default `role` to `"group"`
- **AND** SHALL default `debounceMs` to `100`
- **AND** SHALL default `scrollable` to `"auto"`

#### Scenario: Custom role
- **WHEN** `useScrollableRegion` is called with `role: "region"`
- **THEN** SHALL use `"region"` as the landmark role when overflowing

#### Scenario: Custom debounce
- **WHEN** `useScrollableRegion` is called with `debounceMs: 200`
- **THEN** SHALL debounce overflow checks by 200ms

#### Scenario: Scrollable axis control
- **WHEN** `scrollable` is `"auto"` or `"scroll"`
- **THEN** SHALL enable scrolling on both axes
- **AND** SHALL detect overflow on both axes
- **WHEN** `scrollable` is `"y-auto"` or `"y-scroll"`
- **THEN** SHALL enable scrolling on the vertical axis only
- **AND** SHALL detect overflow on the vertical axis only
- **WHEN** `scrollable` is `"x-auto"` or `"x-scroll"`
- **THEN** SHALL enable scrolling on the horizontal axis only
- **AND** SHALL detect overflow on the horizontal axis only
- **WHEN** `scrollable` is `"none"`
- **THEN** SHALL disable scrolling on both axes

#### Scenario: Type-level enforcement for role="region"
- **WHEN** `role` is `"region"`
- **THEN** TypeScript SHALL require either `aria-label` or `aria-labelledby`

### Requirement: Hook returns ref, isOverflowing, and containerProps
The hook SHALL return a ref callback, a boolean overflow state, and a
spread-ready props object.

#### Scenario: Ref callback
- **WHEN** the returned `ref` is attached to a DOM element
- **THEN** SHALL begin observing that element for size changes via `ResizeObserver`

#### Scenario: isOverflowing reflects overflow state
- **WHEN** content overflows on the enabled axis
- **THEN** `isOverflowing` SHALL be `true`
- **AND** WHEN content does not overflow on the enabled axis
- **THEN** `isOverflowing` SHALL be `false`

#### Scenario: containerProps always includes role and accessible name
- **THEN** `containerProps` SHALL always include the configured `role`
- **AND** SHALL always include `aria-label` or `aria-labelledby` if provided
- **AND** SHALL always include `style` with the appropriate CSS overflow properties

#### Scenario: containerProps when overflowing
- **WHEN** `isOverflowing` is `true`
- **THEN** `containerProps` SHALL include `tabIndex: 0`

#### Scenario: containerProps when not overflowing
- **WHEN** `isOverflowing` is `false`
- **THEN** `containerProps` SHALL NOT include `tabIndex`

### Requirement: Overflow detection uses ResizeObserver with debounce
The hook SHALL use `ResizeObserver` to detect overflow and debounce the
evaluation.

#### Scenario: ResizeObserver monitors dimensions
- **WHEN** the ref is attached to a DOM element
- **THEN** SHALL create a `ResizeObserver` to monitor the element
- **AND** SHALL check overflow on the axis matching the `scrollable` prop

#### Scenario: Debounced evaluation
- **WHEN** rapid resize events occur within the debounce window
- **THEN** SHALL execute the overflow check only once after the debounce period

#### Scenario: Cleanup on unmount
- **WHEN** the component using the hook unmounts
- **THEN** SHALL disconnect the `ResizeObserver`
- **AND** SHALL cancel any pending debounced evaluation

### Requirement: Focus ring is keyboard-only
The hook SHALL show a focus ring only during keyboard navigation using
react-aria's `useFocusRing`.

#### Scenario: Keyboard focus on overflowing element
- **WHEN** the element is overflowing and receives keyboard focus (Tab key)
- **THEN** `containerProps.style` SHALL include focus ring outline styles
- **AND** outline SHALL use `var(--focus-ring-color)`, `var(--focus-ring-width)`,
  `var(--focus-ring-style)` CSS custom properties
- **AND** `outlineOffset` SHALL be `-2px` to prevent clipping by overflow

#### Scenario: Mouse focus on overflowing element
- **WHEN** the element is overflowing and receives mouse focus (click)
- **THEN** `containerProps.style` SHALL NOT include focus ring outline styles

#### Scenario: Focus on non-overflowing element
- **WHEN** the element is not overflowing
- **THEN** the element SHALL NOT be focusable (no `tabIndex`)

### Requirement: Developer warning for missing accessible name
The hook SHALL warn developers in development mode when accessibility
requirements are not met.

#### Scenario: Overflowing without accessible name
- **WHEN** `isOverflowing` is `true`
- **AND** neither `aria-label` nor `aria-labelledby` is provided
- **AND** `process.env.NODE_ENV` is not `"production"`
- **THEN** SHALL log a `console.warn` describing the missing accessible name

#### Scenario: Not overflowing without accessible name
- **WHEN** `isOverflowing` is `false`
- **AND** neither `aria-label` nor `aria-labelledby` is provided
- **THEN** SHALL NOT log a warning

### Requirement: ScrollableRegion component renders as a Box
The component SHALL always render a Chakra `Box` (`<div>`) and use ARIA
attributes for semantics.

#### Scenario: Overflowing with role="region"
- **WHEN** the component is overflowing and `role` is `"region"`
- **THEN** SHALL render a `<div>` with `role="region"`
- **AND** SHALL spread `containerProps` onto the element

#### Scenario: Overflowing with role="group"
- **WHEN** the component is overflowing and `role` is `"group"` (or default)
- **THEN** SHALL render a `<div>` with `role="group"`

#### Scenario: Not overflowing
- **WHEN** the component is not overflowing
- **THEN** SHALL render a `<div>` with `role` and accessible name intact
- **AND** SHALL NOT include `tabIndex`

#### Scenario: Ref forwarding
- **WHEN** a `ref` is passed to `ScrollableRegion`
- **THEN** SHALL forward the ref to the rendered DOM element
- **AND** SHALL merge it with the hook's internal ref

### Requirement: Component accepts standard HTML attributes
The component SHALL accept and forward standard HTML div attributes.

#### Scenario: className and style
- **WHEN** `className` or `style` props are passed
- **THEN** SHALL merge them with hook-provided styles

#### Scenario: Children
- **WHEN** `children` are passed
- **THEN** SHALL render them inside the scrollable container

#### Scenario: Event handlers
- **WHEN** event handlers (e.g., `onScroll`) are passed
- **THEN** SHALL forward them to the rendered element
