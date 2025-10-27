import { createSlotRecipeContext } from "@chakra-ui/react";
import { Checkbox as RaCheckbox } from "react-aria-components";
import type { SlotComponent } from "@/type-utils/slot-types";
import type {
  CheckboxRootSlotProps,
  CheckboxIndicatorSlotProps,
  CheckboxLabelSlotProps,
} from "./checkbox.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "checkbox",
});

export const CheckboxRoot: SlotComponent<
  HTMLLabelElement,
  CheckboxRootSlotProps
> = withProvider<HTMLLabelElement, CheckboxRootSlotProps>(RaCheckbox, "root");

export const CheckboxLabel: SlotComponent<
  HTMLSpanElement,
  CheckboxLabelSlotProps
> = withContext<HTMLSpanElement, CheckboxLabelSlotProps>("span", "label");

export const CheckboxIndicator: SlotComponent<
  HTMLSpanElement,
  CheckboxIndicatorSlotProps
> = withContext<HTMLSpanElement, CheckboxIndicatorSlotProps>(
  "span",
  "indicator"
);
