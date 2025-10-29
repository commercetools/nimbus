import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Box, Stack } from "@commercetools/nimbus";
import styles from "./view-tabs.module.css";

export type ViewType = "design" | "dev";

interface ViewTabsProps {
  /**
   * Callback when active view changes
   */
  onViewChange?: (view: ViewType) => void;
}

/**
 * ViewTabs component for switching between design and developer documentation views.
 * Syncs with URL query parameter (?view=design or ?view=dev)
 */
export const ViewTabs = ({ onViewChange }: ViewTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  const activeView: ViewType = viewParam === "dev" ? "dev" : "design";

  const handleViewChange = (newView: ViewType) => {
    // Update URL with new view parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", newView);
    setSearchParams(newParams, { replace: true });

    // Call optional callback
    onViewChange?.(newView);
  };

  const handleKeyDown = (event: React.KeyboardEvent, view: ViewType) => {
    // Handle keyboard navigation
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleViewChange(view);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleViewChange(view === "design" ? "dev" : "design");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleViewChange(view === "design" ? "dev" : "design");
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
        <button
          role="tab"
          id="tab-design"
          aria-selected={activeView === "design"}
          aria-controls="panel-design"
          tabIndex={activeView === "design" ? 0 : -1}
          onClick={() => handleViewChange("design")}
          onKeyDown={(e) => handleKeyDown(e, "design")}
          className={`${styles.tab} ${activeView === "design" ? styles.tabActive : ""}`}
        >
          Design
        </button>
        <button
          role="tab"
          id="tab-dev"
          aria-selected={activeView === "dev"}
          aria-controls="panel-dev"
          tabIndex={activeView === "dev" ? 0 : -1}
          onClick={() => handleViewChange("dev")}
          onKeyDown={(e) => handleKeyDown(e, "dev")}
          className={`${styles.tab} ${activeView === "dev" ? styles.tabActive : ""}`}
        >
          Developer
        </button>
      </Stack>
    </Box>
  );
};
