/**
 * Scroll Restoration Hook
 *
 * Saves and restores scroll positions when navigating between routes
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Store scroll positions for each route
const scrollPositions = new Map<string, number>();

export function useScrollRestoration() {
  const location = useLocation();
  const isRestoringRef = useRef(false);

  useEffect(() => {
    // Save current scroll position before navigating away
    const handleBeforeUnload = () => {
      scrollPositions.set(location.pathname, window.scrollY);
    };

    // Restore scroll position when location changes
    if (!isRestoringRef.current) {
      const savedPosition = scrollPositions.get(location.pathname);

      if (savedPosition !== undefined) {
        // Restore saved position
        isRestoringRef.current = true;
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition);
          isRestoringRef.current = false;
        });
      } else {
        // Scroll to top for new routes
        window.scrollTo(0, 0);
      }
    }

    // Save scroll position on route changes
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      scrollPositions.set(location.pathname, window.scrollY);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);
}
