import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import { Checkbox as RaCheckbox } from "react-aria-components";
import type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
} from "./checkbox.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "checkbox",
});

export const CheckboxRoot = withProvider<HTMLLabelElement, CheckboxRootProps>(
  RaCheckbox,
  "root"
);

export const CheckboxLabel = withContext<HTMLSpanElement, CheckboxLabelProps>(
  "span",
  "label"
);

export const CheckboxIndicator = withContext<
  HTMLSpanElement,
  CheckboxIndicatorProps
>("span", "indicator");
