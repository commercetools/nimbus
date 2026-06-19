import { ActivityIndicatorRoot } from "./activity-indicator.slots";
import type { ActivityIndicatorProps } from "./activity-indicator.types";

/**
 * # ActivityIndicator
 *
 * An animated three-dot indicator that signals ongoing agent/system activity
 * (e.g. "Thinking…", "Processing request", "Agent is typing") in chat and AI
 * surfaces. It is presentational, not a progress indicator — use
 * {@link LoadingSpinner} for indeterminate progress.
 *
 * The indicator is purely decorative: it is always `aria-hidden`. Announcing
 * the activity to assistive technology is the consumer's responsibility —
 * either through adjacent visible text (e.g. "Thinking…") or a live region
 * owned by the surrounding chat/turn container. A component-owned live region
 * would not announce reliably: this indicator is typically mounted only while
 * activity is in progress, and a live region mounted together with its content
 * is not announced consistently across screen readers (the region must already
 * exist in the DOM before its content changes).
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/activityindicator}
 */
export const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const { ref, colorPalette = "primary", ...restProps } = props;

  return (
    <ActivityIndicatorRoot
      ref={ref}
      colorPalette={colorPalette}
      {...restProps}
      // Spread last so the decorative contract is authoritative: the indicator
      // is always hidden from assistive technology and a consumer cannot
      // accidentally un-hide it (announcements are the consumer's concern).
      aria-hidden={true}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/*
          Dot geometry is a hybrid of two competing constraints on the 24×24
          icon grid. Dots stay at the clean integer r=3 (⌀6); spacing is the
          variable. The icon family reserves outer "safe space", but the Figma
          spec wants wider gaps between dots — and its literal three-dots width
          (26px) overflows the 24px canvas, while strict icon padding squeezes
          the dots together in small sizes. cx 4/12/20 splits the difference:
          ~1px outer padding (honors the icon safe space, so it isn't an
          outlier next to other icons) with 2px gaps (honors the Figma spacing).

          cy=13 rests the dots 1px below center: the bounce only travels upward,
          so nudging the resting row down balances the motion around the grid's
          vertical midpoint instead of leaving it top-heavy.
        */}
        <circle data-dot="0" cx="4" cy="13" r="3" />
        <circle data-dot="1" cx="12" cy="13" r="3" />
        <circle data-dot="2" cx="20" cy="13" r="3" />
      </svg>
    </ActivityIndicatorRoot>
  );
};

ActivityIndicator.displayName = "ActivityIndicator";
