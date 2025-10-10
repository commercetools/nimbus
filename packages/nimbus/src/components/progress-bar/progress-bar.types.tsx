import type { ProgressBarRootProps } from "./progress-bar.slots.tsx";

type ProgressBarRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "2xs" | "md";
  /** IsIndeterminate variant */
  isIndeterminate?: true;
  /**
   * Variant variant
   * @default "solid"
   */
  variant?: "solid" | "contrast";
  /**
   * Layout variant
   * @default "stacked"
   */
  layout?: "minimal" | "inline" | "stacked";
};

/**
 * Additional properties we want to exclude from the ProgressBar component.
 * These are chakra-ui props we don't want exposed.
 */
type ExcludedProps = "css" | "unstyled" | "as" | "asChild";

/**
 * Main props interface for the ProgressBar component.
 * Extends ProgressBarRootProps to include root props, variant props, and aria props,
 * while adding custom props for label display and formatting.
 */
export type ProgressBarProps = ProgressBarRecipeVariantProps &
  Omit<ProgressBarRootProps, ExcludedProps> & {
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

    /**
     * Format options for the progress bar.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     * @default { style: "percent" }
     */
    formatOptions?: ProgressBarRootProps["formatOptions"];
  };
