/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { fieldErrorsRecipe } from "./field-errors.recipe";
import type { FieldErrorsRootProps } from "./field-errors.types";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: fieldErrorsRecipe,
});

export const FieldErrorsRoot = withProvider<
  HTMLDivElement,
  FieldErrorsRootProps
>("div", "root");

export interface FieldErrorsMessageProps extends HTMLChakraProps<"div"> {}
export const FieldErrorsMessage = withContext<
  HTMLDivElement,
  FieldErrorsMessageProps
>("div", "message");
