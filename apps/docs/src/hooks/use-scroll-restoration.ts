/**
 * Scroll Restoration Hook
 *
 * Saves and restores scroll positions when navigating between routes.
 * Skips restoration when a hash anchor is present in the URL.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Store scroll positions for each route
const scrollPositions = new Map<string, number>();

export function useScrollRestoration() {
  const location = useLocation();
  const isRestoringRef = useRef(false);

  useEffect(() => {
    // Get the scroll container
    const scrollContainer = document.getElementById("main");
    if (!scrollContainer) {
      return;
    }

    // Save current scroll position before navigating away
    const handleBeforeUnload = () => {
      scrollPositions.set(location.pathname, scrollContainer.scrollTop);
    };

    // Skip scroll restoration if there's a hash in the URL
    // (let useHashNavigation handle it instead)
    if (location.hash) {
      return;
    }

    // Restore scroll position when location changes
    if (!isRestoringRef.current) {
      const savedPosition = scrollPositions.get(location.pathname);

      if (savedPosition !== undefined) {
        // Restore saved position
        isRestoringRef.current = true;
        requestAnimationFrame(() => {
          scrollContainer.scrollTo(0, savedPosition);
          isRestoringRef.current = false;
        });
      } else {
        // Scroll to top for new routes
        scrollContainer.scrollTo(0, 0);
      }
    }

    // Save scroll position on route changes
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      scrollPositions.set(location.pathname, scrollContainer.scrollTop);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname, location.hash]);
}
