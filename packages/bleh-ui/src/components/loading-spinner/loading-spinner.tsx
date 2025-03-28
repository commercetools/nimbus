import { forwardRef } from "react";
import { LoadingSpinnerRoot } from "./loading-spinner.slots";
import type { LoadingSpinnerProps } from "./loading-spinner.types";
import { mergeProps, useProgressBar } from "react-aria";

const circlePath =
  "M22.5 12C22.5 13.3789 22.2284 14.7443 21.7007 16.0182C21.1731 17.2921 20.3996 18.4496 19.4246 19.4246C18.4496 20.3996 17.2921 21.1731 16.0182 21.7007C14.7443 22.2284 13.3789 22.5 12 22.5C10.6211 22.5 9.25574 22.2284 7.98182 21.7007C6.7079 21.1731 5.55039 20.3996 4.57538 19.4246C3.60036 18.4496 2.82694 17.2921 2.29926 16.0182C1.77159 14.7443 1.5 13.3789 1.5 12C1.5 10.6211 1.77159 9.25574 2.29927 7.98182C2.82694 6.7079 3.60037 5.55039 4.57538 4.57538C5.5504 3.60036 6.70791 2.82694 7.98183 2.29926C9.25575 1.77159 10.6211 1.5 12 1.5C13.3789 1.5 14.7443 1.77159 16.0182 2.29927C17.2921 2.82694 18.4496 3.60037 19.4246 4.57538C20.3996 5.5504 21.1731 6.70791 21.7007 7.98183C22.2284 9.25575 22.5 10.6211 22.5 12L22.5 12Z";
const pointerPath =
  "M12 1.5C13.3789 1.5 14.7443 1.77159 16.0182 2.29927C17.2921 2.82694 18.4496 3.60036 19.4246 4.57538C20.3996 5.55039 21.1731 6.70791 21.7007 7.98183C22.2284 9.25574 22.5 10.6211 22.5 12";

/**
 * LoadingSpinner
 * ============================================================
 * Indicates ongoing processes or loading states
 */
export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ "aria-label": ariaLabel = "Loading data", ...props }, ref) => {
    const { progressBarProps } = useProgressBar({
      isIndeterminate: true,
      ...props,
    });

    return (
      <LoadingSpinnerRoot
        ref={ref}
        {...mergeProps(props, progressBarProps)}
        aria-label={ariaLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path
            d={circlePath}
            data-svg-path="spinner-circle"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pointerPath}
            data-svg-path="spinner-pointer"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </LoadingSpinnerRoot>
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";
