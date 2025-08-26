/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import {
  Checkbox as RaCheckbox,
  type CheckboxProps,
} from "react-aria-components";
import { checkboxSlotRecipe } from "./checkbox.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "checkbox",
});

export interface CheckboxRootProps
  extends Omit<
      HTMLChakraProps<"label", RecipeVariantProps<typeof checkboxSlotRecipe>>,
      keyof CheckboxProps
    >,
    CheckboxProps {}

export const CheckboxRoot = withProvider<CheckboxRootProps, CheckboxRootProps>(
  RaCheckbox,
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
