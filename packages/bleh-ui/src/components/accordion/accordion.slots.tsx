import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { type DisclosureProps as RADisclosurePropsProps } from "react-aria-components";

import { accordionRecipe } from "./accordion.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface AccordionRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type AccordionRootProps = HTMLChakraProps<"div", AccordionRecipeProps>;

const { withContext } = createRecipeContext({ recipe: accordionRecipe });

/**
 * Root component that provides the styling context for the Accordion component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const AccordionRoot = withContext<
  HTMLDivElement,
  AccordionRootProps & RADisclosurePropsProps
>("div");
