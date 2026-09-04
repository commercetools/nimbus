import type {
  HTMLChakraProps,
  RecipeProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { AriaToggleButtonGroupProps } from "react-aria";
import { ToggleButtonGroup as RaToggleButtonGroup } from "react-aria-components";
import type { SemanticPalettesOnly } from "@/type-utils";
import type { ToggleButtonProps } from "../toggle-button/toggle-button.types";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonGroupRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusToggleButtonGroup">["size"];
  /**
   * Resting chrome of the toggle buttons — always neutral. `colorPalette` is
   * reserved for the active state.
   * @default "outline"
   */
  variant?: SlotRecipeProps<"nimbusToggleButtonGroup">["variant"];
  /**
   * Weight of the active (selected) fill: `tint` (light accent wash) or `solid`
   * (full accent fill). Defaults from `selectionMode` — `single` → `solid`,
   * `multiple` → `tint` — and is overridable.
   */
  activeFillStyle?: SlotRecipeProps<"nimbusToggleButtonGroup">["activeFillStyle"];
};

// ============================================================
// SLOT PROPS
// ============================================================

type ToggleButtonGroupRootSlotProps = Omit<
  HTMLChakraProps<"div", RecipeProps<"div">>,
  "colorPalette"
> & {
  /**
   * Color palette for the button group
   */
  colorPalette?: SemanticPalettesOnly;
};

// ============================================================
// HELPER TYPES
// ============================================================

type ToggleButtonGroupRootCombinedProps = ToggleButtonGroupRootSlotProps &
  AriaToggleButtonGroupProps;

// ============================================================
// MAIN PROPS
// ============================================================

export type ToggleButtonGroupProps = ToggleButtonGroupRecipeVariantProps &
  Omit<ToggleButtonGroupRootCombinedProps, "size"> & {
    ref?: React.Ref<typeof RaToggleButtonGroup>;
  };

/**
 * Type signature for the main ToggleButtonGroup component.
 */
export type ToggleButtonGroupRootComponent = React.FC<ToggleButtonGroupProps>;

/**
 * A `ToggleButtonGroup.Button` is the regular `ToggleButton`, exposed under the
 * compound name. It inherits the group's `variant` / `activeFillStyle` / `size` /
 * `colorPalette` via context, and any prop set here overrides that.
 */
export type ToggleButtonGroupButtonProps = ToggleButtonProps;

/**
 * Type signature for the ToggleButtonGroup.Button sub-component.
 */
export type ToggleButtonGroupButtonComponent =
  React.FC<ToggleButtonGroupButtonProps>;
