import { useLocale } from "react-aria";
import { useState, useEffect } from "react";
import {
  LocalizedStringDictionary,
  LocalizedStringFormatter,
} from "@internationalized/string";
import coreTranslations from "../../i18n/data/core.json";

export interface TranslationMessages {
  [key: string]: string;
}

export interface TranslationOptions {
  locale?: string;
  messages?: TranslationMessages;
}

const loadLanguageStrings = async (locale: string) => {
  const language = locale.split("-")[0];

  try {
    switch (language) {
      case "de":
        return (await import("../../i18n/data/de.json")).default;
      case "en":
        return (await import("../../i18n/data/en.json")).default;
      case "fr":
        return (await import("../../i18n/data/fr-FR.json")).default;
      default:
        return coreTranslations;
    }
  } catch {
    return coreTranslations;
  }
};

export function useTranslations(options?: TranslationOptions) {
  const { locale: defaultLocale } = useLocale();
  const locale = options?.locale || defaultLocale;
  const customMessages = options?.messages || {};

  const [translations, setTranslations] = useState<any>(coreTranslations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      const localeTranslations = await loadLanguageStrings(locale);
      setTranslations(localeTranslations);
      setIsLoading(false);
    };

    loadTranslations();
  }, [locale]);

  // Convert translations to the format @internationalized/string expects
  const messages = Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [
      key,
      (value as any).string,
    ])
  );

  // Add custom messages (they override locale translations)
  const allMessages = {
    ...messages,
    ...customMessages,
  };

  // Convert string messages to function-based messages for variable substitution
  const functionMessages = Object.fromEntries(
    Object.entries(allMessages).map(([key, message]) => [
      key,
      (variables: Record<string, any> = {}) => {
        let result = message;
        Object.entries(variables).forEach(([varKey, value]) => {
          result = result.replace(
            new RegExp(`{${varKey}}`, "g"),
            String(value)
          );
        });
        return result;
      },
    ])
  );

  const dictionary = new LocalizedStringDictionary(
    { [locale]: functionMessages },
    locale
  );
  const formatter = new LocalizedStringFormatter(locale, dictionary);

  const translate = (key: string, variables?: Record<string, any>): string => {
    if (isLoading) {
      return key; // Return key while loading
    }

    try {
      return formatter.format(key, variables);
    } catch (error) {
      // Fallback to key if translation is missing
      console.warn(`Translation key "${key}" not found for locale "${locale}"`);
      return key;
    }
  };

  return { translate, locale, isLoading };
}
