import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { AriaProgressBarProps } from "react-aria";

/**
 * Base recipe props type that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
export type ProgressBarRecipeProps = {
  size?: SlotRecipeProps<"progressBar">["size"];
  /**
   * Whether the progress bar represents an active, ongoing process.
   * Set to `true` for dynamic progress (e.g., file uploads, downloads).
   * Set to `false` for static progress indicators (e.g., step 3 of 5 in a wizard).
   * @default true
   */
  isDynamic?: SlotRecipeProps<"progressBar">["isDynamic"];
  isIndeterminate?: SlotRecipeProps<"progressBar">["isIndeterminate"];
  variant?: SlotRecipeProps<"progressBar">["variant"];
  layout?: SlotRecipeProps<"progressBar">["layout"];
} & UnstyledProp;

/**
 * Root props type that extends Chakra's HTML props with our recipe props,
 * aria props, and data attributes.
 */
export type ProgressBarRootProps = Omit<
  HTMLChakraProps<"div", ProgressBarRecipeProps>,
  "translate"
> &
  Omit<ProgressBarRecipeProps, "isIndeterminate"> &
  AriaProgressBarProps & {
    [key: `data-${string}`]: string;
    translate?: "yes" | "no";
  };

export type ProgressBarTrackSlotProps = HTMLChakraProps<"div">;

export type ProgressBarFillSlotProps = HTMLChakraProps<"div">;

export type ProgressBarLabelSlotProps = HTMLChakraProps<"span">;

export type ProgressBarValueSlotProps = HTMLChakraProps<"span">;

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
export type ProgressBarProps = Omit<ProgressBarRootProps, ExcludedProps> & {
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Format options for the progress bar.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   * @default { style: "percent" }
   */
  formatOptions?: ProgressBarRootProps["formatOptions"];
};
