import { useEffect, useState } from "react";

/**
 * Hook that provides access to the current color scheme value.
 *
 * @experimental This hook is experimental and may change in future versions.
 *
 * This hook monitors the color-scheme CSS property on the document's HTML element
 * and returns the current value. It automatically updates when the color scheme changes,
 * either through direct style changes or theme updates stored in localStorage.
 *
 * The hook observes mutations to the HTML element's style attribute to detect
 * color scheme changes and re-renders the component when changes occur.
 *
 * @returns The current color scheme value as a string ('light', 'dark')
 */
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
