import { de, en, es, frFR, ptBR } from "../i18n-paths";

/**
 * Loads and formats i18n messages for a given locale
 *
 * @param locale - BCP47 locale code (e.g., "en-US", "fr-FR", "en")
 * @returns Formatted messages object ready for react-intl's IntlProvider
 */
export const loadI18nMessages = (locale: string) => {
  // Extract language code from BCP47 locale (e.g., "en-US" -> "en")
  const lang = locale.split("-")[0].toLowerCase();

  // Load translations for the language code
  const translations = { en, de, es, fr: frFR, pt: ptBR }[lang] ?? en;

  // Convert from extracted format { "key": { "string": "value" } } to react-intl format { "key": "value" }
  const messages = Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [
      key,
      value.string ?? value,
    ])
  );

  // Normalize locale for IntlProvider (fr/pt use full codes, others use language code)
  const normalizedLocale =
    lang === "fr" ? "fr-FR" : lang === "pt" ? "pt-BR" : lang;

  return { locale: normalizedLocale, messages };
};
