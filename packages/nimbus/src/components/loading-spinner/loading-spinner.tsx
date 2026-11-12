import { mergeProps, useProgressBar } from "react-aria";
import { LoadingSpinnerRoot } from "./loading-spinner.slots";
import type { LoadingSpinnerProps } from "./loading-spinner.types";
import { useLocalizedStringFormatter } from "@/hooks";
import { loadingSpinnerMessagesStrings } from "./loading-spinner.messages";

// Drawn on the same 24x24 grid as the icons. The ring has a radius of 8.75 and
// a stroke of 2.5, so its outer edge sits 2px inside the grid, like the live
// area of an icon.
const pointerPath = "M12 3.25A8.75 8.75 0 0 1 20.75 12";

/**
 * # LoadingSpinner
 *
 * Indicates ongoing processes or loading states
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/loadingspinner}
 * @supportsStyleProps
 */
export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const msg = useLocalizedStringFormatter(loadingSpinnerMessagesStrings);
  const defaultLabel = msg.format("default");
  const { ref, "aria-label": ariaLabel = defaultLabel, ...restProps } = props;
  const { progressBarProps } = useProgressBar({
    isIndeterminate: true,
    "aria-label": ariaLabel,
    ...restProps,
  });

  return (
    <LoadingSpinnerRoot
      ref={ref}
      {...mergeProps(restProps, progressBarProps)}
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="8.75"
        data-svg-path="spinner-circle"
        strokeWidth="2.5"
      />
      <path
        d={pointerPath}
        data-svg-path="spinner-pointer"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </LoadingSpinnerRoot>
  );
};

LoadingSpinner.displayName = "LoadingSpinner";
