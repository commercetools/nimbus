import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, ConditionalValue } from "@chakra-ui/react";
import type { AriaProgressBarProps } from "react-aria";
import type {
  ProgressBarSize,
  ProgressBarIsDynamic,
  ProgressBarIsIndeterminate,
  ProgressBarVariant,
  ProgressBarLayout,
} from "./progress-bar.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type ProgressBarRecipeProps = {
  /**
   * Size variant of the progress bar
   * @default "md"
   */
  size?: ConditionalValue<ProgressBarSize | undefined>;
  /**
   * Whether the progress bar represents an active, ongoing process.
   * Set to `true` for dynamic progress (e.g., file uploads, downloads).
   * Set to `false` for static progress indicators (e.g., step 3 of 5 in a wizard).
   * @default true
   */
  isDynamic?: ProgressBarIsDynamic;
  /**
   * Whether the progress is indeterminate (unknown duration)
   * @default false
   */
  isIndeterminate?: ProgressBarIsIndeterminate;
  /**
   * Visual style variant of the progress bar
   * @default "solid"
   */
  variant?: ConditionalValue<ProgressBarVariant | undefined>;
  /**
   * Layout configuration for label and value positioning
   * @default "stacked"
   */
  layout?: ConditionalValue<ProgressBarLayout | undefined>;
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
