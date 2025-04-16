import { useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import { activeRouteAtom } from "@/atoms/route";
import { scrollToAnchor } from "@/utils/scroll-to-anchor";

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
      const route = location.pathname.slice(1);
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

    const currentRoute = location.pathname.slice(1);
    const routeChanged = currentRoute !== activeRoute;

    if (routeChanged) {
      history.pushState(
        { activeRoute },
        "",
        "/" + activeRoute + window.location.hash
      );
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
