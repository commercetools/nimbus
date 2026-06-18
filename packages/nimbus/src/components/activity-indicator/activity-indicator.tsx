import { ActivityIndicatorRoot } from "./activity-indicator.slots";
import type { ActivityIndicatorProps } from "./activity-indicator.types";
import { useLocalizedStringFormatter } from "@/hooks";
import { activityIndicatorMessagesStrings } from "./activity-indicator.messages";

/**
 * # ActivityIndicator
 *
 * An animated three-dot indicator that signals ongoing agent/system activity
 * (e.g. "Thinking…", "Processing request", "Agent is typing") in chat and AI
 * surfaces. It is presentational, not a progress indicator — use
 * {@link LoadingSpinner} for indeterminate progress.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/activityindicator}
 */
export const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const msg = useLocalizedStringFormatter(activityIndicatorMessagesStrings);
  const {
    ref,
    "aria-label": ariaLabelProp,
    colorPalette = "primary",
    ...restProps
  } = props;

  // `colorPalette` flows to the root as a native Chakra prop so any Nimbus
  // palette colors the dots (base fill is `colorPalette.11`). The two semantic
  // aliases remap to their alpha palettes so the dots read well overlaid on
  // colored surfaces.
  const resolvedColorPalette =
    colorPalette === "primary"
      ? "ctvioletAlpha"
      : colorPalette === "white"
        ? "whiteAlpha"
        : colorPalette;

  // Presence of `aria-label` is the accessibility switch: labeled → polite
  // live region; omitted → decorative. An empty string opts into the live
  // region using the localized default label.
  const isLabeled = ariaLabelProp !== undefined;
  const ariaLabel = isLabeled
    ? ariaLabelProp || msg.format("default")
    : undefined;

  const a11yProps = isLabeled
    ? {
        role: "status",
        "aria-live": "polite" as const,
        "aria-label": ariaLabel,
      }
    : { "aria-hidden": true };

  return (
    <ActivityIndicatorRoot
      ref={ref}
      colorPalette={resolvedColorPalette}
      {...a11yProps}
      {...restProps}
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
