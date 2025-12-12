import { ChakraProvider } from "@chakra-ui/react/styled-system";
import { RouterProvider } from "react-aria";
import { IntlProvider } from "react-intl";
import { NimbusI18nProvider } from "@/components/nimbus-i18n-provider";
import { system } from "@/theme";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";
import { loadI18nMessages } from "./utils/load-i18n-messages";

/**
 * # NimbusProvider
 *
 * Provides an environment for the rest of the components to work in.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/utilities/nimbusprovider}
 */
export function NimbusProvider({
  children,
  locale,
  router,
  ...props
}: NimbusProviderProps) {
  const resolvedLocale =
    locale ?? (typeof navigator !== "undefined" ? navigator.language : "en");

  // Load and format i18n messages for the resolved locale
  const { locale: intlLocale, messages } = loadI18nMessages(resolvedLocale);

  // Inner content with all the existing providers
  const content = (
    <IntlProvider locale={intlLocale} messages={messages} defaultLocale="en">
      <ChakraProvider value={system}>
        <NimbusColorModeProvider enableSystem={false} {...props}>
          <NimbusI18nProvider locale={locale}>{children}</NimbusI18nProvider>
        </NimbusColorModeProvider>
      </ChakraProvider>
    </IntlProvider>
  );

  // If router config is provided, wrap with RouterProvider for client-side routing
  if (router) {
    return <RouterProvider {...router}>{content}</RouterProvider>;
  }

  // Default behavior when no router is configured
  return content;
}
