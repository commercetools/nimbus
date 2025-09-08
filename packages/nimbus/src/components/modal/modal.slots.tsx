import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { modalSlotRecipe } from "./modal.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: modalSlotRecipe,
});

// Root slot - provides recipe context to all child components
export type ModalRootSlotProps = HTMLChakraProps<"div">;
export const ModalRootSlot = withProvider<HTMLDivElement, ModalRootSlotProps>(
  "div",
  "root"
);

// Trigger slot - button that opens the modal
export type ModalTriggerSlotProps = HTMLChakraProps<"button">;
export const ModalTriggerSlot = withContext<
  HTMLButtonElement,
  ModalTriggerSlotProps
>("button", "trigger");

// Backdrop slot - overlay behind the modal
export type ModalBackdropSlotProps = HTMLChakraProps<"div">;
export const ModalBackdropSlot = withContext<HTMLDivElement, ModalBackdropSlotProps>(
  "div",
  "backdrop"
);

// Positioner slot - positions the modal content
export type ModalPositionerSlotProps = HTMLChakraProps<"div">;
export const ModalPositionerSlot = withContext<HTMLDivElement, ModalPositionerSlotProps>(
  "div",
  "positioner"
);

// Content slot - main modal container
export type ModalContentSlotProps = HTMLChakraProps<"div">;
export const ModalContentSlot = withContext<HTMLDivElement, ModalContentSlotProps>(
  "div",
  "content"
);

// Header slot - modal header section
export type ModalHeaderSlotProps = HTMLChakraProps<"header">;
export const ModalHeaderSlot = withContext<HTMLElement, ModalHeaderSlotProps>(
  "header",
  "header"
);

// Body slot - modal body content
export type ModalBodySlotProps = HTMLChakraProps<"div">;
export const ModalBodySlot = withContext<HTMLDivElement, ModalBodySlotProps>(
  "div",
  "body"
);

// Footer slot - modal footer section with actions
export type ModalFooterSlotProps = HTMLChakraProps<"footer">;
export const ModalFooterSlot = withContext<HTMLElement, ModalFooterSlotProps>(
  "footer",
  "footer"
);

// Title slot - accessible modal title
export type ModalTitleSlotProps = HTMLChakraProps<"h2">;
export const ModalTitleSlot = withContext<HTMLHeadingElement, ModalTitleSlotProps>(
  "h2",
  "title"
);

// Description slot - accessible modal description
export type ModalDescriptionSlotProps = HTMLChakraProps<"p">;
export const ModalDescriptionSlot = withContext<HTMLParagraphElement, ModalDescriptionSlotProps>(
  "p",
  "description"
);

// Close trigger slot - button to close the modal
export type ModalCloseTriggerSlotProps = HTMLChakraProps<"button">;
export const ModalCloseTriggerSlot = withContext<
  HTMLButtonElement,
  ModalCloseTriggerSlotProps
>("button", "closeTrigger");