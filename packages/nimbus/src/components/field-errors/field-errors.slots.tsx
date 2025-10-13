import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  FieldErrorsMessageProps,
  FieldErrorsRootProps,
} from "./field-errors.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "fieldErrors",
});

export const FieldErrorsRoot = withProvider<
  HTMLDivElement,
  FieldErrorsRootProps
>("div", "root");

export const FieldErrorsMessage = withContext<
  HTMLDivElement,
  FieldErrorsMessageProps
>("div", "message");
