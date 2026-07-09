import { createContext, useContext } from "react";

/**
 * Carries the decorative separator node configured on `Breadcrumbs.Root` down
 * to each `Breadcrumbs.Item`, so the same separator is shared by both the
 * compound (`Breadcrumbs.Item` children) and declarative (`items`) APIs.
 *
 * Defaults to `›` when an item is rendered without a surrounding
 * `Breadcrumbs.Root` provider.
 */
export const BreadcrumbsSeparatorContext = createContext<React.ReactNode>("›");

/**
 * Returns the decorative separator node provided by `Breadcrumbs.Root`.
 */
export const useBreadcrumbsSeparator = (): React.ReactNode =>
  useContext(BreadcrumbsSeparatorContext);
