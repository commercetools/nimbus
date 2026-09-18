import {
  type CurrencyCode,
  type MoneyInputValue,
  type MoneyValue,
  MoneyInput,
} from "@/components";

export const sortCurrencies = (
  defaultCurrency: CurrencyCode,
  allCurrencies: CurrencyCode[]
) => {
  const remainingCurrencies = allCurrencies.filter(
    (currency) => currency !== defaultCurrency
  );
  return [defaultCurrency, ...remainingCurrencies.sort()];
};

export const convertToMoneyValues = (
  values: MoneyInputValue[],
  currency: string
): Array<MoneyValue | null> =>
  Object.values(values).map<MoneyValue | null>((value) => {
    return MoneyInput.convertToMoneyValue(value, currency);
  });

export const parseMoneyValues = (
  moneyValues: MoneyValue[] = [],
  locale: string
): Record<CurrencyCode, MoneyInputValue> =>
  moneyValues.reduce<Record<CurrencyCode, MoneyInputValue>>(
    (allValues, moneyValue) => {
      const value = MoneyInput.parseMoneyValue(moneyValue, locale);
      return {
        ...allValues,
        [value.currencyCode]: value,
      };
    },
    {} as Record<CurrencyCode, MoneyInputValue>
  );

export const getHighPrecisionCurrencies = (
  values: Record<CurrencyCode, MoneyInputValue>,
  locale: string
): CurrencyCode[] => {
  const typedCurrencyCodes = Object.keys(values) as CurrencyCode[];
  return typedCurrencyCodes.filter((currencyCode) =>
    MoneyInput.isHighPrecision(values[currencyCode], locale)
  );
};

export const getEmptyCurrencies = (
  values: Record<CurrencyCode, MoneyInputValue>
): CurrencyCode[] => {
  const typedCurrencyCodes = Object.keys(values) as CurrencyCode[];
  return typedCurrencyCodes.filter((currencyCode) =>
    MoneyInput.isEmpty(values[currencyCode])
  );
};
