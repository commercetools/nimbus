import { createContext, useContext } from "react";

/**
 * Shared state of a `DefaultPage`, provided by `DefaultPage.Root`.
 */
export type DefaultPageContextValue = {
  /**
   * `true` when `collapseHeaderOnScroll` is set and the header is pinned, so
   * the header can collapse.
   */
  isCollapseEnabled: boolean;
  /** `true` while the header shows its collapsed form. */
  isHeaderCollapsed: boolean;
  /**
   * EXPERIMENT ("scroll-driven"): the header follows the scroll position, so
   * it does not switch its layout with `data-collapsed`. It marks the pinned
   * collapsed form with `data-scroll-collapsed` instead.
   */
  isScrollDriven?: boolean;
  /** Callback ref for `DefaultPage.Header`. */
  registerHeader: (element: HTMLElement | null) => void;
  /** Callback ref for `DefaultPage.Content`. */
  registerContent: (element: HTMLElement | null) => void;
};

export const DefaultPageContext = createContext<DefaultPageContextValue | null>(
  null
);
DefaultPageContext.displayName = "DefaultPage.Context";

/**
 * Reads the `DefaultPage` state. Returns `null` outside `DefaultPage.Root`, so
 * parts keep working on their own: the header then keeps its full form.
 */
export const useDefaultPageContext = () => useContext(DefaultPageContext);
