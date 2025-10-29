import { useLocation } from "react-router-dom";
import { normalizeRoute } from "@/utils/normalize-route";
import { useDocData } from "./use-doc-data";
import { useActiveView } from "./use-active-view";
import { useMemo } from "react";

/**
 * Hook to get the table of contents (TOC) for the currently active document.
 * Uses useDocData to load the current document on demand.
 * Returns the appropriate TOC based on the active view (design or dev).
 *
 * @returns Array of TOC headings for the active document and view
 */
export const useToc = () => {
  const location = useLocation();
  const activeRoute = normalizeRoute(location.pathname);
  const activeView = useActiveView();

  // Load the current document data
  const { doc, isLoading, error } = useDocData(activeRoute);

  const toc = useMemo(() => {
    // Return empty array if loading, error, or no document
    if (isLoading || error || !doc) {
      return [];
    }

    // Type guard: doc should have meta property with toc
    if (!("meta" in doc) || !doc.meta?.toc) {
      return [];
    }

    // If in developer view and devView TOC exists, return it
    if (activeView === "dev" && doc.devView?.toc) {
      return doc.devView.toc;
    }

    // Otherwise return the design view TOC from metadata
    return doc.meta.toc;
  }, [doc, isLoading, error, activeView]);

  return toc;
};
