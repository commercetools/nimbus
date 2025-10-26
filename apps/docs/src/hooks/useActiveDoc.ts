import { useLocation } from "react-router-dom";
import { normalizeRoute } from "@/utils/normalize-route";
import { useDocData } from "./use-doc-data";
import type { MdxFileFrontmatter } from "@/types";

/**
 * Hook to get the currently active document.
 *
 * This hook uses the useDocData hook to load the current route's document data
 * on demand, eliminating the need for a monolithic documentation object.
 *
 * @returns The active document's frontmatter, or undefined if not found or loading
 */
export const useActiveDoc = (): MdxFileFrontmatter | undefined => {
  const location = useLocation();
  const activeRoute = normalizeRoute(location.pathname);

  // Use useDocData to load the current route's document
  const { doc, isLoading, error } = useDocData(activeRoute);

  // Return undefined if loading or error
  if (isLoading || error || !doc) {
    return undefined;
  }

  // Type guard: doc should have meta and mdx properties
  if (!("meta" in doc) || !("mdx" in doc)) {
    console.error("Invalid document structure:", doc);
    return undefined;
  }

  // CRITICAL: Create defensive copy with cloned menu array
  // This prevents any component from mutating the shared menu array
  return {
    meta: {
      ...doc.meta,
      menu: [...doc.meta.menu],
    },
    mdx: doc.mdx,
  } as MdxFileFrontmatter;
};
