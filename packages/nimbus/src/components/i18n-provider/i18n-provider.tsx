import { I18nProvider as RaI18nProvider } from "react-aria";
import type { NimbusI18nProviderProps } from "./i18n-provider.types";

/**
 * NimbusI18nProvider component that provides internationalization context for React Aria components.
 * This is a proxy component that wraps React Aria's I18nProvider.
 *
 * @example
 * ```tsx
 * <NimbusI18nProvider locale="de-DE">
 *   <DatePicker />
 * </NimbusI18nProvider>
 * ```
 */
export const NimbusI18nProvider = ({
  locale,
  children,
}: NimbusI18nProviderProps) => {
  return <RaI18nProvider locale={locale}>{children}</RaI18nProvider>;
};

NimbusI18nProvider.displayName = "NimbusI18nProvider";
