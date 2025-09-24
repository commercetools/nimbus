import type { TCurrencyCode } from "@/components";
import type {
  LocalizedString,
  LocalizedCurrency,
} from "../localized-field.types";
import type { LocalizedFieldTypes } from "./localized-field.story-component";

export type LocalizedStoryData = {
  values: LocalizedString | LocalizedCurrency;
  placeholders?: LocalizedString;
  descriptions?: LocalizedString;
  warnings?: LocalizedString;
  errors?: LocalizedString;
};

export const allFieldTypes: LocalizedFieldTypes[] = [
  "text",
  "multiLine",
  "richText",
  "money",
];

export const baseContextFields = {
  label: "Greetings",
  hint: "Whatever greeting you'd like to display, enter it here",
  description: "A polite word or sign of welcome or recognition",
  warning: "youve been warned",
  error: "that value is wrong",
};

export const baseMoneyContextFields = {
  label: "Price",
  hint: "Whatever price you want this product to have, enter it here",
  description: "Price of the product",
  warning: "youve been warned",
  error: "that value is wrong",
};

export const baseLocales = ["en", "zh-Hans", "de"];

export const baseLocaleData: LocalizedStoryData = {
  values: {
    en: "hello",
    ["zh-Hans"]: "你好",
    de: "hallo",
  },
  placeholders: {
    en: "Enter a greeting",
    ["zh-Hans"]: "输入问候语",
    de: "Geben Sie eine Begrüßung ein",
  },
  descriptions: {
    en: "A common greeting",
    ["zh-Hans"]: "常见的问候",
    de: "Eine gemeinsame Begrüßung",
  },
  warnings: {
    en: "That might not be a greeting",
    ["zh-Hans"]: "这可能不是一个问候",
    de: "Das ist vielleicht keine Begrüßung",
  },
  errors: {
    en: "That is certainly not a greeting",
    ["zh-Hans"]: "这当然不是问候语",
    de: "Das ist sicher kein Gruß",
  },
};

export const baseCurrencies = ["USD", "CNY", "EUR"];

export const baseCurrencyData: LocalizedStoryData = {
  values: {
    USD: { amount: "10.55", currencyCode: "USD" as TCurrencyCode },
    CNY: { amount: "85.55", currencyCode: "CNY" as TCurrencyCode },
    EUR: { amount: "8.55", currencyCode: "EUR" as TCurrencyCode },
  },
  placeholders: {
    USD: "Enter an amount",
    CNY: "输入数量",
    EUR: "Geben Sie einen Betrag ein",
  },
  descriptions: {
    USD: "Price of the product in USD",
    CNY: "产品价格（人民币）",
    EUR: "Preis des Produkts in EUR",
  },
  warnings: {
    USD: "That price doesnt look quite right",
    CNY: "这个价格看起来不太合适",
    EUR: "Der Preis scheint nicht ganz richtig zu sein",
  },
  errors: {
    USD: "that is certainly not a greeting",
    CNY: "这个价格肯定是错误的",
    EUR: "Der Preis ist definitiv falsch",
  },
};

export const baseStoryProps = {
  id: "localizedFieldBase",
  name: "base localized field story",
  types: allFieldTypes,
  text: {
    fieldData: baseLocaleData,
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  multiLine: {
    fieldData: baseLocaleData,
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  richText: {
    fieldData: baseLocaleData,
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  money: {
    fieldData: baseCurrencyData,
    fieldProps: {
      label: baseMoneyContextFields.label,
    },
  },
};

export const emptyValuesStoryProps = {
  id: "localizedFieldEmptyValues",
  name: "localized field empty values story",
  types: allFieldTypes,
  text: {
    fieldData: {
      ...baseLocaleData,
      values: {
        en: undefined,
        ["zh-Hans"]: undefined,
        de: undefined,
      },
    },
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  multiLine: {
    fieldData: {
      ...baseLocaleData,
      values: {
        en: undefined,
        ["zh-Hans"]: undefined,
        de: undefined,
      },
    },
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  richText: {
    fieldData: {
      ...baseLocaleData,
      values: {
        en: undefined,
        ["zh-Hans"]: undefined,
        de: undefined,
      },
    },
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  money: {
    fieldData: {
      ...baseCurrencyData,
      values: {
        USD: undefined,
        CNY: undefined,
        EUR: undefined,
      },
    },
    fieldProps: {
      label: baseMoneyContextFields.label,
    },
  },
};

export const singleValueStoryProps = {
  id: "localizedFieldSingleValue",
  name: "localized field single value story",
  types: allFieldTypes,
  text: {
    fieldData: {
      ...baseLocaleData,
      values: {
        en: baseLocaleData.values.en,
      },
    },
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  multiLine: {
    fieldData: {
      ...baseLocaleData,
      values: {
        en: baseLocaleData.values.en,
      } as LocalizedString,
    },
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  richText: {
    fieldData: {
      ...baseLocaleData,
      values: {
        en: baseLocaleData.values.en,
      },
    },
    fieldProps: {
      label: baseContextFields.label,
    },
  },
  money: {
    fieldData: {
      ...baseCurrencyData,
      values: {
        USD: baseCurrencyData.values.USD,
      } as LocalizedCurrency,
    },
    fieldProps: {
      label: baseMoneyContextFields.label,
    },
  },
};

export const hintStoryProps = {
  id: "localizedFieldHintDialog",
  name: "localized field hint dialog story",
  types: allFieldTypes,

  text: {
    fieldData: baseLocaleData,
    fieldProps: {
      label: baseContextFields.label,
      hint: baseContextFields.hint,
    },
  },
  multiLine: {
    fieldData: baseLocaleData,
    fieldProps: {
      label: baseContextFields.label,
      hint: baseContextFields.hint,
    },
  },
  richText: {
    fieldData: baseLocaleData,
    fieldProps: {
      label: baseContextFields.label,
      hint: baseContextFields.hint,
    },
  },
  money: {
    fieldData: baseCurrencyData,
    fieldProps: {
      label: baseMoneyContextFields.label,
      hint: baseMoneyContextFields.hint,
    },
  },
};
