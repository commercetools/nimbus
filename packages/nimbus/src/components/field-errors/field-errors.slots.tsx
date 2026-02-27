import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  FieldErrorsMessageSlotProps,
  FieldErrorsRootSlotProps,
} from "./field-errors.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusFieldErrors",
});

export const FieldErrorsRoot: SlotComponent<
  HTMLDivElement,
  FieldErrorsRootSlotProps
> = withProvider<HTMLDivElement, FieldErrorsRootSlotProps>("div", "root");

export const FieldErrorsMessage: SlotComponent<
  HTMLDivElement,
  FieldErrorsMessageSlotProps
> = withContext<HTMLDivElement, FieldErrorsMessageSlotProps>("div", "message");
