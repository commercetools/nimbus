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

  // INITIALIZATION: On mount, sync atom FROM browser URL (one-time only)
  useEffect(() => {
    const currentRoute = location.pathname.slice(1) || "home";
    setActiveRoute(currentRoute);
    // Handle hash fragment on initial page load
    handleHashFragment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps = run once on mount

  // NAVIGATION: When activeRoute changes programmatically, sync browser TO atom
  useEffect(() => {
    // Skip if activeRoute is still empty (initialization not complete)
    if (!activeRoute) return;

    const currentBrowserRoute = location.pathname.slice(1);

    // Only update browser if atom value differs from browser
    // (means user navigated programmatically via setActiveRoute)
    if (currentBrowserRoute !== activeRoute) {
      history.pushState({ activeRoute }, "", "/" + activeRoute);
      scrollToAnchor("root");
      handleHashFragment();
    }
  }, [activeRoute]);

  // BROWSER NAVIGATION: Handle back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = location.pathname.slice(1) || "home";
      setActiveRoute(route);
      handleHashFragment();
    };

    const handleHashChange = () => {
      handleHashFragment();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [setActiveRoute]);

  return <>{children}</>;
};

// Export the component
export default RouterProvider;
