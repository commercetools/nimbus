import type {
  HTMLChakraProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";
import type {
  AriaToggleButtonGroupProps,
  AriaToggleButtonProps,
} from "react-aria";
import {
  ToggleButton as RaToggleButton,
  ToggleButtonGroup as RaToggleButtonGroup,
} from "react-aria-components";
import type { SemanticPalettesOnly } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonGroupRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "xs" | "md";
  colorPalette?: Exclude<SemanticPalettesOnly, "positive" | "warning">;
};

// ============================================================
// SLOT PROPS
// ============================================================

type ToggleButtonGroupRootSlotProps = Omit<
  HTMLChakraProps<"div", RecipeProps<"div">>,
  "colorPalette"
> & {
  colorPalette?: Exclude<SemanticPalettesOnly, "info" | "positive" | "warning">;
};

type ToggleButtonGroupButtonSlotProps = HTMLChakraProps<
  "button",
  RecipeProps<"button">
>;

// ============================================================
// HELPER TYPES
// ============================================================

type ToggleButtonGroupRootCombinedProps = ToggleButtonGroupRootSlotProps &
  AriaToggleButtonGroupProps;

// ============================================================
// MAIN PROPS
// ============================================================

export type ToggleButtonGroupProps = ToggleButtonGroupRecipeVariantProps &
  Omit<ToggleButtonGroupRootCombinedProps, "size" | "colorPalette"> & {
    ref?: React.Ref<typeof RaToggleButtonGroup>;
  };

/**
 * Type signature for the main ToggleButtonGroup component.
 */
export type ToggleButtonGroupRootComponent = React.FC<ToggleButtonGroupProps>;

export type ToggleButtonGroupButtonProps = ToggleButtonGroupButtonSlotProps &
  AriaToggleButtonProps & {
    ref?: React.Ref<typeof RaToggleButton>;
  };

/**
 * Type signature for the ToggleButtonGroup.Button sub-component.
 */
export type ToggleButtonGroupButtonComponent =
  React.FC<ToggleButtonGroupButtonProps>;
