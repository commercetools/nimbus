import { useEffect, useState, Fragment } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { I18nProvider, RouterProvider } from "react-aria";
import { system } from "../../theme";
import type { TypedNimbusRouterConfig } from "./router-types";

// Router configuration interface matching react-aria's expectations
export interface NimbusRouterConfig {
  /**
   * Function to programmatically navigate to a new route.
   * This should be the navigate function from your client-side router.
   *
   * @example
   * // React Router
   * const navigate = useNavigate();
   * <NimbusProvider router={{ navigate }} />
   *
   * @example
   * // Next.js App Router
   * const router = useRouter();
   * <NimbusProvider router={{ navigate: router.push }} />
   */
  navigate: (href: string, routerOptions?: any) => void;

  /**
   * Optional function to transform hrefs before they are used.
   * Useful for prepending base paths or other URL transformations.
   *
   * @example
   * // Next.js with basePath
   * const useHref = (href: string) => process.env.BASE_PATH + href;
   * <NimbusProvider router={{ navigate, useHref }} />
   */
  useHref?: (href: string) => string;
}

export interface NimbusProviderProps extends ColorModeProviderProps {
  /**
   * Optional locale for internationalization.
   * Expects a [BCP47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., 'en-US', 'de-DE', 'fr-FR').
   * Defaults to the user's browser locale if not provided.
   */
  locale?: string;
  /**
   * Optional router configuration object for client-side navigation.
   * When provided, all nimbus components with href props will use client-side routing.
   * - `navigate`: Function to programmatically navigate to routes.
   * - `useHref`: Optional function to transform hrefs (useful for base paths).
   */
  router?: NimbusRouterConfig | TypedNimbusRouterConfig;
}

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState(getCurrentColorScheme());

  // Helper function to get the current color-scheme from the <html> tag
  function getCurrentColorScheme() {
    return (
      document.documentElement.style.getPropertyValue("color-scheme") ||
      localStorage.getItem("theme") ||
      "light"
    );
  }

  useEffect(() => {
    const htmlElement = document.documentElement;

    const observer = new MutationObserver(() => {
      const newColorScheme = getCurrentColorScheme();
      setColorScheme(newColorScheme);
    });

    // Observe changes to the 'style' attribute of the <html> element
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  return colorScheme;
}

export function NimbusProvider({
  children,
  locale,
  router,
  ...props
}: NimbusProviderProps) {
  // Inner content with all the existing providers
  const content = (
    <ChakraProvider value={system}>
      <ColorModeProvider enableSystem={false} {...props}>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );

  // If router config is provided, wrap with RouterProvider for client-side routing
  if (router) {
    return <RouterProvider {...router}>{content}</RouterProvider>;
  }

  // Default behavior when no router is configured
  return content;
}
