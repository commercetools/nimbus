import { ChakraProvider } from "@chakra-ui/react/styled-system";
import { RouterProvider } from "react-aria";
import { IntlProvider } from "react-intl";
import { NimbusI18nProvider } from "@/components/nimbus-i18n-provider";
import { system } from "@/theme";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

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
  // Inner content with all the existing providers
  // If no locale is provided, use browser's locale as fallback
  const content = (
    <IntlProvider locale={locale ?? navigator.language} defaultLocale="en-US">
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
