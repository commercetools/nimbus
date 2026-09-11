## MODIFIED Requirements

### Requirement: Button Group Visual Treatment
The component SHALL apply segmentation styling so the buttons read as one unified control, while each button's visual state (resting chrome and selected fill) is provided by the ToggleButton recipe.

#### Scenario: Grouped button appearance
- **WHEN** ToggleButtonGroup.Button children are rendered
- **THEN** SHALL collapse the inner borders between buttons (borderRightWidth: 0)
- **AND** SHALL apply border radius (200) only to the first and last buttons, with square middle buttons
- **AND** SHALL scope the segmentation to `& > .nimbus-toggle-button-group__button` on the root so it out-specifies the toggle button's own recipe without `!important`
- **AND** SHALL leave bare (selection-manager) toggle children un-segmented

#### Scenario: Unselected button styling
- **WHEN** a button is not selected (data-selected="false")
- **THEN** SHALL use the neutral resting chrome from the ToggleButton recipe for the active variant
- **AND** SHALL NOT tint the resting button with colorPalette

#### Scenario: Selected button styling
- **WHEN** a button is selected (data-selected="true")
- **THEN** SHALL apply the active fill from the ToggleButton recipe at the weight set by activeFillStyle
- **AND** SHALL color the shared border with the following sibling using colorPalette.8 (tint) or colorPalette.9 (solid)
- **AND** SHALL provide clear visual distinction from the unselected state

### Requirement: Semantic Color Palettes
The component SHALL support semantic color palettes that propagate to all buttons and apply to their active (selected) state.

#### Scenario: Color palette options
- **WHEN** colorPalette prop is set on Root
- **THEN** SHALL support the semantic palettes (primary default, neutral, info, positive, warning, critical)
- **AND** SHALL maintain WCAG AA contrast ratios in all states
- **AND** SHALL support light and dark modes

#### Scenario: Color palette propagation
- **WHEN** colorPalette is set on Root
- **THEN** SHALL propagate colorPalette to all buttons via ToggleButtonContext
- **AND** SHALL leave resting segments neutral, applying the palette to the selected fill (and the selected border for the outline variant)
- **AND** an individual button MAY override the inherited colorPalette

### Requirement: Multi-Slot Recipe
The component SHALL use a multi-slot recipe (root, button) per nimbus-core standards, scoped to segmentation only.

#### Scenario: Slot styling
- **WHEN** the group renders
- **THEN** SHALL apply buttonGroupRecipe (slots: root, button) from toggle-button-group.recipe.ts
- **AND** SHALL be registered in theme configuration
- **AND** the recipe SHALL define only segmentation (border collapse, corner rounding, selected-segment divider), not per-button chrome

#### Scenario: Button slot inheritance
- **WHEN** a button renders
- **THEN** its resting chrome and selected fill SHALL come from the ToggleButton recipe (variant + activeFillStyle)
- **AND** the group recipe SHALL NOT restyle the button's fill or text

### Requirement: Recipe Context Propagation
The component SHALL propagate both Chakra slot-recipe styling and the shared toggle-button configuration to its buttons.

#### Scenario: Context provider
- **WHEN** Root renders
- **THEN** SHALL create a slot recipe context via createSlotRecipeContext and wrap the React Aria ToggleButtonGroup with withProvider
- **AND** SHALL also provide a ToggleButtonContext carrying variant, activeFillStyle, size, and colorPalette to descendant ToggleButtons

#### Scenario: Context consumer
- **WHEN** Button renders
- **THEN** SHALL consume the button slot via withContext
- **AND** SHALL use the ToggleButtonContext value as a default when its own corresponding prop is undefined
- **AND** a prop set directly on a button SHALL take precedence over the context value

#### Scenario: activeFillStyle default resolution
- **WHEN** activeFillStyle is not set on Root
- **THEN** SHALL resolve it from selectionMode: "single" → "solid", "multiple" → "tint"
- **AND** SHALL pass the resolved value through both the context and the slot recipe

### Requirement: Comprehensive Type Definitions
The component SHALL provide complete TypeScript type definitions.

#### Scenario: Root props type
- **WHEN** ToggleButtonGroupProps is defined
- **THEN** SHALL combine recipe variant props with React Aria ToggleButtonGroupProps
- **AND** SHALL include size: "xs" | "md"
- **AND** SHALL include variant: SlotRecipeProps<"nimbusToggleButtonGroup">["variant"]
- **AND** SHALL include activeFillStyle: SlotRecipeProps<"nimbusToggleButtonGroup">["activeFillStyle"]
- **AND** SHALL include colorPalette: SemanticPalettesOnly
- **AND** SHALL include selectionMode, selectedKeys, defaultSelectedKeys, onSelectionChange
- **AND** SHALL include orientation and isDisabled
- **AND** SHALL support ref as React.Ref<typeof RacToggleButtonGroup>

#### Scenario: Button props type
- **WHEN** ToggleButtonGroupButtonProps is defined
- **THEN** SHALL equal ToggleButtonProps (the group button is the standard ToggleButton)
- **AND** SHALL include id (required for value tracking) and isDisabled for the individual button, both inherited from ToggleButtonProps
- **AND** SHALL support ref as React.Ref<HTMLButtonElement>
- **AND** SHALL inherit all Chakra style props plus the variant / activeFillStyle / size / colorPalette recipe props

#### Scenario: JSDoc documentation
- **WHEN** types are exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document size with @default "md" and variant with @default "outline"
- **AND** SHALL document activeFillStyle including its selectionMode-based default
- **AND** SHALL document selection modes and state management

### Requirement: React Aria ToggleButtonGroup Usage
The component SHALL use React Aria Components for accessibility and behavior.

#### Scenario: Group component usage
- **WHEN** Root renders
- **THEN** SHALL use ToggleButtonGroup from react-aria-components
- **AND** SHALL wrap it with the Chakra slot recipe provider and the ToggleButtonContext provider
- **AND** SHALL forward all React Aria props
- **AND** SHALL merge Chakra styling with React Aria functionality

#### Scenario: Button component usage
- **WHEN** Button renders
- **THEN** SHALL render the Nimbus ToggleButton (which itself wraps React Aria's ToggleButton), exposed under the ToggleButtonGroup.Button name
- **AND** SHALL apply the button slot via withContext
- **AND** SHALL forward all React Aria props
- **AND** SHALL inherit the group's variant / activeFillStyle / size / colorPalette via context, with per-button overrides

## ADDED Requirements

### Requirement: Group Variant and Active Fill Style
The Root SHALL expose variant and activeFillStyle props that configure every button in the group through ToggleButtonContext.

#### Scenario: Variant
- **WHEN** variant is set on Root ("outline" default, or "subtle")
- **THEN** SHALL set the resting chrome for all buttons via context
- **AND** the group SHALL remain segmented regardless of variant

#### Scenario: Active fill style with selectionMode default
- **WHEN** activeFillStyle is not set
- **THEN** SHALL default to "solid" for single selection and "tint" for multiple selection
- **WHEN** activeFillStyle is set explicitly
- **THEN** SHALL use that value for all buttons regardless of selectionMode

#### Scenario: Per-button override
- **WHEN** a ToggleButtonGroup.Button sets variant, activeFillStyle, size, or colorPalette
- **THEN** that button SHALL use its own value instead of the group's inherited value
