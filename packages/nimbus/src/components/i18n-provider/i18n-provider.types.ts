import type { ReactNode } from "react";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the NimbusI18nProvider component.
 * Provides internationalization context for React Aria components (dates, numbers, etc.).
 */
export type NimbusI18nProviderProps = {
  /**
   * BCP47 language code for internationalization (e.g., 'en-US', 'de-DE', 'es-ES')
   * This affects how dates, numbers, and other locale-specific content is formatted.
   */
  locale: string;

  /**
   * Child components to be wrapped with i18n context
   */
  children: ReactNode;
};
