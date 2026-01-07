import { useMemo } from "react";
import { useLocale } from "react-aria-components";
import {
  LocalizedStringDictionary,
  type LocalizedString,
  type LocalizedStrings,
} from "@internationalized/string";

/**
 * Normalizes BCP47 locale codes to match dictionary keys.
 *
 * Maps locale variants to supported dictionary keys:
 * - "en-US", "en-GB", "en" → "en"
 * - "de-DE", "de-AT", "de" → "de"
 * - "es-ES", "es" → "es"
 * - "fr-FR", "fr" → "fr-FR"
 * - "pt-BR", "pt" → "pt-BR"
 * - Unsupported locales → "en" (fallback)
 *
 * This is a shared utility for locale normalization across all message dictionaries.
 *
 * @param locale - BCP47 locale code from useLocale()
 * @returns Normalized locale key matching dictionary structure
 */
function normalizeLocale(locale: string): string {
  const supportedLocales = new Set(["en", "de", "es", "fr-FR", "pt-BR"]);
  if (supportedLocales.has(locale)) return locale;

  const langMap: Record<string, string> = {
    en: "en",
    de: "de",
    es: "es",
    fr: "fr-FR",
    pt: "pt-BR",
  };

  const lang = locale.split(/[-_]/)[0].toLowerCase();
  return langMap[lang] ?? "en";
}

/**
 * Formatter interface that provides a clean API for accessing localized messages.
 * Similar to React Aria's LocalizedStringFormatter but adapted for Nimbus's message structure.
 */
export interface LocalizedStringFormatter<K extends string = string> {
  /**
   * Formats a localized message string.
   *
   * @param key - The message key to retrieve
   * @param args - Optional variables for message interpolation
   * @returns The formatted localized string, or empty string if not found
   *
   * @example
   * ```tsx
   * const msg = useLocalizedStringFormatter(alertMessagesStrings);
   * const label = msg.format("dismiss"); // Simple message
   * const labelWithVars = msg.format("avatarLabel", { fullName: "John Doe" }); // Variable message
   * ```
   */
  format(key: K, args?: Record<string, string | number>): string;
}

/**
 * Provides localized string formatting for the current locale. Automatically updates when the locale changes.
 *
 * This hook is similar to React Aria's `useLocalizedStringFormatter` but adapted for Nimbus's
 * message dictionary structure with locale normalization.
 *
 * @param strings - A mapping of locales to localized strings by key (LocalizedStrings object)
 * @returns A formatter object with a `format` method for accessing localized messages
 * @throws Never throws - returns empty string on errors or missing messages
 *
 * @example
 * ```tsx
 * import { useLocalizedStringFormatter } from "@/hooks";
 * import { alertMessagesStrings } from "./alert.messages";
 *
 * export const AlertDismissButton = () => {
 *   const msg = useLocalizedStringFormatter(alertMessagesStrings);
 *
 *   return (
 *     <button aria-label={msg.format("dismiss")}>
 *       ...
 *     </button>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // With variables
 * const msg = useLocalizedStringFormatter(avatarMessagesStrings);
 * const label = msg.format("avatarLabel", { fullName: "John Doe" });
 * ```
 */
export function useLocalizedStringFormatter<
  K extends string = string,
  T extends LocalizedString = string,
>(strings: LocalizedStrings<K, T>): LocalizedStringFormatter<K> {
  const { locale } = useLocale();

  // Create dictionary instance and memoize formatter based on locale
  // Dictionary creation is lightweight, but memoization prevents unnecessary re-creation
  const formatter = useMemo(() => {
    const dictionary = new LocalizedStringDictionary(strings);
    const normalizedLocale = normalizeLocale(locale);

    return {
      format(key: K, args?: Record<string, string | number>): string {
        try {
          const message = dictionary.getStringForLocale(key, normalizedLocale);

          // Handle undefined/null case
          if (message == null) {
            return "";
          }

          // If message is a function (has variables), call it with args
          // Type guard ensures TypeScript knows this is callable
          if (typeof message === "function") {
            // LocalizedString functions accept (args, formatter?) signature
            // but our normalized functions only use args, so we can call with just args
            return (
              message as (args?: Record<string, string | number>) => string
            )(args ?? {});
          }

          // If message is a string (simple message), return it directly
          if (typeof message === "string") {
            return message;
          }
        } catch {
          // Message not found, return empty string
        }

        return "";
      },
    };
  }, [strings, locale]);

  return formatter;
}
