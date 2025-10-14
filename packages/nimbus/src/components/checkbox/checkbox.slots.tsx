import { createSlotRecipeContext } from "@chakra-ui/react";
import { Checkbox as RaCheckbox } from "react-aria-components";
import type {
  CheckboxRootSlotProps,
  CheckboxIndicatorSlotProps,
  CheckboxLabelSlotProps,
} from "./checkbox.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "checkbox",
});

export const CheckboxRoot = withProvider<HTMLLabelElement, CheckboxRootSlotProps>(
  RaCheckbox,
  "root"
);

export const CheckboxLabel = withContext<HTMLSpanElement, CheckboxLabelSlotProps>(
  "span",
  "label"
);

export const CheckboxIndicator = withContext<
  HTMLSpanElement,
  CheckboxIndicatorSlotProps
>("span", "indicator");
