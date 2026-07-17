## Why

ToggleButtonGroup currently has no `variant` prop — its visual style is hardcoded to outline (unselected) / solid (selected). This limits the component to a single visual treatment, while the standalone ToggleButton already supports `outline` and `ghost` variants, and the Button recipe offers `solid`, `subtle`, `outline`, `ghost`, and `link`. Adding visual variants to ToggleButtonGroup enables more design flexibility: ghost groups for toolbars, subtle groups for secondary controls, and a segmented control look for tab-like navigation patterns.

## What Changes

- Add a `variant` prop to `ToggleButtonGroup.Root` with the following options:
  - **`outline`** (default) — Current behavior: outline border when unselected, solid fill when selected
  - **`ghost`** — No border/background when unselected, subtle fill when selected
  - **`solid`** — Solid fill always, stronger/contrasting fill when selected
  - **`subtle`** — Light tinted background when unselected, stronger tint when selected
  - **`segmented`** — Connected buttons with a shared background track; selected button is elevated/highlighted (pill-in-track pattern)
- Each variant defines both unselected and selected visual states
- The `variant` prop applies to the button slot, not the root slot (consistent with how the group delegates visual styling to child buttons)

## Capabilities

### New Capabilities

- `toggle-button-group-visual-variants`: Add `variant` prop to ToggleButtonGroup with `outline`, `ghost`, `solid`, `subtle`, and `segmented` visual styles

### Modified Capabilities

- `nimbus-toggle-button-group`: Adding `variant` prop to the public API and updating the recipe to support multiple visual styles

## Impact

- **Types**: New `variant` prop added to `ToggleButtonGroupProps` with union of variant names
- **Recipe**: `toggle-button-group.recipe.tsx` gains a `variant` dimension with styles for each option, replacing the hardcoded outline/solid approach
- **Stories**: New stories demonstrating each variant in both unselected and selected states
- **No breaking changes**: Default variant is `outline`, which preserves the current behavior
