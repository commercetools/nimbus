import type { HTMLChakraProps, ConditionalValue } from "@chakra-ui/react";
import type { ToggleButtonProps as RaToggleButtonProps } from "react-aria-components";
import type { SemanticPalettesOnly } from "@/type-utils";
import type {
  ToggleButtonSize,
  ToggleButtonVariant,
} from "./toggle-button.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonRecipeProps = {
  /**
   * Size variant of the toggle button
   * @default "md"
   */
  size?: ConditionalValue<ToggleButtonSize | undefined>;
  /**
   * Visual style variant of the toggle button
   * @default "outline"
   */
  variant?: ConditionalValue<ToggleButtonVariant | undefined>;
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ToggleButtonRootSlotProps = Omit<
  HTMLChakraProps<"button", ToggleButtonRecipeProps>,
  "colorPalette"
> & {
  /**
   * Color palette for the toggle button
   */
  colorPalette?: SemanticPalettesOnly;
};

// ============================================================
// HELPER TYPES
// ============================================================

type ExcludedProps = "css" | "colorScheme" | "recipe" | "as" | "asChild";

// ============================================================
// MAIN PROPS
// ============================================================

export type ToggleButtonProps = Omit<
  ToggleButtonRootSlotProps,
  keyof RaToggleButtonProps | ExcludedProps
> &
  RaToggleButtonProps & {
    /**
     * Ref forwarding to the button element
     */
    ref?: React.Ref<HTMLButtonElement>;
  };
