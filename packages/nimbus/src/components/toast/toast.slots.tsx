import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  ToastActionTriggerSlotProps,
  ToastCloseTriggerSlotProps,
  ToastDescriptionProps,
  ToastIconSlotProps,
  ToastRootSlotProps,
  ToastTitleProps,
} from "./toast.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusToast",
});

export const ToastRoot = withProvider<HTMLDivElement, ToastRootSlotProps>(
  "div",
  "root"
);

export const ToastTitle = withContext<HTMLDivElement, ToastTitleProps>(
  "div",
  "title"
);

export const ToastDescription = withContext<
  HTMLDivElement,
  ToastDescriptionProps
>("div", "description");

export const ToastIcon = withContext<HTMLDivElement, ToastIconSlotProps>(
  "div",
  "icon"
);

// This is a div wrapper for layout placement - note that we expect it to receive Button props, but we use a div.
// We then forward the consumer props to the interior Button component.
export const ToastActionTrigger = withContext<
  HTMLDivElement,
  ToastActionTriggerSlotProps
>("div", "actionTrigger");

// This is a div wrapper for layout placement - note that we expect it to receive IconButton props, but we use a div.
// We then forward the consumer props to the interior IconButton component.
export const ToastCloseTrigger = withContext<
  HTMLDivElement,
  ToastCloseTriggerSlotProps
>("div", "closeTrigger");
