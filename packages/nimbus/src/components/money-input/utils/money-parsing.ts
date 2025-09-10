import { warning } from "./nimbus-utils";
import currencies from "./currencies";

export type TCurrencyCode = keyof typeof currencies;

type TMoneyConditionalProps =
  | { type: "highPrecision"; preciseAmount: number }
  | {
      type: "centPrecision";
      preciseAmount?: never;
    };

export type TMoneyValue = {
  currencyCode: TCurrencyCode;
  centAmount: number;
  fractionDigits: number;
} & TMoneyConditionalProps;

export type TValue = {
  amount: string;
  currencyCode: TCurrencyCode | "";
};

// Parsing function - preserves exact logic from UI Kit
export const parseRawAmountToNumber = (rawAmount: string, locale: string) => {
  let fractionsSeparator;

  if (locale) {
    fractionsSeparator = (2.5) // we need any number with fractions, so that we know what is the fraction
      .toLocaleString(locale) // "symbol" for the provided locale
      .replace(/\d/g, ""); // then we remove the numbers and keep the "symbol"
  } else {
    const lastDot = String(rawAmount).lastIndexOf(".");
    const lastComma = String(rawAmount).lastIndexOf(",");
    fractionsSeparator = lastComma > lastDot ? "," : ".";
  }
  fractionsSeparator = fractionsSeparator === "." ? "\\." : fractionsSeparator; // here we escape the '.' to use it as regex
  // The raw amount with only one sparator
  const normalizedAmount = String(rawAmount)
    .replace(new RegExp(`[^-0-9${fractionsSeparator}]`, "g"), "") // we just keep the numbers and the fraction symbol
    .replace(fractionsSeparator, "."); // then we change whatever `fractionsSeparator` was to `.` so we can parse it as float

  return parseFloat(normalizedAmount);
};

// Money value creation - preserves exact logic from UI Kit
export const createMoneyValue = (
  rawAmount: string,
  locale: string,
  currencyCode?: TCurrencyCode | ""
): TMoneyValue | null => {
  if (!currencyCode) return null;

  const currency = currencies[currencyCode];
  if (!currency) return null;
  // The user may enter a value with a comma, dot, or apostrophe as the decimal separator.
  if (rawAmount.length === 0 || rawAmount.trim() === "") return null;

  warning(
    Boolean(locale) || currency.fractionDigits !== 0,
    `MoneyInput: A locale must be provided when currency has no fraction digits (${currencyCode})`
  );
  const amountAsNumber = parseRawAmountToNumber(rawAmount, locale);
  if (isNaN(amountAsNumber)) return null;

  // The cent amount is rounded to the currencie's default number
  // of fraction digits for prices with high precision.
  //
  // Additionally, JavaScript is sometimes incorrect when multiplying floats,
  //   e.g. 2.49 * 100 -> 249.00000000000003
  // While inaccuracy from multiplying floating point numbers is a
  // general problem in JS, we can avoid it by cutting off all
  // decimals. This is possible since cents is the base unit, so we
  // operate on integers anyways
  // Also we should the round the value to ensure that we come close
  // to the nearest decimal value
  // ref: https://github.com/commercetools/merchant-center-frontend/pull/770
  const centAmount = Math.trunc(
    Math.round(amountAsNumber * 10 ** currency.fractionDigits)
  );

  const fractionDigitsOfAmount =
    // The conversion to a string will always use a dot as the separator.
    // That means we don't have to handle a comma.
    String(amountAsNumber).indexOf(".") === -1
      ? 0
      : String(amountAsNumber).length - String(amountAsNumber).indexOf(".") - 1;

  if (fractionDigitsOfAmount > currency.fractionDigits) {
    return {
      type: "highPrecision",
      currencyCode,
      centAmount,
      preciseAmount: parseInt(
        // Here we need to convert  a number like 8.066652 to its centamount
        // We could do that by multiplying it with 10 ** number-of-fraction-digits
        // but then we'll run into problems with JavaScript's floating point
        // number precision and end up with 8066651.9999999, and then parseInt
        // cuts off the remainder.
        // So instead of using maths to convert the number, we just replace
        // the dot inside the number which does the same thing.
        // We don't need to replace "," as well, as numbers always us a dot
        // when converted using String().
        //
        // The mathematical way: amountAsNumber * 10 ** fractionDigitsOfAmount,
        String(amountAsNumber).replace(".", ""),
        10
      ),
      fractionDigits: fractionDigitsOfAmount,
    };
  }

  return {
    type: "centPrecision",
    currencyCode,
    centAmount,
    fractionDigits: currency.fractionDigits,
  };
};

export const createEmptyMoneyValue = (
  currencyCode: TCurrencyCode
): TMoneyValue => ({
  type: "centPrecision",
  currencyCode,
  centAmount: NaN,
  fractionDigits: 2,
});

export const getAmountAsNumberFromMoneyValue = (moneyValue: TMoneyValue) =>
  moneyValue.type === "highPrecision"
    ? moneyValue.preciseAmount / 10 ** moneyValue.fractionDigits
    : moneyValue.centAmount /
      10 ** currencies[moneyValue.currencyCode].fractionDigits;
