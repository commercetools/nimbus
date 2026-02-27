import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  RichTextInputRootSlotProps,
  RichTextInputToolbarSlotProps,
  RichTextInputEditableSlotProps,
} from "./rich-text-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusRichTextInput",
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
