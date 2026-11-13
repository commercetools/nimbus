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
   * `true` once the header has started to collapse, until it is back in its
   * full form. Passed to a function as `DefaultPage.Header` children. Equal
   * to `isHeaderCollapsed`, except in the scroll-driven collapse, where it
   * turns `true` with the first scrolled pixel.
   */
  isHeaderCollapseStarted: boolean;
  /**
   * `true` while the header follows the scroll position (scroll-driven
   * collapse). It then keeps its full layout, so it does not get
   * `data-collapsed`; it marks the pinned collapsed form with the internal
   * `data-scroll-collapsed` instead.
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
