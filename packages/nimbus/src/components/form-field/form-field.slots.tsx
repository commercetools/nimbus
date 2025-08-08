/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { formFieldRecipe } from "./form-field.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: formFieldRecipe,
});

// Root slot
export interface FormFieldRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof formFieldRecipe> & UnstyledProp
  > {}

export const FormFieldRootSlot = withProvider<
  HTMLDivElement,
  FormFieldRootSlotProps
>("div", "root");

// Label Slot
export interface FormFieldLabelSlotProps extends HTMLChakraProps<"div"> {}
export const FormFieldLabelSlot = withContext<
  HTMLDivElement,
  FormFieldLabelSlotProps
>("div", "label");

// Input Slot
export interface FormFieldInputSlotProps extends HTMLChakraProps<"div"> {}
export const FormFieldInputSlot = withContext<
  HTMLDivElement,
  FormFieldInputSlotProps
>("div", "input");

// Description Slot
export interface FormFieldDescriptionSlotProps extends HTMLChakraProps<"div"> {}
export const FormFieldDescriptionSlot = withContext<
  HTMLDivElement,
  FormFieldDescriptionSlotProps
>("div", "description");

// Error Slot
export interface FormFieldErrorSlotProps extends HTMLChakraProps<"div"> {}
export const FormFieldErrorSlot = withContext<
  HTMLDivElement,
  FormFieldErrorSlotProps
>("div", "error");

// Error Slot
export interface FormFieldPopoverSlotProps extends HTMLChakraProps<"div"> {}
export const FormFieldPopoverSlot = withContext<
  HTMLDivElement,
  FormFieldPopoverSlotProps
>("div", "popover");
