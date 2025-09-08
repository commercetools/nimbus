import {
  MoneyInputRoot,
  MoneyInputAmountInput,
  MoneyInputCurrencySelect,
  MoneyInputBadge,
} from "./components";
import {
  convertToMoneyValue,
  parseMoneyValue,
  isEmpty,
  isHighPrecision,
  isTouched,
} from "./utils";

const MoneyInputNamespace = {
  Root: MoneyInputRoot,
  AmountInput: MoneyInputAmountInput,
  CurrencySelect: MoneyInputCurrencySelect,
  Badge: MoneyInputBadge,
} as const;

type MoneyInputType = typeof MoneyInputNamespace & {
  // Static methods preserved from UI Kit
  convertToMoneyValue: typeof convertToMoneyValue;
  parseMoneyValue: typeof parseMoneyValue;
  isEmpty: typeof isEmpty;
  isHighPrecision: typeof isHighPrecision;
  isTouched: typeof isTouched;
  // Backwards compatibility helper methods
  getAmountInputId: (id: string) => string;
  getCurrencyDropdownId: (id: string) => string;
};

export const MoneyInput = MoneyInputNamespace as MoneyInputType;

// Attach static methods
MoneyInput.convertToMoneyValue = convertToMoneyValue;
MoneyInput.parseMoneyValue = parseMoneyValue;
MoneyInput.isEmpty = isEmpty;
MoneyInput.isHighPrecision = isHighPrecision;
MoneyInput.isTouched = isTouched;

// Backwards compatibility helpers
MoneyInput.getAmountInputId = (id: string) => `${id}-amount`;
MoneyInput.getCurrencyDropdownId = (id: string) => `${id}-currency`;
