import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { Tabs } from "@commercetools/nimbus";
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
  );
};
