/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";

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
export interface FormFieldLabelSlotProps extends HTMLChakraProps<"label"> {}
export const FormFieldLabelSlot = withContext<
  HTMLLabelElement,
  FormFieldLabelSlotProps
>("label", "label");

// Input Slot
export interface FormFieldInputSlotProps extends HTMLChakraProps<"div"> {}
export const FormFieldInputSlot = withContext<
  HTMLDivElement,
  FormFieldInputSlotProps
>("div", "input");

// Description Slot
export interface FormFieldDescriptionSlotProps extends HTMLChakraProps<"p"> {}
export const FormFieldDescriptionSlot = withContext<
  HTMLParagraphElement,
  FormFieldDescriptionSlotProps
>("p", "description");

// Error Slot
export interface FormFieldErrorSlotProps extends HTMLChakraProps<"p"> {}
export const FormFieldErrorSlot = withContext<
  HTMLParagraphElement,
  FormFieldErrorSlotProps
>("p", "error");
