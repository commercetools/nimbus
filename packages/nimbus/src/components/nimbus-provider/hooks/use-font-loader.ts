import { useEffect } from "react";

/**
 * URL for Google Fonts CSS API v2 to load Inter font family.
 * Loads specific font weights (100, 200, 300, 400, 500, 600, 700, 800, 900) matching Nimbus design tokens.
 */
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap";

/**
 * Creates a link element with specified attributes.
 *
 * @param rel - The relationship attribute (e.g., 'preconnect', 'stylesheet')
 * @param href - The URL to link to
 * @param crossOrigin - Whether to add crossorigin attribute
 * @returns Configured link element
 */
function createLinkElement(
  rel: string,
  href: string,
  crossOrigin = false
): HTMLLinkElement {
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (crossOrigin) {
    link.crossOrigin = "";
  }
  return link;
}

/**
 * Custom hook that loads Inter font from Google Fonts.
 *
 * Injects preconnect links and font stylesheet into document head when enabled.
 * Handles SSR compatibility, deduplication across multiple provider instances,
 * and cleanup on unmount.
 *
 * @param enabled - Whether to load fonts (default: true)
 *
 * @example
 * ```tsx
 * function NimbusProvider({ loadFonts = true }) {
 *   useFontLoader(loadFonts);
 *   return <div>...</div>;
 * }
 * ```
 */
export function useFontLoader(enabled: boolean): void {
  useEffect(() => {
    // SSR compatibility: only run in browser
    if (typeof document === "undefined") {
      return;
    }

    // Skip if fonts should not be loaded
    if (!enabled) {
      return;
    }

    // Deduplication: check if fonts are already loaded
    if (document.querySelector("[data-nimbus-fonts]")) {
      return;
    }

    // Create preconnect links for performance optimization
    const preconnect1 = createLinkElement(
      "preconnect",
      "https://fonts.googleapis.com"
    );
    const preconnect2 = createLinkElement(
      "preconnect",
      "https://fonts.gstatic.com",
      true // crossorigin
    );

    // Create stylesheet link with identifying attribute
    const stylesheet = createLinkElement("stylesheet", GOOGLE_FONTS_URL);
    stylesheet.setAttribute("data-nimbus-fonts", "");

    // Inject links into document head
    document.head.append(preconnect1, preconnect2, stylesheet);

    // Cleanup function: remove injected links on unmount
    return () => {
      preconnect1.remove();
      preconnect2.remove();
      stylesheet.remove();
    };
  }, [enabled]);
}
