import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Tabs } from "@commercetools/nimbus";
import type { TabMetadata } from "@/types";
import { useRouteInfo } from "@/hooks/use-route-info";

export type ViewType = TabMetadata["key"];

interface ViewTabsProps {
  /**
   * Array of tab metadata from the document
   */
  tabs: TabMetadata[];
}

/**
 * ViewTabs component for switching between different documentation views.
 * Tabs are dynamically generated based on the document's available views.
 * Syncs with URL subroutes (/{viewKey}). Navigation is controlled entirely
 * through URL state - clicking a tab updates the URL, and the active tab
 * follows the URL.
 */
export const ViewTabs = ({ tabs }: ViewTabsProps) => {
  const { baseRoute, viewKey } = useRouteInfo();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Determine active view - needed to highlight the active tab
  const { activeView } = useMemo(() => {
    const fallback = tabs[0]?.key || "overview";

    // If no viewKey is present (at base route), use default
    if (!viewKey) {
      return {
        defaultView: fallback,
        activeView: fallback,
      };
    }

    // Find matching tab for the viewKey
    const matchedTab = tabs.find((tab) => tab.key === viewKey);

    // If viewKey exists but doesn't match any tab, fall back
    // This handles invalid viewKeys in URL
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
      <Tabs.Root selectedKey={activeView} variant="pills">
        <Tabs.List>
          {tabs.map((tab) => {
            const isOverviewTab = tab.key === "overview";
            const href = isOverviewTab
              ? `/${baseRoute}`
              : `/${baseRoute}/${tab.key}`;
            return (
              // @ts-expect-error - href on tab is not properly typed
              <Tabs.Tab href={href} key={tab.key} id={tab.key}>
                {tab.title}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
};
