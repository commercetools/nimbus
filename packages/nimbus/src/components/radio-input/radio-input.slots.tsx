import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  RadioInputOptionSlotProps,
  RadioInputRootSlotProps,
} from "./radio-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusRadioInput",
});

export const RadioInputRootSlot = withProvider<
  HTMLDivElement,
  RadioInputRootSlotProps
>("div", "root");

export const RadioInputOptionSlot = withContext<
  HTMLSpanElement,
  RadioInputOptionSlotProps
>("span", "option");
