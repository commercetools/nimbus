# Specification: Button Component

## Purpose

The Button component provides an accessible, styled button element that follows
nimbus-core standards. It supports multiple visual variants, sizes, colors, and
interactive states while maintaining WCAG 2.1 AA accessibility compliance.

**Component:** `Button` **Package:** `@commercetools/nimbus` **Type:**
Single-slot component **React Aria:** Uses `Button` from react-aria-components
## Requirements
### Requirement: Button Variants

The component SHALL support multiple visual variants.

#### Scenario: Solid variant

- **WHEN** variant="solid" is set (default)
- **THEN** SHALL render with solid background color
- **AND** SHALL use primary brand color by default
- **AND** SHALL provide high contrast with white text

#### Scenario: Outline variant

- **WHEN** variant="outline" is set
- **THEN** SHALL render with transparent background and border
- **AND** SHALL use semantic color for border and text
- **AND** SHALL show solid background on hover

#### Scenario: Ghost variant

- **WHEN** variant="ghost" is set
- **THEN** SHALL render with transparent background and no border
- **AND** SHALL show subtle background on hover
- **AND** SHALL maintain text color visibility

#### Scenario: Link variant

- **WHEN** variant="link" is set
- **THEN** SHALL render as text with underline
- **AND** SHALL behave like a button (not anchor)
- **AND** SHALL support all button interactions

### Requirement: Button Sizes

The component SHALL support three size options.

#### Scenario: Small size

- **WHEN** size="sm" is set
- **THEN** SHALL render with compact padding and smaller font
- **AND** SHALL maintain minimum 44x44px touch target with padding/margin

#### Scenario: Medium size

- **WHEN** size="md" is set (default)
- **THEN** SHALL render with standard padding and font size
- **AND** SHALL provide comfortable touch and click target

#### Scenario: Large size

- **WHEN** size="lg" is set
- **THEN** SHALL render with generous padding and larger font
- **AND** SHALL be suitable for primary actions and hero sections

### Requirement: Semantic Colors

The component SHALL support semantic color palettes.

#### Scenario: Color variants

- **WHEN** colorPalette prop is set
- **THEN** SHALL accept: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply appropriate semantic colors from design tokens
- **AND** SHALL maintain WCAG AA contrast ratios
- **AND** SHALL support light and dark modes

### Requirement: Loading State

The component SHALL support loading state with spinner.

#### Scenario: Loading indication

- **WHEN** loading={true} is set
- **THEN** SHALL display LoadingSpinner component
- **AND** SHALL disable button interactions
- **AND** SHALL maintain button dimensions (no layout shift)
- **AND** loadingText prop SHALL replace button text when provided

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

### Requirement: Icon Integration

The component SHALL support icons from @commercetools/nimbus-icons.

#### Scenario: Left icon

- **WHEN** leftIcon prop is provided
- **THEN** SHALL render icon before button text
- **AND** SHALL apply appropriate spacing between icon and text

#### Scenario: Right icon

- **WHEN** rightIcon prop is provided
- **THEN** SHALL render icon after button text
- **AND** SHALL apply appropriate spacing between text and icon

#### Scenario: Icon-only button

- **WHEN** children is empty and icon is provided
- **THEN** SHALL render as icon-only button
- **AND** SHALL require aria-label for accessibility
- **AND** SHOULD use IconButton component instead for better semantics

### Requirement: Polymorphic Rendering

The component SHALL support rendering as different HTML elements.

#### Scenario: Custom element

- **WHEN** as prop is provided
- **THEN** SHALL render as specified element (e.g., as="a" for link)
- **AND** SHALL maintain button styling
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve button interactions

### Requirement: Form Button Types

The component SHALL support form-related button types.

#### Scenario: Submit button

- **WHEN** type="submit" is set
- **THEN** SHALL submit parent form on click
- **AND** SHALL trigger form validation

#### Scenario: Reset button

- **WHEN** type="reset" is set
- **THEN** SHALL reset parent form on click

#### Scenario: Button type (default)

- **WHEN** type="button" is set or no type specified
- **THEN** SHALL NOT submit form
- **AND** SHALL only trigger onClick handler

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

### Requirement: Recipe-Based Styling

The component SHALL use Chakra UI recipe per nimbus-core standards.

#### Scenario: Recipe application

- **WHEN** component renders
- **THEN** SHALL apply button recipe from theme/recipes/button.ts
- **AND** recipe SHALL be registered in theme configuration
- **AND** SHALL support recipe props: variant, size, colorPalette

#### Scenario: React Aria prop filtering

- **WHEN** component receives React Aria-specific event props from ButtonContext
  slots
- **THEN** SHALL filter out all React Aria custom event handlers before
  forwarding to DOM
- **AND** SHALL prevent `onPress`, `onPressStart`, `onPressEnd`,
  `onPressChange`, `onPressUp` from reaching DOM
- **AND** SHALL prevent `onFocusChange` from reaching DOM
- **AND** SHALL prevent `onHoverStart`, `onHoverEnd`, `onHoverChange` from
  reaching DOM
- **AND** SHALL prevent `onMoveStart`, `onMove`, `onMoveEnd` from reaching DOM
- **AND** SHALL NOT emit "Unknown event handler property" warnings in React
- **AND** SHALL allow standard DOM events (onClick, onFocus, onBlur, etc.) to
  pass through

### Requirement: Custom Styling

The component SHALL accept Chakra style props.

#### Scenario: Style prop override

- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props (padding, margin, width, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults

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

