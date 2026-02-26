import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { StepsRootSlotProps } from "./steps.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSteps",
});

export const StepsRootSlot: SlotComponent<HTMLDivElement, StepsRootSlotProps> =
  withProvider<HTMLDivElement, StepsRootSlotProps>("div", "root");

export const StepsListSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "list");

export const StepsItemSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "item");

export const StepsTriggerSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "trigger");

export const StepsIndicatorSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "indicator");

export const StepsNumberSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "number");

export const StepsTitleSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "title");

export const StepsDescriptionSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "description");

export const StepsSeparatorSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "separator");

export const StepsContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "content");

export const StepsCompletedContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "completedContent");

export const StepsPrevTriggerSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "prevTrigger");

export const StepsNextTriggerSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "nextTrigger");
