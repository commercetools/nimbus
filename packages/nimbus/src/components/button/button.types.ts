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
// NATIVE PROPS WITH REACT ARIA EQUIVALENTS
// ============================================================

/**
 * Native HTML button props that have a preferred React Aria equivalent.
 * Each prop is annotated with the recommended alternative.
 */
type NativePropsWithAriaEquivalents = {
  /**
   * Native click handler. Consider using `onPress` instead — it provides
   * unified press handling across mouse, touch, and keyboard interactions.
   * @see {@link ButtonProps.onPress}
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * Native mouse-enter handler. Consider using `onHoverStart` instead —
   * it ignores emulated mouse events on touch devices.
   * @see {@link ButtonProps.onHoverStart}
   */
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * Native mouse-leave handler. Consider using `onHoverEnd` instead —
   * it ignores emulated mouse events on touch devices.
   * @see {@link ButtonProps.onHoverEnd}
   */
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * Native HTML disabled attribute. Consider using `isDisabled` instead —
   * it additionally manages `aria-disabled` for non-native button elements.
   * @see {@link ButtonProps.isDisabled}
   */
  disabled?: boolean;

  /**
   * ARIA disabled attribute. Prefer `isDisabled` instead — React Aria
   * manages `aria-disabled` automatically based on `isDisabled`.
   * @see {@link ButtonProps.isDisabled}
   */
  "aria-disabled"?: boolean | "true" | "false";

  /**
   * Native tab-index attribute. Consider using `excludeFromTabOrder` instead —
   * it provides a semantic boolean to remove the button from the tab order.
   * @see {@link ButtonProps.excludeFromTabOrder}
   */
  tabIndex?: number;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type ButtonProps = Omit<
  ButtonRootSlotProps,
  keyof RaButtonProps | keyof NativePropsWithAriaEquivalents
> &
  RaButtonProps &
  NativePropsWithAriaEquivalents & {
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
