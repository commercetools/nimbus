import type { Decorator } from "@storybook/react-vite";
import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { default as en } from "../../../i18n/data/en.json";

/**
 * IntlProvider Decorator for Storybook
 *
 * Provides react-intl context to all stories, enabling i18n testing.
 * Allows switching between locales via the Storybook toolbar.
 *
 * Features:
 * - Dynamic locale switching via Storybook toolbar
 * - Lazy loading of translation files (except initial English)
 * - Loading state while fetching translations
 * - Graceful fallback to English on errors
 *
 * Notes:
 * - Requires language files to exist in packages/i18n/
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

const getMessagesForLocale = async (
  locale: string
): Promise<TranslationFile> => {
  try {
    switch (locale) {
      case "de":
        return (await import("../../../i18n/data/de.json")).default;
      case "en":
        return (await import("../../../i18n/data/en.json")).default;
      case "es":
        return (await import("../../../i18n/data/es.json")).default;
      case "fr-FR":
        return (await import("../../i18n/data/fr-FR.json")).default;
      case "pt-BR":
        return (await import("../../i18n/data/pt-BR.json")).default;
      default:
        return (await import("../../../i18n/data/en.json")).default;
    }
  } catch (error) {
    console.warn(
      `Failed to load messages for locale "${locale}", falling back to English:`,
      error
    );
    return (await import("../../../i18n/data/en.json")).default;
  }
};

export const WithIntlDecorator: Decorator = (Story, context) => {
  const locale = context.globals.locale || "en";
  const [messages, setMessages] = useState<TranslationObject>(
    formatTranslations(en)
  );

  useEffect(() => {
    async function fetchLocale(locale: string) {
      const messagesForLocale = await getMessagesForLocale(locale);

      const normalizedMessages = formatTranslations(messagesForLocale);
      setMessages(normalizedMessages);
    }

    fetchLocale(locale);
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="en">
      <Story {...context} />
    </IntlProvider>
  );
};
