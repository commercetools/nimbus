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
  const { ref, "aria-label": ariaLabelProp, ...restProps } = props;

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
    <ActivityIndicatorRoot ref={ref} {...a11yProps} {...restProps}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle data-dot="0" cx="5" cy="12" r="3" />
        <circle data-dot="1" cx="12" cy="12" r="3" />
        <circle data-dot="2" cx="19" cy="12" r="3" />
      </svg>
    </ActivityIndicatorRoot>
  );
};

ActivityIndicator.displayName = "ActivityIndicator";
