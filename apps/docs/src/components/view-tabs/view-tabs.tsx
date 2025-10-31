import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Link } from "@commercetools/nimbus";
import type { TabMetadata } from "@/types";
import { useRouteInfo } from "@/hooks/use-route-info";

export type ViewType = TabMetadata["key"];

interface ViewTabsProps {
  /**
   * Array of tab metadata from the document
   */
  tabs: TabMetadata[];
  /**
   * Callback when active view changes
   */
  onViewChange?: (viewKey: string) => void;
}

/**
 * ViewTabs component for switching between different documentation views.
 * Tabs are dynamically generated based on the document's available views.
 * Syncs with URL subroutes (/{viewKey}).
 */
export const ViewTabs = ({ tabs, onViewChange }: ViewTabsProps) => {
  const location = useLocation();
  const { baseRoute, viewKey } = useRouteInfo();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Determine active view - default to first tab if param is invalid
  const { defaultView, activeView } = useMemo(() => {
    const fallback = tabs[0]?.key || "overview";
    const matchedTab = tabs.find((tab) => tab.key === viewKey);

    return {
      defaultView: fallback,
      activeView: matchedTab?.key ?? fallback,
    };
  }, [tabs, viewKey]);

  // Handle scroll direction to show/hide tabs
  useEffect(() => {
    const SCROLL_THRESHOLD = 5; // Minimum scroll distance to trigger hide/show
    const mainElement = document.getElementById("main");

    if (!mainElement) return;

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);

      // Ignore small scroll changes to avoid flickering
      if (scrollDiff < SCROLL_THRESHOLD) {
        return;
      }

      // Show tabs if at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    mainElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mainElement.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <Box
      mx="auto"
      id="floating-nav"
      bg="bg/75"
      borderRadius="full"
      padding="200"
      backdropFilter="blur({sizes.500})"
      position="sticky"
      top="0"
      zIndex="1"
      css={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        opacity: isVisible ? 1 : 0,
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
      }}
    >
      <Box display="flex" gap="200" justifyContent="center">
        {tabs.map((tab) => {
          const isActive = tab.key === activeView;
          const basePath = `/${baseRoute}`;
          const targetPath =
            tab.key === defaultView ? basePath : `${basePath}/${tab.key}`;
          const href = `${targetPath}${location.hash ?? ""}`;

          return (
            <Link
              key={tab.key}
              href={href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onViewChange?.(tab.key)}
            >
              {tab.title}
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};
