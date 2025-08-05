import { useLocale } from "react-aria";
import { useState, useEffect } from "react";
import coreStrings from "./data/core.json";

// Import language files dynamically
const loadLanguageStrings = async (locale: string) => {
  const language = locale.split("-")[0];
  const region = locale.split("-")[1];

  try {
    switch (language) {
      case "en":
        return (await import("./data/en-US.json")).default;
      case "de":
        return (await import("./data/de-DE.json")).default;
      case "es":
        return (await import("./data/es-ES.json")).default;
      case "fr":
        return (await import("./data/fr-FR.json")).default;
      case "pt":
        return (await import("./data/pt-BR.json")).default;
      default:
        return coreStrings;
    }
  } catch {
    return coreStrings;
  }
};

/**
 * Nimbus Internationalization Hook
 *
 * Provides translation functionality for Nimbus design system components.
 * Uses React Aria's built-in i18n hooks for optimal performance and bundle size.
 *
 * This implements a custom hook approach:
 * 1. useLocale - Get current locale from React Aria
 * 2. Custom string dictionary management - Dynamic loading of language files
 * 3. Custom string formatting - Simple variable replacement for dynamic content
 *
 * @returns Object with translation functions and current locale
 */
export const useNimbusIntl = () => {
  // Hook 1: useLocale - Get current locale from React Aria
  const { locale } = useLocale();
  const [strings, setStrings] = useState(coreStrings);

  // Custom function: getStringDictionary - Get string dictionary for current locale
  const getStringDictionary = () => {
    return strings;
  };

  // Load language strings when locale changes
  useEffect(() => {
    const loadStrings = async () => {
      const newStrings = await loadLanguageStrings(locale);
      setStrings(newStrings);
    };
    loadStrings();
  }, [locale]);

  // Custom function: formatString - Format strings with ICU message syntax
  // This allows dynamic messages where parts of the text can change based on variables
  // Example: formatString("welcome.message", { name: "John" })
  // where "welcome.message" = "Welcome, {name}!" → "Welcome, John!"
  // Note: We don't have any examples of this in our current translation files yet
  const formatString = (key: string, values?: Record<string, any>) => {
    const strings = getStringDictionary();
    const message = strings[key as keyof typeof coreStrings]?.string || key;

    if (values && message) {
      // Simple ICU message formatting for basic cases
      let formattedMessage = message;
      Object.entries(values).forEach(([key, value]) => {
        formattedMessage = formattedMessage.replace(`{${key}}`, String(value));
      });
      return formattedMessage;
    }

    return message;
  };

  return {
    /**
     * Translate a string key with optional values
     * @param key - The string key to translate
     * @param values - Optional values for ICU message formatting
     * @returns The translated string
     */
    translate: (key: string, values?: Record<string, any>) => {
      return formatString(key, values);
    },

    /**
     * Get a raw string without formatting
     * Useful for aria-labels and other simple string needs
     * @param key - The string key to get
     * @returns The raw translated string
     */
    getString: (key: string) => {
      const strings = getStringDictionary();
      return strings[key as keyof typeof coreStrings]?.string || key;
    },

    /**
     * Check if a string key exists in the current locale
     * @param key - The string key to check
     * @returns True if the key exists
     */
    hasString: (key: string) => {
      const strings = getStringDictionary();
      return key in strings;
    },

    /**
     * Get the current locale
     * @returns The current locale string (e.g., 'en-US', 'de-DE')
     */
    locale,

    /**
     * Get the current language code
     * @returns The language part of the locale (e.g., 'en', 'de')
     */
    language: locale.split("-")[0],
  };
};
