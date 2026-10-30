import { useDocData } from "./use-doc-data";
import { useActiveView } from "./use-active-view";
import { useMemo } from "react";
import { useRouteInfo } from "./use-route-info";
import { promoteViewHeading } from "@/utils/view-heading";

/**
 * Hook to get the table of contents (TOC) for the currently active document.
 * Uses useDocData to load the current document on demand.
 * Returns the appropriate TOC based on the active view (design or dev).
 *
 * @returns Array of TOC headings for the active document and view
 */
export const useToc = () => {
  const { baseRoute } = useRouteInfo();
  const activeView = useActiveView();

  // Load the current document data
  const { doc, isLoading, error } = useDocData(baseRoute);

  const toc = useMemo(() => {
    // Return empty array if loading, error, or no document
    if (isLoading || error || !doc) {
      return [];
    }

    // Type guard: doc should have meta property with toc
    if (!("meta" in doc) || !doc.meta?.toc) {
      return [];
    }

    const tabs = doc.meta.tabs || [];
    const viewKey = activeView ?? tabs[0]?.key ?? "overview";
    // Only pages with several views have tabs, so only they have a tab label
    const viewLabel =
      tabs.length > 1
        ? tabs.find((tab) => tab.key === viewKey)?.title
        : undefined;

    // If active view exists and has a TOC in views object, use it
    if (activeView && doc.views?.[activeView]?.toc) {
      return promoteViewHeading(doc.views[activeView].toc, viewLabel);
    }

    // Fallback to first tab's TOC or main TOC
    const defaultViewKey = tabs[0]?.key || "overview";
    if (doc.views?.[defaultViewKey]?.toc) {
      return promoteViewHeading(doc.views[defaultViewKey].toc, viewLabel);
    }

    // Final fallback to main TOC from metadata
    return promoteViewHeading(doc.meta.toc, viewLabel);
  }, [doc, isLoading, error, activeView]);

  return toc;
};
