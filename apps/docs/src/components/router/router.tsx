import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useEffect, useRef, useCallback } from "react";
import { activeRouteAtom } from "@/atoms/route";
import { isLoadingAtom } from "@/atoms/loading";
import { scrollToAnchor } from "@/utils/scroll-to-anchor";

/**
 * RouterProvider handles all routing-related functionality for the application,
 * including managing the active route state, handling browser history,
 * and scroll position for hash fragments.
 */
export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const isInitialMount = useRef(true);
  const lastProcessedRoute = useRef<string>("");

  // Handle hash fragments with requestAnimationFrame for better timing
  const handleHashFragment = useCallback(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        scrollToAnchor(hash);
      });
    }
  }, []);

  // Initialize route from URL on mount
  useEffect(() => {
    if (isInitialMount.current) {
      const initialRoute = window.location.pathname.slice(1) || "home";
      if (initialRoute !== activeRoute) {
        setActiveRoute(initialRoute);
      }
      lastProcessedRoute.current = initialRoute;

      // Handle hash fragment on initial load
      handleHashFragment();

      isInitialMount.current = false;
    }
  }, [activeRoute, setActiveRoute, handleHashFragment]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = window.location.pathname.slice(1) || "home";

      // Only update if route actually changed
      if (route !== lastProcessedRoute.current) {
        setIsLoading(true);
        lastProcessedRoute.current = route;
        setActiveRoute(route);

        // Scroll to top on route change, then handle hash
        requestAnimationFrame(() => {
          scrollToAnchor("root");
          handleHashFragment();
          // Clear loading state after navigation completes
          setTimeout(() => setIsLoading(false), 100);
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setActiveRoute, setIsLoading, handleHashFragment]);

  // Handle hash changes independently
  useEffect(() => {
    const handleHashChange = () => {
      handleHashFragment();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashFragment]);

  // Sync activeRoute changes to browser history
  useEffect(() => {
    // Skip if this is initial mount or route hasn't actually changed
    if (isInitialMount.current || activeRoute === lastProcessedRoute.current) {
      return;
    }

    const currentPath = window.location.pathname.slice(1) || "home";

    // Only update history if path is different from current URL
    if (currentPath !== activeRoute) {
      setIsLoading(true);
      lastProcessedRoute.current = activeRoute;
      const newPath = activeRoute ? `/${activeRoute}` : "/";

      history.pushState({ route: activeRoute }, "", newPath);

      // Scroll to top on programmatic route change
      requestAnimationFrame(() => {
        scrollToAnchor("root");
        // Clear loading state after navigation completes
        setTimeout(() => setIsLoading(false), 100);
      });
    }
  }, [activeRoute, setIsLoading]);

  return <>{children}</>;
};

// Export the component
export default RouterProvider;
