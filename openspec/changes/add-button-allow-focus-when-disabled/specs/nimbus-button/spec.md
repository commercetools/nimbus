## MODIFIED Requirements

### Requirement: Disabled State

The component SHALL support disabled state, with an opt-in variant that remains
focusable so it can host a `Tooltip` (or other focus/hover-driven affordance).

#### Scenario: Disabled via isDisabled

- **WHEN** `isDisabled={true}` is set
- **THEN** SHALL apply disabled styles (reduced opacity)
- **AND** SHALL prevent click/keyboard interactions
- **AND** `useButton` SHALL set appropriate disabled attributes based on element
  type
- **AND** SHALL show not-allowed cursor

#### Scenario: Disabled via deprecated disabled prop

- **WHEN** `disabled={true}` is set (deprecated)
- **THEN** SHALL behave identically to `isDisabled={true}`
- **AND** `isDisabled` SHALL take precedence if both are provided

#### Scenario: Focusable disabled via allowFocusWhenDisabled

- **WHEN** `isDisabled={true}` AND `allowFocusWhenDisabled={true}` are both set
- **THEN** SHALL render `aria-disabled="true"` and SHALL NOT render the native
  `disabled` attribute
- **AND** SHALL remain focusable and stay in the natural tab order (so keyboard
  users can reach it), unless `excludeFromTabOrder` is also set
- **AND** SHALL remain hoverable so hover/focus-driven affordances (e.g.
  `Tooltip`) can open
- **AND** SHALL apply the same disabled styling as a natively-disabled button
  (via the recipe `_disabled` / `[aria-disabled=true]` selector)
- **AND** SHALL suppress activation: `onPress` and `onClick` SHALL NOT fire, and
  `Enter`/`Space`, form submit/reset, and link navigation SHALL NOT occur

#### Scenario: allowFocusWhenDisabled without isDisabled

- **WHEN** `allowFocusWhenDisabled={true}` is set but the button is not disabled
- **THEN** SHALL behave as a normal enabled button (the prop has no effect)

### Requirement: ARIA Attributes

The component SHALL provide appropriate ARIA attributes per nimbus-core
standards.

#### Scenario: Accessible name

- **WHEN** button renders
- **THEN** SHALL have accessible name from children text
- **OR** SHALL use aria-label if provided
- **AND** icon-only buttons SHALL require aria-label

#### Scenario: State announcements

- **WHEN** loading state changes
- **THEN** SHALL announce to screen readers via aria-busy
- **WHEN** disabled
- **THEN** SHALL set aria-disabled="true"
- **WHEN** disabled with `allowFocusWhenDisabled`
- **THEN** SHALL set `aria-disabled="true"` while keeping the element in the
  accessibility tree and focusable, so any associated tooltip description is
  announced on focus

### Requirement: useButton Hook Integration

The component SHALL delegate behavior and accessibility concerns to React Aria's
`useButton` hook for the default path, and SHALL layer soft-disable behavior on
top only when `allowFocusWhenDisabled` is engaged.

#### Scenario: Handler processing

- **WHEN** component receives event handlers from props or ButtonContext
- **THEN** SHALL pass all props to `useButton` for processing
- **AND** `useButton`'s output SHALL overwrite raw handlers via JSX spread
  ordering (`{...contextProps} {...buttonProps}`)
- **AND** SHALL NOT use `mergeProps` to combine context and hook output (to
  prevent double-firing)

#### Scenario: Disabled state delegation (default)

- **WHEN** `isDisabled` is set (via props or ButtonContext) and
  `allowFocusWhenDisabled` is not engaged
- **THEN** `useButton` SHALL manage `disabled` attribute for native `<button>`
  elements
- **AND** `useButton` SHALL manage `aria-disabled` for non-native elements
  (e.g., `as="a"`)
- **AND** the component SHALL NOT manually set `aria-disabled` or
  `data-disabled`

#### Scenario: Disabled state delegation (focusable disabled)

- **WHEN** `isDisabled` AND `allowFocusWhenDisabled` are both set
- **THEN** the component SHALL pass `isDisabled: false` to `useButton` so no
  native `disabled` attribute is emitted and the element stays focusable
- **AND** the component SHALL set `aria-disabled="true"` itself
- **AND** the component SHALL withhold activation handlers from `useButton` and
  suppress the default action (via `preventDefault`/`stopPropagation` on click)
  so the button cannot be activated by mouse, touch, keyboard, or form
  submission
