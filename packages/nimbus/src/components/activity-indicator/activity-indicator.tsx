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
    size = "inherit",
    "aria-label": ariaLabelProp,
    ...restProps
  } = props;

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

  const isFixedSize = size !== "inherit";

  return (
    <ActivityIndicatorRoot
      ref={ref}
      size={size}
      data-fixed-size={isFixedSize ? "" : undefined}
      {...a11yProps}
      {...restProps}
    >
      <span data-dots-row="">
        <span data-dot="0" />
        <span data-dot="1" />
        <span data-dot="2" />
      </span>
    </ActivityIndicatorRoot>
  );
};

ActivityIndicator.displayName = "ActivityIndicator";
