import { useEffect, useState, Fragment } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import { I18nProvider, RouterProvider } from "react-aria";
import { system } from "../../theme";
import type {
  NimbusRouterConfig,
  NimbusProviderProps,
  TypedNimbusRouterConfig,
} from "./nimbus-provider.types";

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
