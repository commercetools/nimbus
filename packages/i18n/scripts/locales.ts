/**
 * Shared locale configuration for i18n build pipeline
 *
 * This is the single source of truth for supported locales across:
 * - Build scripts (transform, split, compile, generate-dictionaries)
 * - Vite config (optimize-locales-plugin)
 *
 * To add or remove a locale, update this file only.
 */

export const SUPPORTED_LOCALES = [
  { code: "en", bcp47: "en-US", importName: "en" },
  { code: "de", bcp47: "de-DE", importName: "de" },
  { code: "es", bcp47: "es-ES", importName: "es" },
  { code: "fr-FR", bcp47: "fr-FR", importName: "fr" },
  { code: "pt-BR", bcp47: "pt-BR", importName: "pt" },
] as const;

/**
 * Locale codes for scripts that need simple string arrays
 * Used by: transform-to-icu.ts, split-by-component.ts, compile-component-messages.ts
 */
export const LOCALE_CODES = SUPPORTED_LOCALES.map((locale) => locale.code) as [
  string,
  ...string[],
];

/**
 * BCP47 locale codes for optimize-locales-plugin
 * Used by: packages/nimbus/vite.config.ts
 */
export const LOCALE_BCP47_CODES = SUPPORTED_LOCALES.map(
  (locale) => locale.bcp47
) as [string, ...string[]];
