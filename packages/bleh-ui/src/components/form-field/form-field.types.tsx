import type { FormFieldRootProps } from "./form-field.slots"
import type { RecipeVariantProps } from "@chakra-ui/react"
import { formFieldRecipe } from "./form-field.recipe"

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type FormFieldVariantProps = FormFieldRootProps & RecipeVariantProps<typeof formFieldRecipe>;

/**
 * Main props interface for the FormField component.
 * Extends FormFieldVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface FormFieldProps extends FormFieldVariantProps {
  children?: React.ReactNode;
}
