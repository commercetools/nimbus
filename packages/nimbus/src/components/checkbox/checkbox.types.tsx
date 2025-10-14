import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { ReactNode, Ref } from "react";
import type { CheckboxProps as RaCheckboxProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type CheckboxRecipeProps = {
  /**
   * Size variant of the checkbox
   * @default "md"
   */
  size?: SlotRecipeProps<"checkbox">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type CheckboxRootSlotProps = Omit<
  HTMLChakraProps<"label", CheckboxRecipeProps>,
  keyof RaCheckboxProps
> &
  RaCheckboxProps;

export type CheckboxLabelSlotProps = HTMLChakraProps<"span">;

export type CheckboxIndicatorSlotProps = HTMLChakraProps<"span">;

// ============================================================
// MAIN PROPS
// ============================================================

export type CheckboxProps = CheckboxRootSlotProps & {
  /**
   * Ref forwarding to the label element
   */
  ref?: Ref<HTMLLabelElement>;
  /**
   * The label content to display next to the checkbox
   */
  children?: ReactNode;
};
