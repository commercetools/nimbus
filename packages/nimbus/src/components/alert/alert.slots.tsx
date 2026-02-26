import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  AlertActionsSlotProps,
  AlertDescriptionProps,
  AlertDismissButtonProps,
  AlertIconSlotProps,
  AlertRootSlotProps,
  AlertTitleProps,
} from "./alert.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusAlert",
});

export const AlertRoot = withProvider<HTMLDivElement, AlertRootSlotProps>(
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

export const AlertIcon = withContext<HTMLDivElement, AlertIconSlotProps>(
  "div",
  "icon"
);

export const AlertActions = withContext<HTMLDivElement, AlertActionsSlotProps>(
  "div",
  "actions"
);

// This is a div wrapper for layout placement - note that we expect it to receive `IconButton` props, but we use a `div`.
// We then forward the consumer props to the interior `IconButton` component.
export const AlertDismissButton = withContext<
  HTMLDivElement,
  AlertDismissButtonProps
>("div", "dismissButton");
