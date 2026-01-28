import type {
  HTMLChakraProps,
  RecipeProps,
  ConditionalValue,
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
import type {
  ToggleButtonGroupSize,
  ToggleButtonGroupColorPalette,
} from "./toggle-button-group.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonGroupRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: ConditionalValue<ToggleButtonGroupSize | undefined>;
  /**
   * Color palette for the button group
   */
  colorPalette?: ConditionalValue<ToggleButtonGroupColorPalette | undefined>;
};

// ============================================================
// SLOT PROPS
// ============================================================

type ToggleButtonGroupRootSlotProps = Omit<
  HTMLChakraProps<"div", RecipeProps<"div">>,
  "colorPalette"
>;

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
