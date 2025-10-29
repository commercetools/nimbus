import { useLocation } from "react-router-dom";
import { normalizeRoute } from "@/utils/normalize-route";
import { useDocData } from "./use-doc-data";
import type { MdxFileFrontmatter } from "@/types";

type UseActiveDocReturn = {
  doc: MdxFileFrontmatter | undefined;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Hook to get the currently active document.
 *
 * This hook uses the useDocData hook to load the current route's document data
 * on demand, eliminating the need for a monolithic documentation object.
 *
 * @returns Object containing the active document, loading state, and error state
 */
export const useActiveDoc = (): UseActiveDocReturn => {
  const location = useLocation();
  const activeRoute = normalizeRoute(location.pathname);

  // Use useDocData to load the current route's document
  const { doc, isLoading, error } = useDocData(activeRoute);

  // Return loading state as-is
  if (isLoading) {
    return { doc: undefined, isLoading: true, error: null };
  }

  // Return error state
  if (error || !doc) {
    return {
      doc: undefined,
      isLoading: false,
      error: error || new Error("Document not found"),
    };
  }

  // Type guard: doc should have meta and mdx properties
  if (!("meta" in doc) || !("mdx" in doc)) {
    console.error("Invalid document structure:", doc);
    return {
      doc: undefined,
      isLoading: false,
      error: new Error("Invalid document structure"),
    };
  }

  // CRITICAL: Create defensive copy with cloned menu array
  // This prevents any component from mutating the shared menu array
  return {
    doc: {
      meta: {
        ...doc.meta,
        menu: [...doc.meta.menu],
      },
      mdx: doc.mdx,
      ...(doc.devView && { devView: doc.devView }),
    } as MdxFileFrontmatter,
    isLoading: false,
    error: null,
  };
};
