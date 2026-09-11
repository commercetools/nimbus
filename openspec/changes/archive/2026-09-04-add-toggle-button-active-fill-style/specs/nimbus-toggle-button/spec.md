## MODIFIED Requirements

### Requirement: Selected State Visual Differentiation
The component SHALL provide clear visual differentiation between selected and unselected states. The resting (unselected) chrome is always neutral; the selected fill is drawn from `colorPalette` at a weight set by `activeFillStyle`.

#### Scenario: Unselected state rendering
- **WHEN** isSelected={false} or not selected
- **THEN** SHALL render with unselected visual styling
- **AND** SHALL set data-selected="false" on button element
- **AND** SHALL NOT set aria-pressed="true"
- **AND** SHALL use the neutral resting chrome for the active variant (colorPalette does not affect the resting state)

#### Scenario: Selected state rendering
- **WHEN** isSelected={true} is set
- **THEN** SHALL render with selected visual styling
- **AND** SHALL set data-selected="true" on button element
- **AND** SHALL set aria-pressed="true"
- **AND** SHALL apply the active fill from colorPalette at the weight set by activeFillStyle (see the Active Fill Style requirement)
- **AND** SHALL maintain border visibility in the outline variant

#### Scenario: State transition animation
- **WHEN** state changes from selected to unselected or vice versa
- **THEN** SHALL provide smooth visual transition
- **AND** SHALL use design token animation durations
- **AND** SHALL maintain button dimensions (no layout shift)

### Requirement: Visual Variants
The component SHALL support visual style variants for different UI contexts. Every variant styles only the resting (unselected) chrome, which is always neutral; the selected fill is controlled by activeFillStyle and colorPalette.

#### Scenario: Outline variant (default)
- **WHEN** variant="outline" is set or no variant specified
- **THEN** SHALL render with a transparent background and a neutral border
- **AND** SHALL use border-color neutral.7 and text color neutral.11
- **AND** WHEN unselected and hovered SHALL show background neutral.3 and border neutral.8

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL render with a transparent background and no border
- **AND** SHALL use text color neutral.11
- **AND** WHEN unselected and hovered SHALL show background neutral.3

#### Scenario: Subtle variant
- **WHEN** variant="subtle" is set
- **THEN** SHALL render with a filled neutral background (neutral.3) and text color neutral.11
- **AND** WHEN unselected and hovered SHALL show background neutral.4

### Requirement: Semantic Color Palettes
The component SHALL support semantic color palettes applied to the active (selected) state.

#### Scenario: Color palette options
- **WHEN** colorPalette prop is set
- **THEN** SHALL accept: primary (default), neutral, info, positive, warning, critical
- **AND** SHALL apply the palette to the selected fill (and, for the outline variant, the selected border)
- **AND** SHALL leave the resting (unselected) chrome neutral regardless of colorPalette
- **AND** SHALL maintain WCAG AA contrast ratios in all states
- **AND** SHALL support light and dark modes

#### Scenario: Selected state color application
- **WHEN** ToggleButton is in selected state
- **THEN** SHALL apply the colorPalette-based active fill (weight per activeFillStyle)
- **AND** SHALL enhance color intensity on hover
- **AND** SHALL use a text color that meets contrast against the fill
- **AND** SHALL differentiate clearly from the unselected state

## ADDED Requirements

### Requirement: Active Fill Style
The component SHALL support an `activeFillStyle` prop that sets the weight of the active (selected) fill, independent of the resting `variant`.

#### Scenario: Tint fill (default)
- **WHEN** activeFillStyle="tint" is set or no activeFillStyle is specified
- **THEN** the selected button SHALL fill with colorPalette.5 and use text color colorPalette.12
- **AND** WHEN selected and hovered SHALL deepen the fill to colorPalette.6

#### Scenario: Solid fill
- **WHEN** activeFillStyle="solid" is set
- **THEN** the selected button SHALL fill with colorPalette.9 and use contrast text
- **AND** WHEN selected and hovered SHALL deepen the fill to colorPalette.10

#### Scenario: Outline border tracks the fill
- **WHEN** variant="outline" and the button is selected
- **THEN** the selected border SHALL use colorPalette.8 with tint and colorPalette.9 with solid, deepening on hover

#### Scenario: Type and default
- **WHEN** the ToggleButton props type is defined
- **THEN** SHALL expose activeFillStyle?: RecipeProps<"nimbusToggleButton">["activeFillStyle"] with values "tint" | "solid"
- **AND** SHALL document activeFillStyle with @default "tint"
