import { warning } from "./nimbus-utils";

// Replace lodash/has with native implementation
const has = (obj: Record<string, unknown>, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
import currencies from "./currencies";
import {
  createMoneyValue,
  createEmptyMoneyValue,
  getAmountAsNumberFromMoneyValue,
  type TMoneyValue,
  type TValue,
  type TCurrencyCode,
} from "./money-parsing";

// Format amount - preserves exact logic from UI Kit
export const formatAmount = (
  rawAmount: string,
  locale: string,
  currencyCode: TCurrencyCode
) => {
  // fallback in case the user didn't enter an amount yet (or it's invalid)
  const moneyValue =
    createMoneyValue(rawAmount, locale, currencyCode) ||
    createEmptyMoneyValue(currencyCode);

  const amount = getAmountAsNumberFromMoneyValue(moneyValue);

  const fractionDigits = moneyValue.preciseAmount
    ? moneyValue.fractionDigits
    : currencies[moneyValue.currencyCode].fractionDigits;

  return isNaN(amount)
    ? ""
    : amount.toLocaleString(locale, { minimumFractionDigits: fractionDigits });
};

// Static method implementations - preserve exact logic
export const convertToMoneyValue = (value: TValue, locale: string) =>
  createMoneyValue(
    typeof value.amount === "string" ? value.amount.trim() : "",
    locale,
    value.currencyCode
  );

export const parseMoneyValue = (
  moneyValue: TMoneyValue,
  locale: string
): TValue => {
  if (!moneyValue) return { currencyCode: "", amount: "" };

  warning(
    typeof locale === "string",
    "MoneyInput.parseMoneyValue: A locale must be passed as the second argument"
  );

  warning(
    typeof moneyValue === "object",
    "MoneyInput.parseMoneyValue: Value must be passed as an object or be undefined"
  );

  warning(
    typeof moneyValue.currencyCode === "string",
    'MoneyInput.parseMoneyValue: Value must contain "currencyCode"'
  );

  warning(
    has(currencies, moneyValue.currencyCode),
    "MoneyInput.parseMoneyValue: Value must use known currency code"
  );

  warning(
    // highPrecision or centPrecision values must be set
    typeof moneyValue.centAmount === "number" ||
      (typeof moneyValue.preciseAmount === "number" &&
        typeof moneyValue.fractionDigits === "number"),
    'MoneyInput.parseMoneyValue: Value must contain "amount"'
  );

  const amount = formatAmount(
    getAmountAsNumberFromMoneyValue(moneyValue).toLocaleString(locale, {
      minimumFractionDigits: moneyValue.fractionDigits,
    }),
    locale,
    moneyValue.currencyCode
  );

  return { amount, currencyCode: moneyValue.currencyCode };
};

export const isEmpty = (formValue: TValue) =>
  !formValue ||
  formValue.amount.trim() === "" ||
  formValue.currencyCode.trim() === "";

export const isHighPrecision = (formValue: TValue, locale: string): boolean => {
  // Return false for empty values without warning in component context
  if (isEmpty(formValue)) {
    return false;
  }
  const moneyValue = convertToMoneyValue(formValue, locale);
  return moneyValue?.type === "highPrecision";
};
