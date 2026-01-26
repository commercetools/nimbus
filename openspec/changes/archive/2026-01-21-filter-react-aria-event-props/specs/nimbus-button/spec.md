## MODIFIED Requirements

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
