import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { dialogSlotRecipe } from "./dialog.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: dialogSlotRecipe,
});

// Root slot - provides recipe context to all child components
export type DialogRootSlotProps = HTMLChakraProps<"div">;
export const DialogRootSlot = withProvider<HTMLDivElement, DialogRootSlotProps>(
  "div",
  "root"
);

// Trigger slot - button that opens the dialog
export type DialogTriggerSlotProps = HTMLChakraProps<"button">;
export const DialogTriggerSlot = withContext<
  HTMLButtonElement,
  DialogTriggerSlotProps
>("button", "trigger");

// Backdrop slot - overlay behind the dialog
export type DialogBackdropSlotProps = HTMLChakraProps<"div">;
export const DialogBackdropSlot = withContext<
  HTMLDivElement,
  DialogBackdropSlotProps
>("div", "backdrop");

// Positioner slot - positions the dialog content
export type DialogPositionerSlotProps = HTMLChakraProps<"div">;
export const DialogPositionerSlot = withContext<
  HTMLDivElement,
  DialogPositionerSlotProps
>("div", "positioner");

// Content slot - main dialog container
export type DialogContentSlotProps = HTMLChakraProps<"div">;
export const DialogContentSlot = withContext<
  HTMLDivElement,
  DialogContentSlotProps
>("div", "content");

// Header slot - dialog header section
export type DialogHeaderSlotProps = HTMLChakraProps<"header">;
export const DialogHeaderSlot = withContext<HTMLElement, DialogHeaderSlotProps>(
  "header",
  "header"
);

// Body slot - dialog body content
export type DialogBodySlotProps = HTMLChakraProps<"div">;
export const DialogBodySlot = withContext<HTMLDivElement, DialogBodySlotProps>(
  "div",
  "body"
);

// Footer slot - dialog footer section with actions
export type DialogFooterSlotProps = HTMLChakraProps<"footer">;
export const DialogFooterSlot = withContext<HTMLElement, DialogFooterSlotProps>(
  "footer",
  "footer"
);

// Title slot - accessible dialog title
export type DialogTitleSlotProps = HTMLChakraProps<"h2">;
export const DialogTitleSlot = withContext<
  HTMLHeadingElement,
  DialogTitleSlotProps
>("h2", "title");

// Description slot - accessible dialog description
export type DialogDescriptionSlotProps = HTMLChakraProps<"p">;
export const DialogDescriptionSlot = withContext<
  HTMLParagraphElement,
  DialogDescriptionSlotProps
>("p", "description");

// Close trigger slot - button to close the dialog
export type DialogCloseTriggerSlotProps = HTMLChakraProps<"button">;
export const DialogCloseTriggerSlot = withContext<
  HTMLButtonElement,
  DialogCloseTriggerSlotProps
>("button", "closeTrigger");
