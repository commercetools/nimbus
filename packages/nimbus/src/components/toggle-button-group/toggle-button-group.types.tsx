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

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonGroupRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "xs" | "md";
  /**
   * Tone variant
   */
  tone?: "primary" | "critical" | "neutral";
};

// ============================================================
// SLOT PROPS
// ============================================================

type ToggleButtonGroupRootSlotProps = HTMLChakraProps<
  "div",
  RecipeProps<"div">
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
  Omit<ToggleButtonGroupRootCombinedProps, "size" | "tone"> & {
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
