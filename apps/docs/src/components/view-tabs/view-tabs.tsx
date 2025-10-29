import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { Box, Stack } from "@commercetools/nimbus";
import type { TabMetadata } from "@/types";
import styles from "./view-tabs.module.css";

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

  const handleViewChange = (newViewKey: string) => {
    // Update URL with new view parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", newViewKey);
    setSearchParams(newParams, { replace: true });

    // Call optional callback
    onViewChange?.(newViewKey);
  };

  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    // Handle keyboard navigation
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleViewChange(tabs[currentIndex].key);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      handleViewChange(tabs[nextIndex].key);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      handleViewChange(tabs[prevIndex].key);
    }
  };

  return (
    <Box className={styles.viewTabsContainer}>
      <Stack
        role="tablist"
        aria-label="Documentation views"
        direction="row"
        gap="0"
        className={styles.tabList}
      >
        {tabs.map((tab, index) => {
          const isActive = activeView === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleViewChange(tab.key)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
            >
              {tab.title}
            </button>
          );
        })}
      </Stack>
    </Box>
  );
};
