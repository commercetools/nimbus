import React, { useEffect, useState } from "react";
import type { Decorator } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

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

const formatTranslations = (messages: TranslationFile): TranslationObject => {
  return Object.entries(messages).reduce(
    (formattedMessages, [messageKey, messageValue]) => ({
      ...formattedMessages,
      [messageKey]: messageValue.string ?? messageValue,
    }),
    {}
  );
};

const getMessagesForLocale = async (
  locale: string
): Promise<TranslationFile> => {
  const language = locale.split("-")[0];

  try {
    switch (language) {
      case "de":
        return (await import("../src/i18n/data/de.json")).default;
      case "en":
        return (await import("../src/i18n/data/en.json")).default;
      case "fr":
        return (await import("../src/i18n/data/fr-FR.json")).default;
      default:
        return (await import("../src/i18n/data/core.json")).default;
    }
  } catch {
    return (await import("../src/i18n/data/core.json")).default;
  }
};

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
        // Fallback to core.json
        const coreMessages = await getMessagesForLocale("core");
        const normalizedMessages = formatTranslations(coreMessages);
        setMessages(normalizedMessages);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocale(locale);
  }, [locale]);

  if (isLoading) {
    return <div>Loading translations...</div>;
  }

  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="en">
      <Story {...context} />
    </IntlProvider>
  );
};
