/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";
import { localizedFieldSlotRecipe } from "./localized-field.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: localizedFieldSlotRecipe,
});

// Root Slot
export interface LocalizedFieldRootSlotProps
  extends HTMLChakraProps<
    "fieldset",
    RecipeVariantProps<typeof localizedFieldSlotRecipe>
  > {}
export const LocalizedFieldRootSlot = withProvider<
  HTMLFieldSetElement,
  LocalizedFieldRootSlotProps
>("fieldset", "root");

// Label Slot
export interface LocalizedFieldLabelSlotProps
  extends HTMLChakraProps<"label"> {}
export const LocalizedFieldLabelSlot = withContext<
  HTMLLabelElement,
  LocalizedFieldLabelSlotProps
>("legend", "label");

// InfoDialog Slot
export interface LocalizedFieldInfoDialogSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldInfoDialogSlot = withContext<
  HTMLDivElement,
  LocalizedFieldInfoDialogSlotProps
>("div", "infoDialog");

// FieldsContainer Slot
export interface LocalizedFieldFieldsContainerSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldFieldsContainerSlot = withContext<
  HTMLDivElement,
  LocalizedFieldFieldsContainerSlotProps
>("div", "fieldsContainer");

// Description Slot
export interface LocalizedFieldDescriptionSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldDescriptionSlot = withContext<
  HTMLDivElement,
  LocalizedFieldDescriptionSlotProps
>("div", "description");

// Error Slot
export interface LocalizedFieldErrorSlotProps extends HTMLChakraProps<"div"> {}
export const LocalizedFieldErrorSlot = withContext<
  HTMLDivElement,
  LocalizedFieldErrorSlotProps
>("div", "error");

// ToggleButtonContainer Slot
export interface LocalizedFieldToggleButtonContainerSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldToggleButtonContainerSlot = withContext<
  HTMLDivElement,
  LocalizedFieldToggleButtonContainerSlotProps
>("div", "toggleButtonContainer");

// LocaleFieldRoot Slot

export interface LocalizedFieldLocaleFieldRootSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldLocaleFieldRootSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldRootSlotProps
>("div", "localeFieldRoot");

// FieldLabel Slot
export interface LocalizedFieldLocaleFieldLabelSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldLocaleFieldLabelSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldLabelSlotProps
>("div", "localeFieldLabel");

// FieldInput Slot
export interface LocalizedFieldLocaleFieldInputSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldLocaleFieldInputSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldInputSlotProps
>("div", "localeFieldInput");
