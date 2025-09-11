import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { dialogSlotRecipe } from "./dialog.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: dialogSlotRecipe,
});

// Root slot - provides recipe context + config to all child components
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

// Backdrop slot - overlay displayed behind the dialog
export type DialogBackdropSlotProps = HTMLChakraProps<"div">;
export const DialogBackdropSlot = withContext<
  HTMLDivElement,
  DialogBackdropSlotProps
>("div", "backdrop");

// Positioner slot - positions the dialog content
export type ModalSlotProps = HTMLChakraProps<"div">;
export const ModalSlot = withContext<HTMLDivElement, ModalSlotProps>(
  "div",
  "positioner"
);

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

// Close trigger slot - div container for positioning close button
export type DialogCloseTriggerSlotProps = HTMLChakraProps<"div">;
export const DialogCloseTriggerSlot = withContext<
  HTMLDivElement,
  DialogCloseTriggerSlotProps
>("div", "closeTrigger");
