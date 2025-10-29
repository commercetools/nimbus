import { useSearchParams } from "react-router";

export type ViewType = "design" | "dev";

/**
 * Hook to manage the active documentation view (design or developer).
 * Syncs with URL query parameter (?view=design or ?view=dev).
 *
 * @returns The current active view type
 */
export const useActiveView = (): ViewType => {
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get("view");

  // Default to design view if no param or invalid param
  return viewParam === "dev" ? "dev" : "design";
};
