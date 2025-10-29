import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Box, Tabs } from "@commercetools/nimbus";
import type { TabMetadata } from "@/types";

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
 * Syncs with URL query parameter (?view={key})
 */
export const ViewTabs = ({ tabs, onViewChange }: ViewTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Determine active view - default to first tab if param is invalid
  const defaultView = tabs[0]?.key || "overview";
  const activeView = tabs.find((tab) => tab.key === viewParam)
    ? viewParam!
    : defaultView;

  // Set default view in URL if not present
  useEffect(() => {
    if (!viewParam && tabs.length > 0) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("view", defaultView);
      setSearchParams(newParams, { replace: true });
    }
  }, [viewParam, tabs, defaultView, searchParams, setSearchParams]);

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

  const handleSelectionChange = (key: string | number) => {
    const newViewKey = String(key);

    // Update URL with new view parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", newViewKey);
    setSearchParams(newParams, { replace: true });

    // Call optional callback
    onViewChange?.(newViewKey);
  };

  return (
    <Box
      id="floating-nav"
      bg="bg/75"
      borderRadius="full"
      padding="200"
      backdropFilter="blur({sizes.500})"
      ml="-200"
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
