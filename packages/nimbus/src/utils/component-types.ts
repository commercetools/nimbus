import React from "react";

/**
 * Common component prop types that are used across multiple components
 */
export interface CommonComponentProps {
  /** Custom CSS class name */
  className?: string;
  /** Custom data attributes */
  [key: `data-${string}`]: unknown;
  /** Component slot identifier for React Aria Components */
  slot?: string | null | undefined;
  /** Component reference */
  ref?: React.Ref<any>;
}

/**
 * Base props for interactive components
 */
export interface InteractiveComponentProps extends CommonComponentProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ARIA labelled by reference */
  "aria-labelledby"?: string;
}
