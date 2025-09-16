import currencies from "./currencies";
import {
  createMoneyValue,
  getAmountAsNumberFromMoneyValue,
  type TMoneyValue,
  type TValue,
} from "./parsing-utilities";

// Replace lodash/has with native implementation
const has = (obj: Record<string, unknown>, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

// Static method implementations - preserve exact logic from UI Kit
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

  console.warn(
    typeof locale === "string",
    "MoneyInput.parseMoneyValue: A locale must be passed as the second argument"
  );

  console.warn(
    typeof moneyValue === "object",
    "MoneyInput.parseMoneyValue: Value must be passed as an object or be undefined"
  );

  console.warn(
    typeof moneyValue.currencyCode === "string",
    'MoneyInput.parseMoneyValue: Value must contain "currencyCode"'
  );

  if (typeof moneyValue.currencyCode !== "string") {
    throw new Error(
      'MoneyInput.parseMoneyValue: Value must contain "currencyCode"'
    );
  }

  console.warn(
    has(currencies, moneyValue.currencyCode),
    "MoneyInput.parseMoneyValue: Value must use known currency code"
  );

  if (!has(currencies, moneyValue.currencyCode)) {
    throw new Error(
      "MoneyInput.parseMoneyValue: Value must use known currency code"
    );
  }

  console.warn(
    // highPrecision or centPrecision values must be set
    typeof moneyValue.centAmount === "number" ||
      (typeof moneyValue.preciseAmount === "number" &&
        typeof moneyValue.fractionDigits === "number"),
    'MoneyInput.parseMoneyValue: Value must contain "amount"'
  );

  // Direct formatting without circular conversion
  const amountAsNumber = getAmountAsNumberFromMoneyValue(moneyValue);
  const fractionDigits = moneyValue.preciseAmount
    ? moneyValue.fractionDigits
    : currencies[moneyValue.currencyCode].fractionDigits;

  const amount = isNaN(amountAsNumber)
    ? ""
    : amountAsNumber.toLocaleString(locale, {
        minimumFractionDigits: fractionDigits,
      });

  return { amount, currencyCode: moneyValue.currencyCode };
};

export const isEmpty = (formValue: TValue) =>
  !formValue ||
  formValue.amount.trim() === "" ||
  formValue.currencyCode.trim() === "";

export const isHighPrecision = (formValue: TValue, locale: string): boolean => {
  if (isEmpty(formValue)) {
    return false;
  }
  const moneyValue = convertToMoneyValue(formValue, locale);
  return moneyValue?.type === "highPrecision";
};
