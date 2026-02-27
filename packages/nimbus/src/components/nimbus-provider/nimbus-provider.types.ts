import type { ThemeProviderProps } from "next-themes";

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * TypeScript module augmentation interface for Nimbus router configuration.
 *
 * This allows consumers to extend the router configuration types
 * to match their specific router framework, providing better type safety.
 *
 * TODO: Document this in an mdx-file, available to consumers via the docs-app
 *
 * @example
 * // For React Router
 * import type { NavigateOptions } from 'react-router-dom';
 *
 * declare module '@commercetools/nimbus' {
 *   interface NimbusRouterOptionsBase {
 *     routerOptions?: NavigateOptions;
 *   }
 * }
 *
 * @example
 * // For Next.js App Router
 * import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
 *
 * declare module '@commercetools/nimbus' {
 *   interface NimbusRouterOptionsBase {
 *     routerOptions?: Parameters<AppRouterInstance['push']>[1];
 *   }
 * }
 */
// Base type for router options that can be extended via module augmentation
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NimbusRouterOptionsBase = {
  // This can be augmented by consumers via module augmentation
};

// Default router options type (can be overridden via module augmentation)
export type RouterOptions = NimbusRouterOptionsBase extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routerOptions: any;
}
  ? NimbusRouterOptionsBase["routerOptions"]
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any;

/**
 * Enhanced router configuration with proper typing
 */
export type TypedNimbusRouterConfig = {
  navigate: (href: string, routerOptions?: RouterOptions) => void;
  useHref?: (href: string) => string;
};

/**
 * Router configuration type matching react-aria's expectations
 */
export type NimbusRouterConfig = {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
};

/**
 * Color mode provider props inherited from next-themes
 */
export type ColorModeProviderProps = ThemeProviderProps;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Main props for the NimbusProvider component
 */
export type NimbusProviderProps = ColorModeProviderProps & {
  /**
   * Locale for internationalization support
   * Expects a [BCP47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., 'en-US', 'de-DE', 'fr-FR')
   * @default User's browser locale
   */
  locale?: string;
  /**
   * Router configuration for client-side navigation
   * When provided, all Nimbus components with href props will use client-side routing
   * - `navigate`: Function to programmatically navigate to routes
   * - `useHref`: Optional function to transform hrefs (useful for base paths)
   */
  router?: NimbusRouterConfig | TypedNimbusRouterConfig;
  /**
   * Load Inter font from Google Fonts. Set to false if fonts are loaded by host application.
   * @default true
   */
  loadFonts?: boolean;
};
