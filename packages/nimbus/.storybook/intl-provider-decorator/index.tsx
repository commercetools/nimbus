import type { Decorator } from "@storybook/react-vite";
import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";

/**
 * IntlProvider Decorator for Storybook
 *
 * Provides react-intl context to all stories, enabling i18n testing.
 * Allows switching between locales via the Storybook toolbar.
 *
 * Notes:
 * - Requires language files to exist in packages/i18n/
 * - Falls back to English if locale file is missing
 * - Only loads language files when needed (lazy loading)
 */

interface TranslationItem {
  developer_comment: string;
  string: string;
}

interface TranslationFile {
  [key: string]: TranslationItem;
}

interface TranslationObject {
  [key: string]: string;
}

/**
 * Converts the extracted translation format to react-intl format
 * Extracted format: { "key": { "string": "value" } }
 * React-intl format: { "key": "value" }
 */
const formatTranslations = (messages: TranslationFile) => {
  return Object.entries(messages).reduce(
    (messages, [messageKey, messageValue]) => ({
      ...messages,
      [messageKey]: messageValue.string ?? messageValue,
    }),
    {}
  );
};

/**
 * Dynamically loads translation files based on locale
 * Supports language codes like "en", "de", "fr" (strips region codes)
 * Falls back to English if locale is not supported or file is missing
 */
const getMessagesForLocale = async (
  locale: string
): Promise<TranslationFile> => {
  const language = locale.split("-")[0];

  try {
    switch (language) {
      case "de":
        return (await import("../../i18n/translated-data/de.json")).default;
      case "en":
        return (await import("../../i18n/translated-data/en.json")).default;
      case "fr":
        return (await import("../../i18n/translated-data/fr-FR.json")).default;
      // case "es":
      //   return (await import("../../../i18n/data/es.json")).default;
      // case "pt":
      //   return (await import("../../../i18n/data/pt-BR.json")).default;
      default:
        return (await import("../../i18n/translated-data/en.json")).default;
    }
  } catch {
    // Fallback to English if any import fails
    return (await import("../../i18n/translated-data/en.json")).default;
  }
};

/**
 * Storybook decorator that wraps all stories with IntlProvider
 *
 * Features:
 * - Dynamic locale switching via Storybook toolbar
 * - Lazy loading of translation files
 * - Loading state while fetching translations
 * - Graceful fallback to English on errors
 */
export const WithIntlDecorator: Decorator = (Story, context) => {
  const locale = context.globals.locale || "en";
  const [messages, setMessages] = useState<TranslationObject>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocale(locale: string) {
      try {
        const messagesForLocale = await getMessagesForLocale(locale);
        const normalizedMessages = formatTranslations(messagesForLocale);
        setMessages(normalizedMessages);
      } catch (error) {
        console.warn(`Failed to load messages for locale ${locale}`, error);
        // For tests, use empty messages instead of trying to load again
        setMessages({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocale(locale);
  }, [locale]);

  // If still loading, render with empty messages for tests
  if (isLoading) {
    return (
      <IntlProvider locale={locale} messages={{}} defaultLocale="en">
        <Story {...context} />
      </IntlProvider>
    );
  }

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="en">
      <Story {...context} />
    </IntlProvider>
  );
};
