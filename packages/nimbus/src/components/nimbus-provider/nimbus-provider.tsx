import { ChakraProvider } from "@chakra-ui/react";
import { I18nProvider, RouterProvider } from "react-aria";
import { system } from "@/theme";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

export function NimbusProvider({
  children,
  locale,
  router,
  ...props
}: NimbusProviderProps) {
  // Inner content with all the existing providers
  const content = (
    <ChakraProvider value={system}>
      <NimbusColorModeProvider enableSystem={false} {...props}>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </NimbusColorModeProvider>
    </ChakraProvider>
  );

  // If router config is provided, wrap with RouterProvider for client-side routing
  if (router) {
    return <RouterProvider {...router}>{content}</RouterProvider>;
  }

  // Default behavior when no router is configured
  return content;
}
