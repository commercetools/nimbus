/**
 * Options for the `useScrollableRegion` hook.
 */
export type UseScrollableRegionOptions = {
  /**
   * The landmark role to apply when the container is overflowing.
   * Use `"region"` for major page sections; `"group"` for less significant areas.
   * @default "group"
   */
  role?: "region" | "group";
  /**
   * The accessible name for the scrollable container.
   * Required when overflowing to satisfy WCAG 2.1 SC 4.1.2.
   */
  "aria-label"?: string;
  /**
   * ID of the element that labels this scrollable container.
   * Preferred over `aria-label` when a visible heading is available.
   */
  "aria-labelledby"?: string;
  /**
   * Debounce interval in milliseconds for overflow evaluation.
   * @default 100
   */
  debounceMs?: number;
  /**
   * CSS overflow value applied to the container.
   * @default "auto"
   */
  overflow?: "auto" | "scroll";
};

/**
 * Return value of the `useScrollableRegion` hook.
 */
export type UseScrollableRegionReturn = {
  /**
   * Ref callback to attach to the scrollable DOM element.
   * Creates a `ResizeObserver` when the element mounts.
   */
  ref: React.RefCallback<HTMLElement>;
  /**
   * Whether the container's content currently overflows its bounds.
   */
  isOverflowing: boolean;
  /**
   * Spread-ready props to apply to the scrollable element.
   * Includes `tabIndex`, `role`, ARIA attributes, overflow, and focus ring
   * styles — all conditional on overflow and focus state.
   */
  containerProps: React.HTMLAttributes<HTMLElement> & {
    style?: React.CSSProperties;
  };
};
