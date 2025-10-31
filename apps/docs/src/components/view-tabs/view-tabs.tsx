import { useCallback, useEffect, useMemo, useState } from "react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { baseRoute, viewKey } = useRouteInfo();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Determine active view - default to first tab only when at base route
  // or when viewKey doesn't match any tab
  const { defaultView, activeView } = useMemo(() => {
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

  // Handle tab selection - navigate to the corresponding route
  const handleSelectionChange = useCallback(
    (key: string | number) => {
      const selectedKey = String(key);

      // Guard: Only navigate if the selected key is different from the current active view
      // This prevents navigation loops when the selectedKey prop updates
      if (selectedKey === activeView) {
        return;
      }

      const basePath = `/${baseRoute}`;
      const targetPath =
        selectedKey === defaultView ? basePath : `${basePath}/${selectedKey}`;
      const newPath = `${targetPath}${location.hash ?? ""}`;

      navigate(newPath);
    },
    [activeView, baseRoute, defaultView, location.hash, navigate]
  );

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
      <Tabs.Root
        selectedKey={activeView}
        onSelectionChange={handleSelectionChange}
        variant="pills"
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.key} id={tab.key}>
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
};
