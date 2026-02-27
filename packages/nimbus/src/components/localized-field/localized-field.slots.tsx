import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  LocalizedFieldRootSlotProps,
  LocalizedFieldLabelSlotProps,
  LocalizedFieldInfoDialogSlotProps,
  LocalizedFieldFieldsContainerSlotProps,
  LocalizedFieldDescriptionSlotProps,
  LocalizedFieldErrorSlotProps,
  LocalizedFieldToggleButtonContainerSlotProps,
  LocalizedFieldLocaleFieldRootSlotProps,
  LocalizedFieldLocaleFieldLabelSlotProps,
  LocalizedFieldLocaleFieldInputSlotProps,
} from "./localized-field.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusLocalizedField",
});

// Root Slot
export const LocalizedFieldRootSlot = withProvider<
  HTMLFieldSetElement,
  LocalizedFieldRootSlotProps
>("fieldset", "root");

// Label Slot
export const LocalizedFieldLabelSlot = withContext<
  HTMLLabelElement,
  LocalizedFieldLabelSlotProps
>("legend", "label");

// InfoDialog Slot
export const LocalizedFieldInfoDialogSlot = withContext<
  HTMLDivElement,
  LocalizedFieldInfoDialogSlotProps
>("div", "infoDialog");

// FieldsContainer Slot
export const LocalizedFieldFieldsContainerSlot = withContext<
  HTMLDivElement,
  LocalizedFieldFieldsContainerSlotProps
>("div", "fieldsContainer");

// Description Slot
export const LocalizedFieldDescriptionSlot = withContext<
  HTMLDivElement,
  LocalizedFieldDescriptionSlotProps
>("div", "description");

// Error Slot
export const LocalizedFieldErrorSlot = withContext<
  HTMLDivElement,
  LocalizedFieldErrorSlotProps
>("div", "error");

// ToggleButtonContainer Slot
export const LocalizedFieldToggleButtonContainerSlot = withContext<
  HTMLDivElement,
  LocalizedFieldToggleButtonContainerSlotProps
>("div", "toggleButtonContainer");

// LocaleFieldRoot Slot
export const LocalizedFieldLocaleFieldRootSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldRootSlotProps
>("div", "localeFieldRoot");

// FieldLabel Slot
export const LocalizedFieldLocaleFieldLabelSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldLabelSlotProps
>("div", "localeFieldLabel");

// FieldInput Slot
export const LocalizedFieldLocaleFieldInputSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldInputSlotProps
>("div", "localeFieldInput");
