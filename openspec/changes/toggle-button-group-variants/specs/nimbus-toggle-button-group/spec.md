## MODIFIED Requirements

### Requirement: ToggleButtonGroup recipe variants

The ToggleButtonGroup slot recipe SHALL include a `variant` dimension in its `variants` config, replacing the hardcoded outline/solid button styling in the base config. The `variant` dimension SHALL support `"outline"`, `"ghost"`, `"solid"`, `"subtle"`, and `"segmented"` options. The `defaultVariants` SHALL include `variant: "outline"`.

#### Scenario: Recipe registers variant dimension

- **WHEN** the ToggleButtonGroup recipe is evaluated
- **THEN** `variants.variant` SHALL contain entries for `outline`, `ghost`, `solid`, `subtle`, and `segmented`
- **AND** `defaultVariants.variant` SHALL be `"outline"`

### Requirement: ToggleButtonGroup props include variant

The `ToggleButtonGroupProps` type SHALL include an optional `variant` prop typed to the recipe's variant options. The prop SHALL have JSDoc documentation.

#### Scenario: Variant prop is typed correctly

- **WHEN** a consumer uses the `variant` prop on `ToggleButtonGroup.Root`
- **THEN** TypeScript SHALL provide autocompletion for `"outline"`, `"ghost"`, `"solid"`, `"subtle"`, `"segmented"`
