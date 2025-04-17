import { createSlotRecipeContext } from "@chakra-ui/react";
import { alertRecipe } from "./alert.recipe";
import type {
  AlertActionsProps,
  AlertDescriptionProps,
  AlertDismissButtonProps,
  AlertIconProps,
  AlertRootProps,
  AlertTitleProps,
} from "./alert.types";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: alertRecipe,
});

export const AlertRoot = withProvider<HTMLDivElement, AlertRootProps>(
  "div",
  "root"
);

export const AlertTitle = withContext<HTMLDivElement, AlertTitleProps>(
  "div",
  "title"
);

export const AlertDescription = withContext<
  HTMLDivElement,
  AlertDescriptionProps
>("div", "description");

export const AlertIcon = withContext<HTMLDivElement, AlertIconProps>(
  "div",
  "icon"
);

export const AlertActions = withContext<HTMLDivElement, AlertActionsProps>(
  "div",
  "actions"
);

// This is a div wrapper for layout placement - note that we expect it to receive `IconButton` props, but we use a `div`.
// We then forward the consumer props to the interior `IconButton` component.
export const AlertDismissButton = withContext<
  HTMLDivElement,
  AlertDismissButtonProps
>("div", "dismissButton");
