import { type ReactNode } from "react";
import {
  render as rtlRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { NimbusProvider } from "@/components";
import { userEvent as baseUserEvent } from "@testing-library/user-event";

/**
 * Loads compiled translation messages for the specified locale.
 * Handles both base locales (e.g., 'en') and region-specific codes (e.g., 'en-US').
 * Returns an object containing the loaded messages and normalized locale code.
 */
const getMessagesForLocale = (locale: string) => {
  switch (locale) {
    case "de":
    case "de-DE":
      return {
        messages: require("@commercetools/nimbus-i18n/compiled-data/de.json"),
        locale: "de",
      };
    case "es":
    case "es-ES":
      return {
        messages: require("@commercetools/nimbus-i18n/compiled-data/es.json"),
        locale: "es",
      };
    case "fr-FR":
      return {
        messages: require("@commercetools/nimbus-i18n/compiled-data/fr-FR.json"),
        locale: "fr-FR",
      };
    case "pt-BR":
      return {
        messages: require("@commercetools/nimbus-i18n/compiled-data/pt-BR.json"),
        locale: "pt-BR",
      };
    default:
      return {
        messages: require("@commercetools/nimbus-i18n/compiled-data/en.json"),
        locale: "en",
      };
  }
};

/**
 * Options for customizing test rendering behavior
 */
export type CustomRenderOptions = RenderOptions & {
  /**
   * Locale for internationalization
   * @default 'en'
   */
  locale?: string;
};

/**
 * Custom render function that wraps components with NimbusProvider.
 * Automatically provides translation messages and normalized locale to all components.
 * This ensures components using react-intl have access to translations during testing.
 */
const renderWithProvider = (
  ui: ReactNode,
  { locale = "en", ...options }: CustomRenderOptions = {}
): RenderResult => {
  const { messages, locale: normalizedLocale } = getMessagesForLocale(locale);

  return rtlRender(
    <NimbusProvider locale={normalizedLocale} messages={messages}>
      {ui}
    </NimbusProvider>,
    options
  );
};

// Re-export everything from @testing-library/react
// Note: This includes act from @testing-library/react, which is the correct
// act to use in tests (it wraps React's act with additional testing utilities)
export * from "@testing-library/react";

// Export userEvent instance
export const userEvent = baseUserEvent.setup();

// Override the default render with our custom renderWithProvider
// This allows tests to just import { render } from "@/test/utils"
// and automatically get NimbusProvider wrapping
export { renderWithProvider as render };

// Also export the original RTL render as renderWithoutProvider
// in case tests specifically need it
export { rtlRender as renderWithoutProvider };
