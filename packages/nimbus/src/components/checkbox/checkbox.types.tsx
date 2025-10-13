import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { ReactNode, Ref } from "react";
import type { CheckboxProps as RaCheckboxProps } from "react-aria-components";

type CheckboxRecipeProps = {
  size?: SlotRecipeProps<"checkbox">["size"];
};

export type CheckboxRootProps = Omit<
  HTMLChakraProps<"label", CheckboxRecipeProps>,
  keyof RaCheckboxProps
> &
  RaCheckboxProps;

export type CheckboxLabelProps = HTMLChakraProps<"span">;

export type CheckboxIndicatorProps = HTMLChakraProps<"span">;

/**
 * Main props interface for the Checkbox component.
 * Extends CheckboxRootProps (which includes SlotRecipeProps and RaCheckboxProps),
 * while adding support for React children and ref forwarding.
 */
export type CheckboxProps = CheckboxRootProps & {
  ref?: Ref<HTMLLabelElement>;
  children?: ReactNode;
};
