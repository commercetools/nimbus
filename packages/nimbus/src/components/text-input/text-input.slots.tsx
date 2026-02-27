import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  TextInputRootSlotProps,
  TextInputLeadingElementSlotProps,
  TextInputInputSlotProps,
  TextInputTrailingElementSlotProps,
} from "./text-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTextInput",
});

export const TextInputRootSlot: SlotComponent<
  HTMLDivElement,
  TextInputRootSlotProps
> = withProvider<HTMLDivElement, TextInputRootSlotProps>("div", "root");

export const TextInputLeadingElementSlot: SlotComponent<
  HTMLDivElement,
  TextInputLeadingElementSlotProps
> = withContext<HTMLDivElement, TextInputLeadingElementSlotProps>(
  "div",
  "leadingElement"
);

export const TextInputInputSlot: SlotComponent<
  HTMLInputElement,
  TextInputInputSlotProps
> = withContext<HTMLInputElement, TextInputInputSlotProps>("input", "input");

export const TextInputTrailingElementSlot: SlotComponent<
  HTMLDivElement,
  TextInputTrailingElementSlotProps
> = withContext<HTMLDivElement, TextInputTrailingElementSlotProps>(
  "div",
  "trailingElement"
);
