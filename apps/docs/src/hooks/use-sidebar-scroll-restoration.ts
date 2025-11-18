/**
 * Sidebar Scroll Restoration Hook
 *
 * Preserves the sidebar scroll position during navigation
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const DEBUG = false; // Set to true to enable debug logging

export function useSidebarScrollRestoration(
  sidebarId: string = "app-frame-left-nav"
) {
  const location = useLocation();
  const scrollPositionRef = useRef<number>(0);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const previousTopLevelRef = useRef<string>("");

  // Initialize sidebar reference
  useEffect(() => {
    const sidebar = document.getElementById(sidebarId);
    sidebarRef.current = sidebar;

    if (DEBUG) {
      console.log("[SidebarScroll] Sidebar element found:", !!sidebar);
    }
  }, [sidebarId]);

  // Save scroll position continuously
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const saveScroll = () => {
      const newScroll = sidebar.scrollTop;
      if (scrollPositionRef.current !== newScroll) {
        if (DEBUG) {
          console.log("[SidebarScroll] Saving scroll position:", newScroll);
        }
        scrollPositionRef.current = newScroll;
      }
    };

    // Save on scroll
    sidebar.addEventListener("scroll", saveScroll, { passive: true });

    return () => {
      sidebar.removeEventListener("scroll", saveScroll);
    };
  }, []);

  // Restore scroll on navigation
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Extract top-level section from pathname (e.g., "/components/..." -> "components")
    const pathParts = location.pathname.split("/").filter(Boolean);
    const currentTopLevel = pathParts[0] || "";

    // Check if top-level section changed
    const topLevelChanged =
      previousTopLevelRef.current !== "" &&
      previousTopLevelRef.current !== currentTopLevel;

    if (DEBUG) {
      console.log(
        "[SidebarScroll] Navigation detected. Previous:",
        previousTopLevelRef.current,
        "Current:",
        currentTopLevel,
        "Changed:",
        topLevelChanged
      );
    }

    // Determine scroll position
    let savedScroll = 0;

    if (!topLevelChanged) {
      // Same section - restore scroll position
      savedScroll = scrollPositionRef.current;
      const sessionScroll = sessionStorage.getItem("sidebar-scroll");
      if (sessionScroll) {
        savedScroll = parseInt(sessionScroll, 10);
        scrollPositionRef.current = savedScroll;
      }
    } else {
      // Different section - reset to top
      scrollPositionRef.current = 0;
      sessionStorage.setItem("sidebar-scroll", "0");
    }

    // Update previous top level
    previousTopLevelRef.current = currentTopLevel;

    if (DEBUG) {
      console.log(
        "[SidebarScroll] Current scroll:",
        sidebar.scrollTop,
        "Target scroll:",
        savedScroll
      );
    }

    // Restore immediately
    sidebar.scrollTop = savedScroll;

    // Only monitor and restore if we're preserving scroll (not resetting to top)
    if (savedScroll > 0 && !topLevelChanged) {
      // Keep checking and restoring for the next few frames
      let frameCount = 0;
      const maxFrames = 30; // Check for ~500ms

      const restoreScroll = () => {
        if (!sidebar) return;

        const currentScroll = sidebar.scrollTop;

        if (currentScroll !== savedScroll && frameCount < maxFrames) {
          if (DEBUG && currentScroll === 0) {
            console.log(
              "[SidebarScroll] Detected reset to 0, restoring to:",
              savedScroll
            );
          }
          sidebar.scrollTop = savedScroll;
          frameCount++;
          requestAnimationFrame(restoreScroll);
        }
      };

      requestAnimationFrame(restoreScroll);

      // Also use timeouts as backup
      const timeouts = [50, 100, 200, 300].map((delay) =>
        setTimeout(() => {
          if (sidebar && sidebar.scrollTop !== savedScroll) {
            if (DEBUG) {
              console.log(`[SidebarScroll] Timeout restore at ${delay}ms`);
            }
            sidebar.scrollTop = savedScroll;
          }
        }, delay)
      );

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [location.pathname]);
}
