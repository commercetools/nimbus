import type { ComboboxRootProps } from "./combobox.slots"
import type { RecipeVariantProps } from "@chakra-ui/react"
import { comboboxRecipe } from "./combobox.recipe"

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type ComboboxVariantProps = ComboboxRootProps & RecipeVariantProps<typeof comboboxRecipe>;

/**
 * Main props interface for the Combobox component.
 * Extends ComboboxVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface ComboboxProps extends ComboboxVariantProps {
  children?: React.ReactNode;
}
