import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { SemanticPalettesOnly } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

// No size or variant axes — the FAB has a single fixed visual style.
type FloatingActionButtonRecipeProps = UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type FloatingActionButtonRootSlotProps = Omit<
  HTMLChakraProps<"button", FloatingActionButtonRecipeProps>,
  "slot" | "colorPalette"
> & {
  slot?: string | null | undefined;
  /**
   * Color palette for the button
   * @default "primary"
   */
  colorPalette?: SemanticPalettesOnly;
};

// ============================================================
// NATIVE PROPS WITH REACT ARIA EQUIVALENTS
// ============================================================

type NativePropsWithAriaEquivalents = {
  /**
   * @deprecated Use `onPress` instead — it provides unified press handling
   * across mouse, touch, and keyboard interactions.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * @deprecated Use `isDisabled` instead — it integrates with React Aria's
   * interaction model and suppresses press, hover, and keyboard events
   * consistently.
   */
  disabled?: boolean;

  /**
   * @deprecated Use `excludeFromTabOrder` instead — it provides a semantic
   * boolean to remove the button from the tab order.
   */
  tabIndex?: number;

  /**
   * @deprecated Use `onHoverStart` instead — it works across mouse, touch,
   * and pointer events uniformly.
   */
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * @deprecated Use `onHoverEnd` instead — it works across mouse, touch,
   * and pointer events uniformly.
   */
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * @deprecated Use `isDisabled` instead — React Aria sets `disabled` on
   * native `<button>` elements automatically.
   */
  "aria-disabled"?: boolean | "true" | "false";
};

// ============================================================
// MAIN PROPS
// ============================================================

export type FloatingActionButtonProps = Omit<
  FloatingActionButtonRootSlotProps,
  keyof RaButtonProps | keyof NativePropsWithAriaEquivalents
> &
  RaButtonProps &
  NativePropsWithAriaEquivalents & {
    /**
     * Accessible label for the button. Required since there is no visible text.
     */
    "aria-label": string;
    /**
     * Icon to display inside the button.
     */
    children: React.ReactNode;
    /**
     * Data attributes for testing or custom metadata
     */
    [key: `data-${string}`]: unknown;
    /**
     * DOM `slot` attribute forwarded directly; not wired to a React Aria context.
     */
    slot?: string | null | undefined;
    /**
     * Ref forwarding to the button element
     */
    ref?: React.Ref<HTMLButtonElement>;
  };
