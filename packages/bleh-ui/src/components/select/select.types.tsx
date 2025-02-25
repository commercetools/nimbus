import type { RecipeVariantProps } from "@chakra-ui/react";
import { selectSlotRecipe } from "./select.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
//type SelectVariantProps = RecipeVariantProps<typeof selectSlotRecipe>;

/**
 * Main props interface for the Select component.
 * Extends SelectVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
//export interface SelectProps extends SelectVariantProps {}
