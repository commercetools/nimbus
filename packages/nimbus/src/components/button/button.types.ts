import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type ButtonRecipeProps = {
  /**
   * Size variant of the button
   * @default "md"
   */
  size?: RecipeProps<"button">["size"];
  /**
   * Visual style variant of the button
   * @default "subtle"
   */
  variant?: RecipeProps<"button">["variant"];
  /**
   * Color palette for the button, mimics Chakra's tone property
   */
  colorPalette?: "primary" | "critical" | "neutral" | "info" | undefined;
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ButtonRootSlotProps = Omit<
  HTMLChakraProps<"button", ButtonRecipeProps>,
  "slot"
> & {
  slot?: string | null | undefined;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type ButtonProps = Omit<ButtonRootSlotProps, keyof RaButtonProps> &
  RaButtonProps & {
    /**
     * Data attributes for testing or custom metadata
     */
    [key: `data-${string}`]: unknown;
    /**
     * Slot name for React Aria Components composition
     */
    slot?: string | null | undefined;
    /**
     * Ref forwarding to the button element
     */
    ref?: React.Ref<HTMLButtonElement>;
  };
