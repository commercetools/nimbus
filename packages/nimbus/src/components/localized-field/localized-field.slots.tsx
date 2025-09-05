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
  extends HTMLChakraProps<"legend"> {}
export const LocalizedFieldLabelSlot = withContext<
  HTMLLegendElement,
  LocalizedFieldLabelSlotProps
>("legend", "label");

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

// FieldDescription Slot
export interface LocalizedFieldLocaleFieldDescriptionSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldLocaleFieldDescriptionSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldDescriptionSlotProps
>("div", "localeFieldDescription");

// FieldError Slot
export interface LocalizedFieldLocaleFieldErrorSlotProps
  extends HTMLChakraProps<"div"> {}
export const LocalizedFieldLocaleFieldErrorSlot = withContext<
  HTMLDivElement,
  LocalizedFieldLocaleFieldErrorSlotProps
>("div", "localeFieldError");
