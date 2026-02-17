import { ChakraProvider } from "@chakra-ui/react/styled-system";
import { RouterProvider } from "react-aria";
import { NimbusI18nProvider } from "@/components/nimbus-i18n-provider";
import { system } from "@/theme";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

/**
 * Internal component that loads Inter font from Google Fonts.
 * React 19 automatically hoists these link tags to the document head.
 */
function InterFontLoader() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
        data-nimbus-fonts=""
      />
    </>
  );
}

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
  // Inner content with all the existing providers
  const content = (
    <>
      {loadFonts && <InterFontLoader />}
      <ChakraProvider value={system}>
        <NimbusColorModeProvider enableSystem={false} {...props}>
          <NimbusI18nProvider locale={locale}>{children}</NimbusI18nProvider>
        </NimbusColorModeProvider>
      </ChakraProvider>
    </>
  );

  // If router config is provided, wrap with RouterProvider for client-side routing
  if (router) {
    return <RouterProvider {...router}>{content}</RouterProvider>;
  }

  // Default behavior when no router is configured
  return content;
}
