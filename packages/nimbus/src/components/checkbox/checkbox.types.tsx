import type { ReactNode, Ref } from "react";
import type { CheckboxRootProps } from "./checkbox.slots";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import { checkboxSlotRecipe } from "./checkbox.recipe";
import type { CheckboxProps as RaCheckboxProps } from "react-aria-components";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type CheckboxVariantProps = CheckboxRootProps &
  RecipeVariantProps<typeof checkboxSlotRecipe> &
  RaCheckboxProps;

/**
 * Main props interface for the Checkbox component.
 * Extends CheckboxVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface CheckboxProps extends Omit<CheckboxVariantProps, "children"> {
  ref?: Ref<RaCheckboxProps>;
  children?: ReactNode;
}
