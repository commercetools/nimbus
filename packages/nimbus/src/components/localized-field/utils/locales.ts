type LanguagesSplitByDefaultLocale = {
  related: string[];
  unrelated: string[];
};

export const getLocaleFieldAttribute = (
  fieldGroupAttr?: string,
  locale?: string
): string | undefined =>
  fieldGroupAttr && locale ? `${fieldGroupAttr}.${locale}` : undefined;

// gets the language tag of a given locale, e.g. `de` in `de-DE`
export const getLanguageForLocale = (locale: string): string =>
  locale.split("-")[0];

// splits the locales into two groups:
//  - the 'related' array contains locales with the same language tag as the default locale,
//    e.g. if the default locale is de-DE, related would be ['de-DE', 'de-CH']
//  - the 'unrelated' array contains locales with a different different language tag from the default locale
//.   e.g. if the default locale is de-DE, unrelated would be ['pt-BR', 'en-GB', 'zh-Hans']
export const splitLanguages = (
  defaultLocale: string,
  locales: string[]
): LanguagesSplitByDefaultLocale => {
  const defaultLanguage = getLanguageForLocale(defaultLocale);
  const related = locales.filter(
    (locale) => getLanguageForLocale(locale) === defaultLanguage
  );
  const unrelated = locales.filter(
    (locale) => getLanguageForLocale(locale) !== defaultLanguage
  );
  return {
    unrelated,
    related,
  };
};

// sorts locales with the following priority:
// - The selected locale is placed first (e.g pt-BR)
// - All locales using the same language tag as the selected language
//   follow (e.g. pt, pt-PT). They are sorted alphabetically.
// - All other locales follow, sorted alphabetically as well
export const sortLocalesByDefaultLocaleLanguage = (
  defaultLocale: string,
  allLocales: string[]
): string[] => {
  const { related, unrelated } = splitLanguages(
    defaultLocale,
    allLocales.filter((locale: string) => locale !== defaultLocale)
  );

  return [defaultLocale, ...related.sort(), ...unrelated.sort()];
};
