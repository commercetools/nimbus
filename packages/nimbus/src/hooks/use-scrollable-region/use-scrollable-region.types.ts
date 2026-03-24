/**
 * Shared options for both `role` variants.
 */
type BaseOptions = {
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
 * When `role` is `"region"`, an accessible name is required via
 * `aria-label` or `aria-labelledby` (WCAG 2.1 SC 4.1.2).
 */
type RegionOptions = BaseOptions & {
  /**
   * The landmark role to apply when the container is overflowing.
   * Use `"region"` for major page sections.
   */
  role: "region";
} & (
    | {
        /**
         * The accessible name for the scrollable container.
         * Required when `role="region"`.
         */
        "aria-label": string;
        /**
         * ID of the element that labels this scrollable container.
         * Preferred over `aria-label` when a visible heading is available.
         */
        "aria-labelledby"?: string;
      }
    | {
        "aria-label"?: string;
        /**
         * ID of the element that labels this scrollable container.
         * Required when `role="region"` if `aria-label` is not provided.
         */
        "aria-labelledby": string;
      }
  );

/**
 * When `role` is `"group"` (or omitted), an accessible name is
 * recommended but not enforced at the type level.
 */
type GroupOptions = BaseOptions & {
  /**
   * The landmark role to apply when the container is overflowing.
   * @default "group"
   */
  role?: "group";
  /**
   * The accessible name for the scrollable container.
   */
  "aria-label"?: string;
  /**
   * ID of the element that labels this scrollable container.
   * Preferred over `aria-label` when a visible heading is available.
   */
  "aria-labelledby"?: string;
};

/**
 * Options for the `useScrollableRegion` hook.
 *
 * When `role` is `"region"`, either `aria-label` or `aria-labelledby`
 * must be provided to satisfy WCAG landmark naming requirements.
 */
export type UseScrollableRegionOptions = RegionOptions | GroupOptions;

/**
 * Resolved (flat) shape of all hook options. Used internally to avoid
 * discriminated-union narrowing issues when forwarding props.
 * @internal
 */
export type UseScrollableRegionResolvedOptions = BaseOptions & {
  role?: "region" | "group";
  "aria-label"?: string;
  "aria-labelledby"?: string;
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
