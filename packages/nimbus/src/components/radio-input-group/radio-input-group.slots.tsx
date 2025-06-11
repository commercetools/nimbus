/* eslint-disable @typescript-eslint/no-empty-object-type */
import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  RadioInputLabelProps,
  RadioInputIndicatorProps,
} from "./radio-input-group.types";
import type { RadioInputRootProps } from "./radio-input-group.types";
import type { RadioInputGroupSlotProps } from "./radio-input-group.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "radioInput",
});

export const RadioInputGroupSlot = withProvider<
  HTMLDivElement,
  RadioInputGroupSlotProps
>("div", "group");

export const RadioInputRoot = withProvider<
  HTMLLabelElement,
  RadioInputRootProps
>("label", "root");

export const RadioInputLabel = withContext<
  HTMLSpanElement,
  RadioInputLabelProps
>("span", "label");

export const RadioInputIndicator = withContext<
  HTMLSpanElement,
  RadioInputIndicatorProps
>("span", "indicator");
