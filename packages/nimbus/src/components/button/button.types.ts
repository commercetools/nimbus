import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  ConditionalValue,
  UnstyledProp,
} from "@chakra-ui/react";
import type { SemanticPalettesOnly } from "@/type-utils";
import type { ButtonSize, ButtonVariant } from "./button.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type ButtonRecipeProps = {
  /**
   * Size variant of the button
   * @default "md"
   */
  size?: ConditionalValue<ButtonSize>;
  /**
   * Visual style variant of the button
   * @default "subtle"
   */
  variant?: ConditionalValue<ButtonVariant>;
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ButtonRootSlotProps = Omit<
  HTMLChakraProps<"button", ButtonRecipeProps>,
  "slot" | "colorPalette"
> & {
  slot?: string | null | undefined;
  /**
   * Color palette for the button
   */
  colorPalette?: SemanticPalettesOnly;
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
