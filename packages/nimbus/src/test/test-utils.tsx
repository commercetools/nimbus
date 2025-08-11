import { render, type RenderOptions } from "@testing-library/react";
import { IntlProvider } from "react-intl";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: string;
}

const getMessagesForLocale = (locale: string) => {
  const language = locale.split("-")[0];

  try {
    switch (language) {
      case "de":
        return require("../i18n/data/de.json");
      case "en":
        return require("../i18n/data/en.json");
      case "fr":
        return require("../i18n/data/fr-FR.json");
      default:
        return require("../i18n/data/core.json");
    }
  } catch {
    return require("../i18n/data/core.json");
  }
};

const formatTranslations = (messages: any): Record<string, string> => {
  return Object.entries(messages).reduce(
    (formattedMessages, [messageKey, messageValue]) => ({
      ...formattedMessages,
      [messageKey]: (messageValue as any).string ?? messageValue,
    }),
    {}
  );
};

const customRender = (
  ui: React.ReactElement,
  { locale = "en", ...renderOptions }: CustomRenderOptions = {}
) => {
  const rawMessages = getMessagesForLocale(locale);
  const messages = formatTranslations(rawMessages);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
