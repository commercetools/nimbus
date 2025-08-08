/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
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

interface CheckboxIndicatorProps extends HTMLChakraProps<"span"> {}
export const CheckboxIndicator = withContext<
  HTMLSpanElement,
  CheckboxIndicatorProps
>("span", "indicator");
