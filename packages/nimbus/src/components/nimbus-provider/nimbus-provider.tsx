import { ChakraProvider } from "@chakra-ui/react/styled-system";
import { RouterProvider } from "react-aria";
import { NimbusI18nProvider } from "@/components/nimbus-i18n-provider";
import { system } from "@/theme";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";
import { useFontLoader } from "./hooks/use-font-loader";

/**
 * # NimbusProvider
 *
 * Provides an environment for the rest of the components to work in.
 * Components use `useLocale()` from `react-aria-components` to get the locale.
 *
 * By default, loads Inter font from Google Fonts. Set `loadFonts={false}` if your
 * application already loads fonts.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/utilities/nimbusprovider}
 */
export function NimbusProvider({
  children,
  locale,
  router,
  loadFonts = true,
  ...props
}: NimbusProviderProps) {
  // Load Inter font from Google Fonts (unless disabled)
  useFontLoader(loadFonts);
  // Inner content with all the existing providers
  const content = (
    <ChakraProvider value={system}>
      <NimbusColorModeProvider enableSystem={false} {...props}>
        <NimbusI18nProvider locale={locale}>{children}</NimbusI18nProvider>
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
