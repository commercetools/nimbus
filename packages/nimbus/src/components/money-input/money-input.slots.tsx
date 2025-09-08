import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  MoneyInputRootSlotProps,
  MoneyInputCurrencySelectSlotProps,
  MoneyInputAmountInputSlotProps,
  MoneyInputBadgeSlotProps,
} from "./money-input.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "moneyInput",
});

export const MoneyInputRootSlot = withProvider<
  HTMLDivElement,
  MoneyInputRootSlotProps
>("div", "root");

export const MoneyInputCurrencySelectSlot = withContext<
  HTMLDivElement,
  MoneyInputCurrencySelectSlotProps
>("div", "currencySelect");

export const MoneyInputAmountInputSlot = withContext<
  HTMLInputElement,
  MoneyInputAmountInputSlotProps
>("input", "amountInput");

export const MoneyInputBadgeSlot = withContext<
  HTMLDivElement,
  MoneyInputBadgeSlotProps
>("div", "badge");
