import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { checkboxSlotRecipe } from "./checkbox.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "checkbox",
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

interface CheckboxLabelProps extends HTMLChakraProps<"span"> {}
export const CheckboxLabel = withContext<HTMLSpanElement, CheckboxLabelProps>(
  "span",
  "label"
);

interface ChekcboxIndicatorProps extends HTMLChakraProps<"span"> {}
export const CheckboxIndicator = withContext<
  HTMLSpanElement,
  ChekcboxIndicatorProps
>("span", "indicator");
