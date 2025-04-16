import { useState, useEffect, useRef } from "react";

type SidebarStylesType = {
  position: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top: number | string;
  height: string;
  overflowY: "auto" | "hidden" | "scroll" | "visible";
  display: "flex";
  flexDirection: "column";
  bottom?: string;
};

/**
 * Hook to handle sticky scroll behavior for sidebars
 * Sidebar should scroll with content until it reaches the end, then stick to bottom
 *
 * @returns An object containing the ref to attach to sidebar and calculated styles
 */
export function useStickyScroll() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarStyles, setSidebarStyles] = useState<SidebarStylesType>({
    position: "sticky",
    top: 0,
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  });

  useEffect(() => {
    if (!sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    const checkStickyPosition = () => {
      // If the sidebar is shorter than the viewport, no need for special handling
      if (sidebar.scrollHeight <= window.innerHeight) return;

      const scrollHeight = sidebar.scrollHeight;
      const offsetHeight = sidebar.offsetHeight;
      const scrollBottom = scrollHeight - offsetHeight - sidebar.scrollTop;

      // Check if we've scrolled to the end of the content
      if (scrollBottom <= 0) {
        // When at bottom of content, let it stick naturally (don't move with scroll)
        setSidebarStyles((prev) => ({
          ...prev,
          position: "sticky",
          bottom: "auto",
          top: `${window.innerHeight - scrollHeight}px`,
        }));
      } else {
        // Reset to normal sticky behavior when not at the bottom
        setSidebarStyles((prev) => ({
          ...prev,
          position: "sticky",
          bottom: "auto",
          top: 0,
        }));
      }
    };

    // Check position initially
    checkStickyPosition();

    // Add event listeners
    sidebar.addEventListener("scroll", checkStickyPosition);
    window.addEventListener("scroll", checkStickyPosition);
    window.addEventListener("resize", checkStickyPosition);

    // Cleanup
    return () => {
      sidebar.removeEventListener("scroll", checkStickyPosition);
      window.removeEventListener("scroll", checkStickyPosition);
      window.removeEventListener("resize", checkStickyPosition);
    };
  }, []);

  return { sidebarRef, sidebarStyles };
}

/**
 * Variation of useStickyScroll that allows independent handling of multiple sidebars
 *
 * @returns Function to create sidebar hooks with unique IDs
 */
export function createSidebarHook() {
  return () => useStickyScroll();
}
