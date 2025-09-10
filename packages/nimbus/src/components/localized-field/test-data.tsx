export const baseLocaleData = {
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

export const baseCurrencyData = {
  values: {
    USD: { amount: "10.55", currencyCode: "USD" },
    CNY: { amount: "85.55", currencyCode: "CNY" },
    EUR: { amount: "8.55", currencyCode: "EUR" },
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
