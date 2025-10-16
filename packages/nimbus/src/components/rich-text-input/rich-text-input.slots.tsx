import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  RichTextInputRootSlotProps,
  RichTextInputToolbarSlotProps,
  RichTextInputEditableSlotProps,
} from "./rich-text-input.types";
import type { SlotComponent } from "@/utils/slot-types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "richTextInput",
});

// Root slot
export const RichTextInputRootSlot: SlotComponent<
  HTMLDivElement,
  RichTextInputRootSlotProps
> = withProvider<HTMLDivElement, RichTextInputRootSlotProps>("div", "root");

// Toolbar slot
export const RichTextInputToolbarSlot = withContext<
  HTMLDivElement,
  RichTextInputToolbarSlotProps
>("div", "toolbar");

// Editable slot
export const RichTextInputEditableSlot = withContext<
  HTMLDivElement,
  RichTextInputEditableSlotProps
>("div", "editable");
