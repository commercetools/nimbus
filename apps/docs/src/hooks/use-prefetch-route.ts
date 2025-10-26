/**
 * Route Prefetching Hook
 *
 * Prefetches route data on link hover for instant navigation
 */

import { useCallback } from "react";

/**
 * Prefetch a route's data on hover
 */
export function usePrefetchRoute() {
  const prefetch = useCallback((docId: string) => {
    // Prefetch the route JSON
    import(`@/data/routes/${docId}.json`).catch(() => {
      // Silent fail - prefetch is optional
    });
  }, []);

  return prefetch;
}
