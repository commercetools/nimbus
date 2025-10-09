import type { ReactNode, Ref } from "react";
import type { CheckboxRootProps } from "./checkbox.slots";
import type { CheckboxProps as RaCheckboxProps } from "react-aria-components";

type CheckboxRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "md";
};

/**
 * Main props interface for the Checkbox component.
 * Extends CheckboxRecipeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */

export type CheckboxProps = CheckboxRecipeVariantProps &
  CheckboxRootProps &
  RaCheckboxProps & {
    ref?: Ref<RaCheckboxProps>;
    children?: ReactNode;
  };
