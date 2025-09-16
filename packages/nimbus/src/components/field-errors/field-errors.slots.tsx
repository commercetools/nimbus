import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import { fieldErrorsRecipe } from "./field-errors.recipe";
import type { FieldErrorsRootProps } from "./field-errors.types";

const { withProvider } = createSlotRecipeContext({
  recipe: fieldErrorsRecipe,
});

export const FieldErrorsRoot = withProvider<
  HTMLDivElement,
  FieldErrorsRootProps
>("div", "root");
