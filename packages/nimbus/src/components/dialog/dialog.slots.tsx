import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  DialogBodySlotProps,
  DialogCloseTriggerSlotProps,
  DialogContentSlotProps,
  DialogFooterSlotProps,
  DialogHeaderSlotProps,
  DialogModalOverlaySlotProps,
  DialogModalSlotProps,
  DialogRootProps,
  DialogTitleSlotProps,
  DialogTriggerSlotProps,
} from "./dialog.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDialog",
});

// Root slot - provides recipe context + config to all child components
export const DialogRootSlot = withProvider<HTMLDivElement, DialogRootProps>(
  "div",
  "root"
);

// Trigger slot - button that opens the dialog
export const DialogTriggerSlot = withContext<
  HTMLButtonElement,
  DialogTriggerSlotProps
>("button", "trigger");

// Backdrop slot - overlay displayed behind the dialog
export const DialogModalOverlaySlot = withContext<
  HTMLDivElement,
  DialogModalOverlaySlotProps
>("div", "modalOverlay");

// modal slot - positions the dialog content

export const DialogModalSlot = withContext<
  HTMLDivElement,
  DialogModalSlotProps
>("div", "modal");

// Content slot - main dialog container
export const DialogContentSlot = withContext<
  HTMLDivElement,
  DialogContentSlotProps
>("div", "content");

// Header slot - dialog header section
export const DialogHeaderSlot = withContext<HTMLElement, DialogHeaderSlotProps>(
  "header",
  "header"
);

// Body slot - dialog body content
export const DialogBodySlot = withContext<HTMLDivElement, DialogBodySlotProps>(
  "div",
  "body"
);

// Footer slot - dialog footer section with actions
export const DialogFooterSlot = withContext<HTMLElement, DialogFooterSlotProps>(
  "footer",
  "footer"
);

// Title slot - accessible dialog title
export const DialogTitleSlot = withContext<
  HTMLHeadingElement,
  DialogTitleSlotProps
>("h2", "title");

// Close trigger slot - div container for positioning close button
export const DialogCloseTriggerSlot = withContext<
  HTMLDivElement,
  DialogCloseTriggerSlotProps
>("div", "closeTrigger");
