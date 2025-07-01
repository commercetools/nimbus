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

export {};
