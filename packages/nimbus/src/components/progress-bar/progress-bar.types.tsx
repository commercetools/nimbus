import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { AriaProgressBarProps } from "react-aria";

// ============================================================
// RECIPE PROPS
// ============================================================

type ProgressBarRecipeProps = {
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
// HELPER TYPES
// ============================================================

type ExcludedProps = "css" | "unstyled" | "as" | "asChild";

// ============================================================
// MAIN PROPS
// ============================================================

export type ProgressBarProps = Omit<ProgressBarRootSlotProps, ExcludedProps> & {
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Format options for the progress bar.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   * @default { style: "percent" }
   */
  formatOptions?: ProgressBarRootSlotProps["formatOptions"];
};
