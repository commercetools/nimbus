import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import { Group } from "@/components";
import type {
  MoneyInputRootSlotProps,
  MoneyInputContainerSlotProps,
  MoneyInputCurrencySelectSlotProps,
  MoneyInputCurrencyLabelSlotProps,
  MoneyInputAmountInputSlotProps,
  MoneyInputBadgeSlotProps,
} from "./money-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusMoneyInput",
});

export const MoneyInputRootSlot = withProvider<
  HTMLDivElement,
  MoneyInputRootSlotProps
>(Group, "root");

export const MoneyInputContainerSlot = withContext<
  HTMLDivElement,
  MoneyInputContainerSlotProps
>("div", "container");

export const MoneyInputCurrencySelectSlot = withContext<
  HTMLDivElement,
  MoneyInputCurrencySelectSlotProps
>("div", "currencySelect");

export const MoneyInputCurrencyLabelSlot = withContext<
  HTMLLabelElement,
  MoneyInputCurrencyLabelSlotProps
>("label", "currencyLabel");

export const MoneyInputAmountInputSlot = withContext<
  HTMLInputElement,
  MoneyInputAmountInputSlotProps
>("input", "amountInput");

export const MoneyInputBadgeSlot = withContext<
  HTMLDivElement,
  MoneyInputBadgeSlotProps
>("div", "badge");
