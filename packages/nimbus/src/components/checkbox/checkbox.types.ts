import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
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
  size?: SlotRecipeProps<"nimbusCheckbox">["size"];
} & UnstyledProp;

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

export type CheckboxProps = OmitInternalProps<CheckboxRootSlotProps> & {
  /**
   * Ref forwarding to the label element
   */
  ref?: Ref<HTMLLabelElement>;
  /**
   * The label content to display next to the checkbox
   */
  children?: ReactNode;
};
