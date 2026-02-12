import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { SemanticPalettesOnly } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type ButtonRecipeProps = {
  /**
   * Size variant of the button
   * @default "md"
   */
  size?: RecipeProps<"nimbusButton">["size"];
  /**
   * Visual style variant of the button
   * @default "subtle"
   */
  variant?: RecipeProps<"nimbusButton">["variant"];
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
    /**
     * Standard HTML disabled attribute. Maps to `isDisabled` internally.
     * If both `disabled` and `isDisabled` are set, `isDisabled` takes precedence.
     */
    disabled?: boolean;
  };
