import { useSearchParams } from "react-router";

/**
 * Hook to manage the active documentation view.
 * Syncs with URL query parameter (?view={key}).
 *
 * @returns The current active view key (e.g., "overview", "api", "dev") or undefined if not set
 */
export const useActiveView = (): string | undefined => {
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get("view");

  // Return the view parameter or undefined if not set
  return viewParam || undefined;
};
