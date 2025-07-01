import type { ThemeProviderProps } from "next-themes";

/**
 * TypeScript module augmentation for Nimbus router configuration.
 *
 * This allows consumers to extend the router configuration types
 * to match their specific router framework, providing better type safety.
 *
 * @example
 * // For React Router
 * import type { NavigateOptions } from 'react-router-dom';
 *
 * declare module '@commercetools/nimbus' {
 *   interface NimbusRouterConfig {
 *     routerOptions?: NavigateOptions;
 *   }
 * }
 *
 * @example
 * // For Next.js App Router
 * import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
 *
 * declare module '@commercetools/nimbus' {
 *   interface NimbusRouterConfig {
 *     routerOptions?: Parameters<AppRouterInstance['push']>[1];
 *   }
 * }
 */

declare global {
  namespace Nimbus {
    interface RouterConfig {
      // This can be augmented by consumers
    }
  }
}

// Default router options type (can be overridden via module augmentation)
export type RouterOptions = Nimbus.RouterConfig extends { routerOptions: any }
  ? Nimbus.RouterConfig["routerOptions"]
  : any;

// Enhanced router configuration with proper typing
export interface TypedNimbusRouterConfig {
  navigate: (href: string, routerOptions?: RouterOptions) => void;
  useHref?: (href: string) => string;
}

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

// Color mode provider props
export interface ColorModeProviderProps extends ThemeProviderProps {}

// Main provider props
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
