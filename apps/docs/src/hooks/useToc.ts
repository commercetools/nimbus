import { useLocation } from "react-router-dom";
import { normalizeRoute } from "@/utils/normalize-route";
import { useDocData } from "./use-doc-data";
import { useMemo } from "react";

/**
 * Hook to get the table of contents (TOC) for the currently active document.
 * Uses useDocData to load the current document on demand.
 *
 * @returns Array of TOC headings for the active document
 */
export const useToc = () => {
  const location = useLocation();
  const activeRoute = normalizeRoute(location.pathname);

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

    // Return the TOC from the active document's metadata
    return doc.meta.toc;
  }, [doc, isLoading, error]);

  return toc;
};
