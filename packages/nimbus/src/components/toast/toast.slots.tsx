import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusToast",
});

export const ToastRoot = withProvider<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "root"
);
export const ToastTitle = withContext<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "title"
);
export const ToastDescription = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "description");
export const ToastIcon = withContext<HTMLDivElement, HTMLChakraProps<"div">>(
  "div",
  "icon"
);
export const ToastActionTrigger = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "actionTrigger");
export const ToastCloseTrigger = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "closeTrigger");
