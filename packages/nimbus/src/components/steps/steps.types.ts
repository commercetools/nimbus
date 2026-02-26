import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { Steps as ChakraSteps } from "@chakra-ui/react/steps";
import type { ReactNode, Ref } from "react";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

/**
 * Recipe props for the Steps component.
 * Inferred from the slot recipe to enable responsive values.
 */
type StepsRecipeProps = {
  /** Size variant of the steps */
  size?: SlotRecipeProps<"nimbusSteps">["size"];
  /** Orientation of the steps layout */
  orientation?: SlotRecipeProps<"nimbusSteps">["orientation"];
} & UnstyledProp;

// ============================================================
// CHAKRA STEPS RE-EXPORTS
// ============================================================

/** Details provided when step changes */
export type StepsChangeDetails = ChakraSteps.ChangeDetails;

// ============================================================
// SLOT PROPS
// ============================================================

export type StepsRootSlotProps = HTMLChakraProps<"div", StepsRecipeProps>;
export type StepsListSlotProps = HTMLChakraProps<"div">;
export type StepsItemSlotProps = HTMLChakraProps<"div">;
export type StepsTriggerSlotProps = HTMLChakraProps<"button">;
export type StepsIndicatorSlotProps = HTMLChakraProps<"div">;
export type StepsSeparatorSlotProps = HTMLChakraProps<"div">;
export type StepsContentSlotProps = HTMLChakraProps<"div">;
export type StepsTitleSlotProps = HTMLChakraProps<"div">;
export type StepsDescriptionSlotProps = HTMLChakraProps<"div">;
export type StepsCompletedContentSlotProps = HTMLChakraProps<"div">;
export type StepsPrevTriggerSlotProps = HTMLChakraProps<"button">;
export type StepsNextTriggerSlotProps = HTMLChakraProps<"button">;
export type StepsNumberSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Steps.Root component.
 * Container component that manages step state and provides context to child components.
 *
 * @example
 * ```tsx
 * // Uncontrolled usage
 * <Steps.Root defaultStep={0} count={3}>
 *   <Steps.List>...</Steps.List>
 *   <Steps.Content index={0}>Step 1 content</Steps.Content>
 * </Steps.Root>
 *
 * // Controlled usage
 * <Steps.Root step={currentStep} onStepChange={handleStepChange} count={3}>
 *   ...
 * </Steps.Root>
 * ```
 */
export type StepsRootProps = OmitInternalProps<StepsRootSlotProps> & {
  /**
   * Total number of steps.
   */
  count: number;

  /**
   * Initial step index for uncontrolled usage (0-based).
   * Use this when you don't need to control the step state externally.
   * @default 0
   */
  defaultStep?: number;

  /**
   * Current step index for controlled usage (0-based).
   * When provided, the component becomes controlled and you must
   * handle step changes via onStepChange.
   */
  step?: number;

  /**
   * Callback fired when the step changes.
   * Required for controlled usage.
   */
  onStepChange?: (details: StepsChangeDetails) => void;

  /**
   * Callback fired when a step is completed.
   */
  onStepComplete?: () => void;

  /**
   * If true, restricts navigation to sequential progress only.
   * Users can only navigate forward to the next incomplete step,
   * or back to completed steps.
   * @default false
   */
  linear?: boolean;

  /**
   * Size variant of the steps.
   * - xs: 24px indicator, compact text
   * - sm: 32px indicator, standard text (default)
   * - md: 40px indicator, larger text
   * @default "sm"
   */
  size?: StepsRecipeProps["size"];

  /**
   * Orientation of the steps layout.
   * - horizontal: Steps arranged in a row
   * - vertical: Steps arranged in a column
   * @default "horizontal"
   */
  orientation?: StepsRecipeProps["orientation"];

  /** Child components */
  children: ReactNode;

  /** Ref to the root element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.List component.
 * Container for grouping step items.
 */
export type StepsListProps = OmitInternalProps<StepsListSlotProps> & {
  /** Child components (Steps.Item) */
  children: ReactNode;

  /** Ref to the list element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Item component.
 * Container for a single step (trigger + separator).
 * Items are automatically indexed based on render order.
 */
export type StepsItemProps = OmitInternalProps<StepsItemSlotProps> & {
  /**
   * Index of this step (0-based).
   * Required by Chakra Steps to identify the step.
   */
  index: number;

  /** Child components (Trigger, Separator) */
  children: ReactNode;

  /** Ref to the item element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Trigger component.
 * Clickable element within each step for direct navigation.
 */
export type StepsTriggerProps = OmitInternalProps<StepsTriggerSlotProps> & {
  /** Trigger content (typically Indicator + Title/Description) */
  children: ReactNode;

  /** Ref to the trigger element */
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Props for the Steps.Indicator component.
 * Visual marker showing step status (number, icon, or custom content).
 */
export type StepsIndicatorProps = OmitInternalProps<StepsIndicatorSlotProps> & {
  /** Custom content to display in the indicator */
  children?: ReactNode;

  /** Ref to the indicator element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Number component.
 * Displays the step number (1-indexed).
 */
export type StepsNumberProps = OmitInternalProps<StepsNumberSlotProps> & {
  /** Ref to the number element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Title component.
 * Displays the step title.
 */
export type StepsTitleProps = OmitInternalProps<StepsTitleSlotProps> & {
  /** Title text content */
  children: ReactNode;

  /** Ref to the title element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.Description component.
 * Displays optional hint text below the title.
 */
export type StepsDescriptionProps =
  OmitInternalProps<StepsDescriptionSlotProps> & {
    /** Description text content */
    children: ReactNode;

    /** Ref to the description element */
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
 * Content container that auto-shows/hides based on current step.
 */
export type StepsContentProps = OmitInternalProps<StepsContentSlotProps> & {
  /**
   * Index of the step this content belongs to (0-based).
   */
  index: number;

  /** Content to display for this step */
  children: ReactNode;

  /** Ref to the content element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Steps.CompletedContent component.
 * Content displayed when all steps are complete.
 */
export type StepsCompletedContentProps =
  OmitInternalProps<StepsCompletedContentSlotProps> & {
    /** Content to display when all steps are complete */
    children: ReactNode;

    /** Ref to the completed content element */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the Steps.PrevTrigger component.
 * Navigation button to go to previous step.
 */
export type StepsPrevTriggerProps =
  OmitInternalProps<StepsPrevTriggerSlotProps> & {
    /** Button content */
    children: ReactNode;

    /**
     * If true, render the trigger as a child element.
     * Useful for composing with custom button components.
     */
    asChild?: boolean;

    /** Ref to the prev trigger element */
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * Props for the Steps.NextTrigger component.
 * Navigation button to go to next step.
 */
export type StepsNextTriggerProps =
  OmitInternalProps<StepsNextTriggerSlotProps> & {
    /** Button content */
    children: ReactNode;

    /**
     * If true, render the trigger as a child element.
     * Useful for composing with custom button components.
     */
    asChild?: boolean;

    /** Ref to the next trigger element */
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * Props for the Steps.Status component.
 * Renders different content based on step state.
 */
export type StepsStatusProps = {
  /** Content to show when step is complete */
  complete: ReactNode;
  /** Content to show when step is incomplete */
  incomplete: ReactNode;
  /** Content to show when step is current (defaults to incomplete if not provided) */
  current?: ReactNode;
};
