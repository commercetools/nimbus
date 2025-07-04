import type { ProgressBarRootProps } from "./progress-bar.slots.tsx";

/**
 * Additional properties we want to exclude from the ProgressBar component.
 * These are chakra-ui props we don't want exposed.
 */
type ExcludedProps = "css" | "recipe" | "unstyled" | "as" | "asChild";

/**
 * Main props interface for the ProgressBar component.
 * Extends ProgressBarRootProps to include root props, variant props, and aria props,
 * while adding custom props for label display and formatting.
 */
export interface ProgressBarProps
  extends Omit<ProgressBarRootProps, ExcludedProps> {
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Whether the progress bar represents an active, ongoing process.
   * Set to `true` for dynamic progress (e.g., file uploads, downloads).
   * Set to `false` for static progress indicators (e.g., step 3 of 5 in a wizard).
   * @default true
   */
  isDynamic?: boolean;
}
