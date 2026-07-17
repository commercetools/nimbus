## Context

ToggleButtonGroup uses a slot recipe with two slots (`root`, `button`). The button slot currently hardcodes the outline variant from `buttonRecipe` as the base unselected style, and the solid variant from `buttonRecipe` as the `[data-selected=true]` style. There is no `variant` dimension in the recipe's `variants` config.

The standalone ToggleButton has its own recipe with `outline` and `ghost` variants, each defining unselected, hovered, selected, and selected+hovered states using CSS custom properties (`--button-bg`, `--button-text`, `--border-width`, `--border-color`).

The Button recipe defines `solid`, `subtle`, `outline`, `ghost`, and `link` variants using Chakra semantic tokens.

## Goals / Non-Goals

**Goals:**

- Add a `variant` prop to ToggleButtonGroup with five visual options: `outline`, `ghost`, `solid`, `subtle`, `segmented`
- Each variant defines both unselected and selected visual states for the button slot
- Default to `outline` to preserve backward compatibility
- Maintain the existing joined-button layout (shared borders, first/last radius) for all variants except `segmented`

**Non-Goals:**

- Not changing the standalone ToggleButton's variants
- Not adding the `link` variant (doesn't make sense for grouped toggles)
- Not changing the `size` or `colorPalette` variant dimensions
- Not adding animation/transition for the segmented variant's selected indicator (keep it CSS-only)

## Decisions

### 1. Use CSS custom properties for variant styling (like standalone ToggleButton)

Each variant defines `--button-bg`, `--button-text`, `--border-width`, and `--border-color` CSS variables. This approach is already used by the standalone ToggleButton and provides clean state separation.

**Alternative considered:** Spreading `buttonRecipe.variants.variant.*` directly (the current approach for outline/solid). Rejected because it doesn't support the selected/unselected state distinction cleanly and couples to the Button recipe's exact structure.

### 2. Segmented variant uses a background track on root

The `segmented` variant adds a visible background to the root slot (acting as the "track") and uses elevation/contrast on the selected button. Buttons have no borders; the selected button gets a subtle shadow and background lift. This follows the iOS/Material segmented control pattern.

**Alternative considered:** Using a sliding indicator element. Rejected — would require JavaScript to track position and width, violating the CSS-only constraint.

### 3. Variant styles defined directly in the recipe, not delegated to buttonRecipe

While the base slot still inherits `buttonRecipe.base` for layout fundamentals (flex, alignment, cursor, focus ring), variant-specific colors and borders are defined inline in the toggle button group recipe. This avoids coupling to Button's visual details for toggle-specific states.

### 4. Joined-button layout varies by variant

- `outline`: Shared borders, no gap, first/last radius (current behavior)
- `ghost`: No borders, small gap between buttons, individual border radius
- `solid`: Shared borders, no gap, first/last radius (like outline but filled)
- `subtle`: No borders, small gap between buttons, individual border radius
- `segmented`: No borders, no gap, buttons inside a rounded track, individual radius suppressed

### 5. Default variant is `outline`

Preserves backward compatibility — existing usage without a `variant` prop renders identically.

## Risks / Trade-offs

- **[Segmented variant complexity]** → The segmented look requires styling both the root (track background) and button (selected elevation) slots, which is more complex than other variants. Mitigated by keeping it CSS-only with no JS state tracking.
- **[Recipe size growth]** → Five variants with unselected/hovered/selected/selected+hovered states each adds significant recipe code. Acceptable tradeoff for the flexibility gained.
- **[No breaking changes]** → Default variant is `outline`, preserving current behavior. All additions are opt-in.
