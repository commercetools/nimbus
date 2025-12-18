import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react/styled-system";
import { RouterProvider } from "react-aria";
import { IntlProvider } from "react-intl";
import { NimbusI18nProvider } from "@/components/nimbus-i18n-provider";
import { system } from "@/theme";
import { getMessagesForLocale, type IntlMessages } from "@/utils/i18n";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

/**
 * # NimbusProvider
 *
 * Provides an environment for the rest of the components to work in.
 *
 * Automatically loads Nimbus translation messages if the `messages` prop is not provided.

 *
 * @see {@link https://nimbus-documentation.vercel.app/components/utilities/nimbusprovider}
 */
export function NimbusProvider({
  children,
  locale,
  messages,
  router,
  ...props
}: NimbusProviderProps) {
  const resolvedLocale = locale ?? navigator.language;
  const [loadedMessages, setLoadedMessages] = useState<IntlMessages>({});
  const [isLoading, setIsLoading] = useState(!messages);

  // Auto-load messages if not provided by consumer
  useEffect(() => {
    if (!messages) {
      setIsLoading(true);
      getMessagesForLocale(resolvedLocale)
        .then((msgs) => {
          setLoadedMessages(msgs);
          setIsLoading(false);
        })
        .catch(() => {
          // Fallback to empty messages on error to prevent blocking render
          setLoadedMessages({});
          setIsLoading(false);
        });
    }
  }, [messages, resolvedLocale]);

  // Use provided messages or auto-loaded messages
  const finalMessages = messages ?? loadedMessages;

  // This prevents MISSING_TRANSLATION errors during initial render
  if (!messages && isLoading) {
    return null;
  }

  // Inner content with all the existing providers
  const content = (
    <IntlProvider
      locale={resolvedLocale}
      messages={finalMessages}
      defaultLocale="en"
    >
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
