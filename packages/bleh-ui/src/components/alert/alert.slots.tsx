import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";

import { alertRecipe } from "./alert.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface AlertRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type AlertRootProps = HTMLChakraProps<"div", AlertRecipeProps>;

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: alertRecipe,
});

/**
 * Root component that provides the styling context for the Alert component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const AlertRoot = withProvider<HTMLDivElement, AlertRootProps>(
  "div",
  "root"
);

export const AlertTitle = withContext<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "title"
);

export const AlertDescription = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "description");

export const AlertIcon = withContext<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "icon"
);

export const AlertActions = withContext<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "actions"
);

export const AlertDismiss = withContext<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "dismiss"
);
