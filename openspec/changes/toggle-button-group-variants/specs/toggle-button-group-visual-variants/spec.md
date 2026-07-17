## ADDED Requirements

### Requirement: ToggleButtonGroup supports variant prop

The ToggleButtonGroup component SHALL accept an optional `variant` prop on its Root with the following values: `"outline"`, `"ghost"`, `"solid"`, `"subtle"`, `"segmented"`. The default value SHALL be `"outline"`.

#### Scenario: Default variant matches current behavior

- **WHEN** a ToggleButtonGroup is rendered without a `variant` prop
- **THEN** buttons SHALL display with outline border when unselected and solid fill when selected
- **AND** the visual output SHALL be identical to the current hardcoded behavior

### Requirement: Outline variant styling

The `outline` variant SHALL render buttons with a visible border and no background fill when unselected. When selected, buttons SHALL display a solid colored background with contrast text. Buttons SHALL be joined with shared borders, no gap, and border radius on first/last buttons only.

#### Scenario: Outline variant unselected state

- **WHEN** a ToggleButtonGroup is rendered with `variant="outline"` and no buttons are selected
- **THEN** all buttons SHALL have a visible border, transparent background, and colored text

#### Scenario: Outline variant selected state

- **WHEN** a button in an outline ToggleButtonGroup is selected
- **THEN** that button SHALL have a solid fill background with contrast text

### Requirement: Ghost variant styling

The `ghost` variant SHALL render buttons with no border and no background when unselected. When selected, buttons SHALL display a subtle tinted background. Buttons SHALL have individual border radius and a small gap between them.

#### Scenario: Ghost variant unselected state

- **WHEN** a ToggleButtonGroup is rendered with `variant="ghost"` and no buttons are selected
- **THEN** all buttons SHALL have no visible border, transparent background, and neutral text

#### Scenario: Ghost variant selected state

- **WHEN** a button in a ghost ToggleButtonGroup is selected
- **THEN** that button SHALL have a tinted background and colored text

### Requirement: Solid variant styling

The `solid` variant SHALL render buttons with a solid background fill in both unselected and selected states. The selected button SHALL use a stronger/darker shade to distinguish it. Buttons SHALL be joined with shared borders and border radius on first/last buttons only.

#### Scenario: Solid variant unselected state

- **WHEN** a ToggleButtonGroup is rendered with `variant="solid"` and no buttons are selected
- **THEN** all buttons SHALL have a subtle colored background fill

#### Scenario: Solid variant selected state

- **WHEN** a button in a solid ToggleButtonGroup is selected
- **THEN** that button SHALL have a stronger/more saturated background to visually distinguish it from unselected siblings

### Requirement: Subtle variant styling

The `subtle` variant SHALL render buttons with a light tinted background when unselected. When selected, buttons SHALL display a stronger tint. Buttons SHALL have individual border radius and a small gap between them.

#### Scenario: Subtle variant unselected state

- **WHEN** a ToggleButtonGroup is rendered with `variant="subtle"` and no buttons are selected
- **THEN** all buttons SHALL have a light tinted background

#### Scenario: Subtle variant selected state

- **WHEN** a button in a subtle ToggleButtonGroup is selected
- **THEN** that button SHALL have a stronger tinted background to distinguish it from unselected buttons

### Requirement: Segmented variant styling

The `segmented` variant SHALL render a connected group of buttons inside a visible background track on the root element. The selected button SHALL appear elevated above the track with a contrasting background and subtle shadow. Buttons SHALL have no individual borders.

#### Scenario: Segmented variant track rendering

- **WHEN** a ToggleButtonGroup is rendered with `variant="segmented"`
- **THEN** the root element SHALL display a visible background track (rounded container)
- **AND** unselected buttons SHALL appear flush against the track with transparent background

#### Scenario: Segmented variant selected state

- **WHEN** a button in a segmented ToggleButtonGroup is selected
- **THEN** that button SHALL have an elevated appearance with a contrasting background and subtle shadow

### Requirement: All variants support colorPalette

All variants SHALL respond to the `colorPalette` prop. Colors used for fills, borders, and text SHALL derive from the active color palette's semantic scale.

#### Scenario: Color palette applied to variant

- **WHEN** a ToggleButtonGroup is rendered with `variant="ghost"` and `colorPalette="critical"`
- **THEN** the selected button's tinted background and text color SHALL use the critical palette colors

### Requirement: All variants support size prop

All variants SHALL render correctly at both `"xs"` and `"md"` sizes. The variant styling SHALL not conflict with or override size-related dimensions.

#### Scenario: Size applied to variant

- **WHEN** a ToggleButtonGroup is rendered with `variant="segmented"` and `size="xs"`
- **THEN** buttons SHALL use xs dimensions
- **AND** the segmented track SHALL visually contain the smaller buttons correctly
