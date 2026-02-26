import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { AriaProgressBarProps } from "react-aria";

// ============================================================
// RECIPE PROPS
// ============================================================

type ProgressBarRecipeProps = {
  /**
   * Size variant of the progress bar
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusProgressBar">["size"];
  /**
   * Whether the progress bar represents an active, ongoing process.
   * Set to `true` for dynamic progress (e.g., file uploads, downloads).
   * Set to `false` for static progress indicators (e.g., step 3 of 5 in a wizard).
   * @default true
   */
  isDynamic?: SlotRecipeProps<"nimbusProgressBar">["isDynamic"];
  /**
   * Whether the progress is indeterminate (unknown duration)
   * @default false
   */
  isIndeterminate?: SlotRecipeProps<"nimbusProgressBar">["isIndeterminate"];
  /**
   * Visual style variant of the progress bar
   * @default "solid"
   */
  variant?: SlotRecipeProps<"nimbusProgressBar">["variant"];
  /**
   * Layout configuration for label and value positioning
   * @default "stacked"
   */
  layout?: SlotRecipeProps<"nimbusProgressBar">["layout"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ProgressBarRootSlotProps = Omit<
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

// ============================================================
// MAIN PROPS
// ============================================================

export type ProgressBarProps = OmitInternalProps<ProgressBarRootSlotProps> & {
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Format options for the progress bar value display
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   * @default { style: "percent" }
   */
  formatOptions?: ProgressBarRootSlotProps["formatOptions"];
};
