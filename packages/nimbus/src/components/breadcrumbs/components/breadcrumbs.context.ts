import { createContext, useContext } from "react";

export interface BreadcrumbsContextValue {
  /**
   * The separator node rendered before each item except the first.
   */
  separator: React.ReactNode;
}

export const BreadcrumbsContext = createContext<
  BreadcrumbsContextValue | undefined
>(undefined);

/**
 * Returns the breadcrumbs context provided by `Breadcrumbs.Root`.
 * Throws if a `Breadcrumbs.Item` is rendered outside of a `Breadcrumbs.Root`.
 */
export const useBreadcrumbsContext = (): BreadcrumbsContextValue => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error("Breadcrumbs.Item must be used within Breadcrumbs.Root");
  }
  return context;
};
