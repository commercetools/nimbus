import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { checkboxSlotRecipe } from "./checkbox.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: checkboxSlotRecipe,
});

export interface CheckboxRootProps
  extends HTMLChakraProps<
    "label",
    RecipeVariantProps<typeof checkboxSlotRecipe>
  > {}
export const CheckboxRoot = withProvider<HTMLLabelElement, CheckboxRootProps>(
  "label",
  "root"
);

interface CheckboxControlProps extends HTMLChakraProps<"input"> {}
export const CheckboxControl = withContext<
  HTMLInputElement,
  CheckboxControlProps
>("input", "control");

interface CheckboxLabelProps extends HTMLChakraProps<"span"> {}
export const CheckboxLabel = withContext<HTMLSpanElement, CheckboxLabelProps>(
  "span",
  "label"
);
