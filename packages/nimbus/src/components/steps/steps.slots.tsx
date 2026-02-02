import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react";
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

export const StepsIndicatorSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "indicator");

export const StepsSeparatorSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "separator");

export const StepsContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "content");

export const StepsLabelSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "label");

export const StepsDescriptionSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "description");
