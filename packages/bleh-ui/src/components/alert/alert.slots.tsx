import {
  type HTMLChakraProps,
  IconButton,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";

import { alertRecipe } from "./alert.recipe";
import type { IconButtonProps } from "../icon-button";
import { Text, type TextProps } from "../text";

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

// Make the title slot a Text component
export type AlertTitleProps = TextProps;

export const AlertTitle = withContext<typeof Text, AlertTitleProps>(
  Text,
  "title"
);

// Make the description slot a Text component
export type AlertDescriptionProps = TextProps;

export const AlertDescription = withContext<typeof Text, AlertDescriptionProps>(
  Text,
  "description"
);

export type AlertIconProps = HTMLChakraProps<"div", AlertRecipeProps>;

export const AlertIcon = withContext<HTMLDivElement, AlertIconProps>(
  "div",
  "icon"
);

export type AlertActionsProps = HTMLChakraProps<"div", AlertRecipeProps>;

export const AlertActions = withContext<HTMLDivElement, AlertActionsProps>(
  "div",
  "actions"
);

// aria-label is defined internally
export type AlertDismissButtonProps = Omit<IconButtonProps, "aria-label">;

// This is a div wrapper for layout placement - note that we expect it to receive `IconButton` props, but we use a `div`.
// We then forward the consumer props to the interior `IconButton` component.
export const AlertDismissButton = withContext<
  typeof IconButton,
  AlertDismissButtonProps
>("div", "dismissButton");
