import type { PopoverRootProps } from "./popover.slots"
import type { RecipeVariantProps } from "@chakra-ui/react"
import { popoverRecipe } from "./popover.recipe"

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type PopoverVariantProps = PopoverRootProps & RecipeVariantProps<typeof popoverRecipe>;

/**
 * Main props interface for the Popover component.
 * Extends PopoverVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface PopoverProps extends PopoverVariantProps {
  children?: React.ReactNode;
}
