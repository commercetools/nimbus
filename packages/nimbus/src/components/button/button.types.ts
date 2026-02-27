import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
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
   * @deprecated Use `onPress` instead — it provides unified press handling
   * across mouse, touch, and keyboard interactions.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * @deprecated Use `onHoverStart` instead — it ignores emulated mouse
   * events on touch devices.
   */
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * @deprecated Use `onHoverEnd` instead — it ignores emulated mouse
   * events on touch devices.
   */
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * @deprecated Use `isDisabled` instead — it additionally manages
   * `aria-disabled` for non-native button elements.
   */
  disabled?: boolean;

  /**
   * @deprecated Use `isDisabled` instead — React Aria manages
   * `aria-disabled` automatically based on `isDisabled`.
   */
  "aria-disabled"?: boolean | "true" | "false";

  /**
   * @deprecated Use `excludeFromTabOrder` instead — it provides a semantic
   * boolean to remove the button from the tab order.
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
