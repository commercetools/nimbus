import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { ReactNode, Ref } from "react";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

export type StepsRecipeProps = SlotRecipeProps<"nimbusSteps">;

// ============================================================
// CONTEXT VALUE
// ============================================================

/**
 * Context value provided by Steps.Root to all child components.
 */
export type StepsContextValue = {
  /** Current active step index (0-based) */
  step: number;
  /** Total number of steps */
  count: number;
  /** Size variant */
  size: "xs" | "sm" | "md";
  /** Orientation of the steps */
  orientation: "horizontal" | "vertical";
};

/**
 * Context value provided by Steps.Item to its children.
 */
export type StepsItemContextValue = {
  /** Index of this step (0-based) */
  index: number;
  /** Current state of this step */
  state: "incomplete" | "current" | "complete";
};

// ============================================================
// SLOT PROPS
// ============================================================

export type StepsRootSlotProps = HTMLChakraProps<"div", StepsRecipeProps>;
export type StepsListSlotProps = HTMLChakraProps<"div">;
export type StepsItemSlotProps = HTMLChakraProps<"div">;
export type StepsIndicatorSlotProps = HTMLChakraProps<"div">;
export type StepsSeparatorSlotProps = HTMLChakraProps<"div">;
export type StepsContentSlotProps = HTMLChakraProps<"div">;
export type StepsLabelSlotProps = HTMLChakraProps<"div">;
export type StepsDescriptionSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Steps.Root component.
 * Container component that manages step state and provides context to child components.
 */
export type StepsRootProps = OmitInternalProps<StepsRootSlotProps> & {
  /**
   * Current active step index (0-based).
   * Steps with index < step are "complete".
   * Step with index === step is "current".
   * Steps with index > step are "incomplete".
   */
  step: number;

  /**
   * Total number of steps.
   */
  count: number;

  /**
   * Size variant of the steps.
   * - xs: 24px indicator, compact text
   * - sm: 32px indicator, standard text (default)
   * - md: 40px indicator, larger text
   * @default "sm"
   */
  size?: "xs" | "sm" | "md";

  /**
   * Orientation of the steps layout.
   * - horizontal: Steps arranged in a row
   * - vertical: Steps arranged in a column
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /** Child components (Steps.List) */
  children: ReactNode;

  /** Ref to the root element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.List component.
 * Flex container that wraps all step items.
 */
export type StepsListProps = OmitInternalProps<StepsListSlotProps> & {
  /** Child components (Steps.Item and Steps.Separator) */
  children: ReactNode;

  /** Ref to the list element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Item component.
 * Container for a single step (indicator + content).
 */
export type StepsItemProps = OmitInternalProps<StepsItemSlotProps> & {
  /**
   * Index of this step (0-based).
   * Used to derive the step state relative to the current step.
   */
  index: number;

  /** Child components (Indicator, Content) */
  children: ReactNode;

  /** Ref to the item element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Indicator component.
 * Displays the step number or custom icon.
 */
export type StepsIndicatorProps = OmitInternalProps<StepsIndicatorSlotProps> & {
  /**
   * Type of indicator content.
   * - numeric: Displays step number (1, 2, 3...), shows checkmark when complete
   * - icon: Displays custom icon, applies state styling only
   * @default "numeric"
   */
  type?: "numeric" | "icon";

  /**
   * Custom icon to display (required when type="icon").
   */
  icon?: ReactNode;

  /**
   * Whether to show checkmark icon when step is complete.
   * Only applies when type="numeric".
   * When type="icon", the icon remains and only styling changes.
   * @default true
   */
  showCompleteIcon?: boolean;

  /** Ref to the indicator element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Separator component.
 * Visual line connecting step indicators.
 */
export type StepsSeparatorProps = OmitInternalProps<StepsSeparatorSlotProps> & {
  /** Ref to the separator element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Content component.
 * Container for step label and description.
 */
export type StepsContentProps = OmitInternalProps<StepsContentSlotProps> & {
  /** Child components (Label, Description) */
  children: ReactNode;

  /** Ref to the content element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Label component.
 * Displays the step title.
 */
export type StepsLabelProps = OmitInternalProps<StepsLabelSlotProps> & {
  /** Label text content */
  children: ReactNode;

  /** Ref to the label element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Description component.
 * Displays optional hint text below the label.
 */
export type StepsDescriptionProps =
  OmitInternalProps<StepsDescriptionSlotProps> & {
    /** Description text content */
    children: ReactNode;

    /** Ref to the description element */
    ref?: Ref<HTMLDivElement>;
  };
