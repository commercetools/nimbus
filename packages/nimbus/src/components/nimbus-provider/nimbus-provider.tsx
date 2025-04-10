"use client";

import {
  ChakraProvider,
  // defaultSystem as defaultSystemChakra,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "../../theme";
import { useEffect, useState } from "react";

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

export function NimbusProvider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider enableSystem={false} {...props}>
        <>{children}</>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
