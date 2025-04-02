import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";
import { alertRecipe } from "./alert.recipe";
import { Text, type TextProps } from "../text";
import type { ButtonProps } from "../button";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface AlertRecipeProps extends RecipeProps<"div">, UnstyledProp {}

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: alertRecipe,
});

export type AlertRootProps = HTMLChakraProps<"div", AlertRecipeProps>;

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
export type AlertDismissButtonProps = Omit<ButtonProps, "aria-label">;

// This is a div wrapper for layout placement - note that we expect it to receive `IconButton` props, but we use a `div`.
// We then forward the consumer props to the interior `IconButton` component.
export const AlertDismissButton = withContext<
  HTMLDivElement,
  AlertDismissButtonProps
>("div", "dismissButton");
