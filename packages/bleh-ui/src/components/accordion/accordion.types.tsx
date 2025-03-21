import type { AccordionRootProps } from "./accordion.slots"
import type { RecipeVariantProps } from "@chakra-ui/react"
import { accordionRecipe } from "./accordion.recipe"

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type AccordionVariantProps = AccordionRootProps & RecipeVariantProps<typeof accordionRecipe>;

/**
 * Main props interface for the Accordion component.
 * Extends AccordionVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface AccordionProps extends AccordionVariantProps {
  children?: React.ReactNode;
}
