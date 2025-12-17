/**
 * i18n Utilities
 *
 * Provides utilities for loading Nimbus translation messages from @commercetools/nimbus-i18n
 * for use with react-intl's IntlProvider.
 *
 * Abstracts away the complexity of:
 * - Locale normalization (e.g., "en-US" → "en", "de-DE" → "de")
 * - Bundler-compatible dynamic imports (uses static switch for proper code-splitting)
 * - Error handling and fallback to English for unsupported locales
 * - Module shape normalization (handles both { default: {...} } and direct object exports)
 *
 * Messages are loaded from the compiled-data directory in FormatJS AST format,
 * which react-intl can use directly for optimal performance.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import type { IntlConfig } from "react-intl";

/**
 * React-intl messages format (FormatJS AST or plain strings)
 */
export type IntlMessages = IntlConfig["messages"];

/**
 * Normalizes locale code to match available translation files.
 * Handles both base locales (e.g., 'en') and region-specific codes (e.g., 'en-US').
 *
 * @param locale - BCP47 language tag
 * @returns Normalized locale code
 */
function normalizeLocale(locale: string): string {
  // Handle region-specific codes by mapping to base locale
  if (locale.startsWith("de")) return "de";
  if (locale.startsWith("es")) return "es";
  if (locale.startsWith("pt")) return "pt-BR";
  if (locale.startsWith("fr")) return "fr-FR";
  // Default to English
  return "en";
}

/**
 * Loads compiled translation messages for a given locale from @commercetools/nimbus-i18n.
 * Uses the compiled-data format (FormatJS AST) which react-intl can use directly.
 *
 * @param locale - BCP47 language tag (e.g., "en", "de", "en-US", "fr-FR")
 * @returns Promise resolving to messages object in FormatJS AST format
 *
 * @example
 * ```tsx
 * import { getMessagesForLocale, NimbusProvider } from "@commercetools/nimbus";
 *
 * function App() {
 *   const [messages, setMessages] = useState({});
 *
 *   useEffect(() => {
 *     getMessagesForLocale("en").then(setMessages);
 *   }, []);
 *
 *   return (
 *     <NimbusProvider locale="en" messages={messages}>
 *       <YourApp />
 *     </NimbusProvider>
 *   );
 * }
 * ```
 */
export async function getMessagesForLocale(
  locale: string
): Promise<IntlMessages> {
  const normalizedLocale = normalizeLocale(locale);

  try {
    // Use static imports with switch statement for better bundler support
    // Dynamic imports with template literals don't work well with Vite/bundlers
    let messagesModule: { default: IntlMessages } | IntlMessages;

    switch (normalizedLocale) {
      case "de":
        messagesModule =
          await import("@commercetools/nimbus-i18n/compiled-data/de.json");
        break;
      case "es":
        messagesModule =
          await import("@commercetools/nimbus-i18n/compiled-data/es.json");
        break;
      case "fr-FR":
        messagesModule =
          await import("@commercetools/nimbus-i18n/compiled-data/fr-FR.json");
        break;
      case "pt-BR":
        messagesModule =
          await import("@commercetools/nimbus-i18n/compiled-data/pt-BR.json");
        break;
      case "en":
      default:
        messagesModule =
          await import("@commercetools/nimbus-i18n/compiled-data/en.json");
        break;
    }

    // Handle different module shapes - could be { default: {...} } or the object itself
    const messages = (messagesModule.default || messagesModule) as IntlMessages;

    return messages;
  } catch (error) {
    // Fallback to English
    if (normalizedLocale !== "en") {
      try {
        const messagesModule =
          await import("@commercetools/nimbus-i18n/compiled-data/en.json");
        return (messagesModule.default || messagesModule) as IntlMessages;
      } catch {
        return {};
      }
    }
    return {};
  }
}
