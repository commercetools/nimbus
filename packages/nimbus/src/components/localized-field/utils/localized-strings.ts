import type { LocalizedString } from "../localized-field.types";

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
    (value?: string) => !value || value?.trim().length === 0
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
