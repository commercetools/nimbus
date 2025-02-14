import type { CheckboxRootProps } from "./checkbox.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { checkboxSlotRecipe } from "./checkbox.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type CheckboxVariantProps = CheckboxRootProps &
  RecipeVariantProps<typeof checkboxSlotRecipe>;

/**
 * Main props interface for the Checkbox component.
 * Extends CheckboxVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface CheckboxProps extends CheckboxVariantProps {
  children?: React.ReactNode;
  /** neither checked, nor unchecked */
  isIndeterminate?: boolean;
}
