import { useMemo, memo } from "react";
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
 * The bar stays sticky at the top of the scroll area.
 * Syncs with URL subroutes (/{viewKey}). Navigation is controlled entirely
 * through URL state - clicking a tab updates the URL, and the active tab
 * follows the URL.
 *
 * Memoized to prevent unnecessary rerenders when parent rerenders for unrelated reasons.
 * Note: Will still rerender on route changes due to internal useRouteInfo hook.
 */
export const ViewTabs = memo(({ tabs }: ViewTabsProps) => {
  const { baseRoute, viewKey } = useRouteInfo();

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

  return (
    <Box
      width="full"
      id="floating-nav"
      bg="bg"
      borderBottom="1px solid"
      borderColor="neutral.6"
      position="sticky"
      top="0"
      zIndex="2"
      css={{
        // On narrow screens the tabs scroll sideways instead of shrinking
        overflowX: "auto",
        "& [role=tab]": { flexShrink: 0, whiteSpace: "nowrap" },
      }}
    >
      <Tabs.Root selectedKey={activeView} variant="line" size="lg">
        <Tabs.List>
          {tabs.map((tab) => {
            const isOverviewTab = tab.key === "overview";
            const href = isOverviewTab
              ? `/${baseRoute}`
              : `/${baseRoute}/${tab.key}`;
            return (
              <Tabs.Tab href={href} key={tab.key} id={tab.key}>
                {tab.title}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
});
