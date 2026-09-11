## MODIFIED Requirements

### Requirement: Pressed State

The component SHALL expose press state as a data attribute and provide tactile press feedback.

#### Scenario: Data-pressed attribute

- **WHEN** user presses and holds the button (mouse, touch, or keyboard)
- **THEN** SHALL set `data-pressed` attribute on the root element
- **AND** SHALL remove `data-pressed` when the press ends
- **AND** press state SHALL be derived from `useButton`'s `isPressed`
- **AND** SHALL be available for CSS-based styling via `[data-pressed]` selector

#### Scenario: Tactile press feedback

- **WHEN** the button is pressed
- **THEN** SHALL nudge the button down by `translateY(1px)` (translate only, no scaling, so text and icons stay crisp and layout does not reflow)
- **AND** the `subtle`, `outline`, and `ghost` variants SHALL deepen their fill to `colorPalette.5` and text to `colorPalette.12` while pressed
- **AND** the pressed feedback SHALL fire for pointer, keyboard, and touch alike
