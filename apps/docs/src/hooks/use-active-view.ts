import { useRouteInfo } from "./use-route-info";

/**
 * Hook to manage the active documentation view.
 * Syncs with URL subroutes (/{viewKey}).
 *
 * @returns The current active view key (e.g., "overview", "api", "dev") or undefined if not set
 */
export const useActiveView = (): string | undefined => {
  const { viewKey, manifestRoute } = useRouteInfo();

  if (!viewKey || !manifestRoute?.tabs) {
    return undefined;
  }

  const isValidView = manifestRoute.tabs.some((tab) => tab.key === viewKey);

  return isValidView ? viewKey : undefined;
};
