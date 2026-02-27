import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  FormFieldRootSlotProps,
  FormFieldLabelSlotProps,
  FormFieldInputSlotProps,
  FormFieldDescriptionSlotProps,
  FormFieldErrorSlotProps,
  FormFieldPopoverSlotProps,
} from "./form-field.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusFormField",
});

// Root slot
export const FormFieldRootSlot = withProvider<
  HTMLDivElement,
  FormFieldRootSlotProps
>("div", "root");

// Label Slot
export const FormFieldLabelSlot = withContext<
  HTMLDivElement,
  FormFieldLabelSlotProps
>("div", "label");

// Input Slot
export const FormFieldInputSlot = withContext<
  HTMLDivElement,
  FormFieldInputSlotProps
>("div", "input");

// Description Slot
export const FormFieldDescriptionSlot = withContext<
  HTMLDivElement,
  FormFieldDescriptionSlotProps
>("div", "description");

// Error Slot
export const FormFieldErrorSlot = withContext<
  HTMLDivElement,
  FormFieldErrorSlotProps
>("div", "error");

// Error Slot
export const FormFieldPopoverSlot = withContext<
  HTMLDivElement,
  FormFieldPopoverSlotProps
>("div", "popover");
