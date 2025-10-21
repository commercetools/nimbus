import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";
import type { ToggleButtonProps as RaToggleButtonProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonRecipeProps = {
  /**
   * Size variant of the toggle button
   * @default "md"
   */
  size?: RecipeProps<"toggleButton">["size"];
  /**
   * Visual style variant of the toggle button
   * @default "outline"
   */
  variant?: RecipeProps<"toggleButton">["variant"];
  /**
   * Color palette variant of the toggle button
   * @default "primary"
   */
  colorPalette?: RecipeProps<"toggleButton">["colorPalette"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ToggleButtonRootSlotProps = HTMLChakraProps<
  "button",
  ToggleButtonRecipeProps
>;

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
