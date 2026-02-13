## ADDED Requirements

### Requirement: Pressed State

The component SHALL expose press state as a data attribute.

#### Scenario: Data-pressed attribute

- **WHEN** user presses and holds the button (mouse, touch, or keyboard)
- **THEN** SHALL set `data-pressed` attribute on the root element
- **AND** SHALL remove `data-pressed` when the press ends
- **AND** press state SHALL be derived from `useButton`'s `isPressed`
- **AND** SHALL be available for CSS-based styling via `[data-pressed]` selector

### Requirement: Deprecated Native HTML Props

The component SHALL accept native HTML props that overlap with React Aria but
mark them as deprecated to guide consumers toward the preferred API.

#### Scenario: onClick deprecation

- **WHEN** consumer provides `onClick` handler
- **THEN** SHALL still function correctly
- **AND** editor tooling SHALL show `@deprecated` strike-through
- **AND** JSDoc SHALL recommend `onPress` as the preferred alternative

#### Scenario: disabled deprecation

- **WHEN** consumer provides `disabled` prop
- **THEN** SHALL still function correctly
- **AND** editor tooling SHALL show `@deprecated` strike-through
- **AND** JSDoc SHALL recommend `isDisabled` as the preferred alternative

#### Scenario: Mouse event deprecation

- **WHEN** consumer provides `onMouseEnter` or `onMouseLeave`
- **THEN** SHALL still function correctly
- **AND** editor tooling SHALL show `@deprecated` strike-through
- **AND** JSDoc SHALL recommend `onHoverStart` / `onHoverEnd` as alternatives

#### Scenario: tabIndex deprecation

- **WHEN** consumer provides `tabIndex`
- **THEN** SHALL still function correctly
- **AND** editor tooling SHALL show `@deprecated` strike-through
- **AND** JSDoc SHALL recommend `excludeFromTabOrder` as the preferred
  alternative

#### Scenario: aria-disabled deprecation

- **WHEN** consumer provides `aria-disabled`
- **THEN** SHALL still function correctly
- **AND** editor tooling SHALL show `@deprecated` strike-through
- **AND** JSDoc SHALL recommend `isDisabled` as the preferred alternative

### Requirement: useButton Hook Integration

The component SHALL delegate all behavior and accessibility concerns to React
Aria's `useButton` hook.

#### Scenario: Handler processing

- **WHEN** component receives event handlers from props or ButtonContext
- **THEN** SHALL pass all props to `useButton` for processing
- **AND** `useButton`'s output SHALL overwrite raw handlers via JSX spread
  ordering (`{...contextProps} {...buttonProps}`)
- **AND** SHALL NOT use `mergeProps` to combine context and hook output (to
  prevent double-firing)

#### Scenario: Disabled state delegation

- **WHEN** `isDisabled` is set (via props or ButtonContext)
- **THEN** `useButton` SHALL manage `disabled` attribute for native `<button>`
  elements
- **AND** `useButton` SHALL manage `aria-disabled` for non-native elements
  (e.g., `as="a"`)
- **AND** the component SHALL NOT manually set `aria-disabled` or
  `data-disabled`

## MODIFIED Requirements

### Requirement: Disabled State

The component SHALL support disabled state.

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

### Requirement: Click Handling

The component SHALL handle press interactions.

#### Scenario: Press event

- **WHEN** user presses button (mouse, touch, or keyboard)
- **THEN** SHALL call `onPress` handler if provided
- **AND** SHALL prevent multiple rapid presses during loading
- **AND** SHALL work with form submission when `type="submit"`

#### Scenario: Legacy click event

- **WHEN** consumer provides `onClick` handler (deprecated)
- **THEN** SHALL call `onClick` handler on click
- **AND** handler SHALL fire exactly once per interaction
- **AND** SHALL NOT double-fire due to internal handler chaining

### Requirement: Keyboard Interaction

The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Enter and Space keys

- **WHEN** button is focused and user presses Enter or Space
- **THEN** SHALL trigger `onPress` handler
- **AND** SHALL provide visual feedback via `data-pressed` attribute
- **AND** SHALL follow React Aria keyboard patterns
