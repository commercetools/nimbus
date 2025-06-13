/* eslint-disable @typescript-eslint/no-empty-object-type */
import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  RadioInputOptionSlotProps,
  RadioInputRootSlotProps,
} from "./radio-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "radioInput",
});

export const RadioInputRootSlot = withProvider<
  HTMLDivElement,
  RadioInputRootSlotProps
>("div", "root");

export const RadioInputOptionSlot = withContext<
  HTMLSpanElement,
  RadioInputOptionSlotProps
>("span", "option");
