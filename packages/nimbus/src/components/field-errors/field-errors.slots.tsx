import { createSlotRecipeContext } from "@chakra-ui/react";
import type {
  FieldErrorsMessageSlotProps,
  FieldErrorsRootSlotProps,
} from "./field-errors.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "fieldErrors",
});

export const FieldErrorsRoot = withProvider<
  HTMLDivElement,
  FieldErrorsRootSlotProps
>("div", "root");

export const FieldErrorsMessage = withContext<
  HTMLDivElement,
  FieldErrorsMessageSlotProps
>("div", "message");
