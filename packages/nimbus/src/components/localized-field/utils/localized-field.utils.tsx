import { FormattedMessage } from "react-intl";
import { FormField, type TCurrencyCode } from "@/components";
import messages from "../localized-field.i18n";
import type { LocalizedString } from "../localized-field.types";

type LanguagesSplitByDefaultLocale = {
  related: string[];
  unrelated: string[];
};

type TouchedLocalizedString = { [locale: string]: boolean };

export const RequiredValueErrorMessage = () => (
  <FormField.Error>
    <FormattedMessage {...messages.missingRequiredField} />
  </FormField.Error>
);

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

export const sortCurrencies = (
  defaultCurrency: TCurrencyCode,
  allCurrencies: TCurrencyCode[]
) => {
  const remainingCurrencies = allCurrencies.filter(
    (currency) => currency !== defaultCurrency
  );
  return [defaultCurrency, ...remainingCurrencies.sort()];
};

export const getHasInvalidLocalizedFields = <TErrors extends object>(
  errors?: TErrors,
  defaultLocaleOrCurrency?: string
): boolean => {
  if (errors && Object.keys(errors).length > 0 && defaultLocaleOrCurrency) {
    return Object.keys(errors).some(
      (localeOrCurrency) => localeOrCurrency !== defaultLocaleOrCurrency
    );
  }
  return false;
};

export const createLocalizedString = (
  locales: string[],
  existingLocalizedString: LocalizedString
): LocalizedString => {
  const localesInLocalizedString = Array.from(
    new Set([...locales, ...Object.keys(existingLocalizedString)])
  );

  return localesInLocalizedString.reduce<LocalizedString>(
    (localizedString, locale) => ({
      ...localizedString,
      [locale]: existingLocalizedString?.[locale] || "",
    }),
    {}
  );
};

// Note: I prefer `isLocalizedStringEmpty`, but keeping this as `isEmpty` for api consistency with UI Kit
export const isEmpty = (localizedString?: LocalizedString): boolean => {
  if (!localizedString) return true;
  return Object.values(localizedString).every(
    (value: string) => !value || value.trim().length === 0
  );
};

export const omitEmptyTranslations = <Translations extends LocalizedString>(
  localizedString: Translations
): LocalizedString => {
  // TODO: is it necessary to create a util that enforces a consistent warning/error format, e.g.
  // `<COMPONENT_NAME> - Warning: <WARNING_MESSAGE>`
  if (typeof localizedString !== "object") {
    console.warn(
      "Nimbus Localized Field - Warning: omitEmptyTranslations must be called with an object"
    );
  }

  return Object.entries(localizedString).reduce<LocalizedString>(
    (localizedStringWithoutEmptyTranslations, [locale, value]) => {
      if (value && value.trim().length > 0) {
        return {
          ...localizedStringWithoutEmptyTranslations,
          [locale]: value,
        };
      }
      return localizedStringWithoutEmptyTranslations;
    },
    {}
  );
};

export const isTouched = (touched?: TouchedLocalizedString): boolean => {
  if (touched) {
    return Object.values(touched).some(Boolean);
  }
  return false;
};
