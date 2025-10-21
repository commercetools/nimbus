import { useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import { activeRouteAtom } from "@/atoms/route";
import { scrollToAnchor } from "@/utils/scroll-to-anchor";

/**
 * Normalizes a route by removing leading/trailing slashes and handling empty routes.
 * @param route - The route string to normalize
 * @returns Normalized route string
 */
const normalizeRoute = (route: string): string => {
  // Remove leading and trailing slashes
  const cleaned = route.replace(/^\/+|\/+$/g, "");
  // Empty route becomes "home"
  return cleaned || "home";
};

/**
 * RouterProvider handles all routing-related functionality for the application,
 * including managing the active route state, handling browser history,
 * and scroll position for hash fragments.
 */
export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);

  // Handle hash fragments when route changes or on initial load
  const handleHashFragment = () => {
    // Get hash (without the # character)
    const hash = window.location.hash.slice(1);
    if (hash) {
      // We need a small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        scrollToAnchor(hash);
      }, 100);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const route = normalizeRoute(location.pathname);
      setActiveRoute(route);
      // Handle hash fragment when route changes
      handleHashFragment();
    };

    window.addEventListener("popstate", handleRouteChange);
    // Also listen for hashchange events
    window.addEventListener("hashchange", handleHashFragment);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleHashFragment);
    };
  }, [activeRoute, setActiveRoute]);

  useEffect(() => {
    if (!activeRoute) {
      setActiveRoute("home");
    }

    const currentRoute = normalizeRoute(location.pathname);
    const routeChanged = currentRoute !== activeRoute;

    if (routeChanged) {
      // When route changes, we should clear any existing hash
      history.pushState({ activeRoute }, "", "/" + activeRoute);

      // Reset scroll position to top when changing routes
      scrollToAnchor("root");

      // After route change is processed, handle hash fragment
      handleHashFragment();
    }
  }, [activeRoute, setActiveRoute]);

  // Handle hash fragment on initial page load
  useEffect(() => {
    handleHashFragment();
  }, []);

  return <>{children}</>;
};

// Export the component
export default RouterProvider;
