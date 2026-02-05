import {
  StepsRoot,
  StepsList,
  StepsItem,
  StepsTrigger,
  StepsIndicator,
  StepsNumber,
  StepsTitle,
  StepsDescription,
  StepsSeparator,
  StepsContent,
  StepsCompletedContent,
  StepsPrevTrigger,
  StepsNextTrigger,
  StepsStatus,
} from "./components";

/**
 * # Steps
 *
 * A multi-step workflow component with built-in state management, content visibility,
 * and navigation triggers. Wraps Chakra UI's Steps component with Nimbus styling.
 *
 * Supports both controlled and uncontrolled usage patterns.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/steps}
 *
 * @example
 * ```tsx
 * // Uncontrolled usage (component manages state internally)
 * <Steps.Root defaultStep={0} count={3}>
 *   <Steps.List>
 *     <Steps.Item index={0}>
 *       <Steps.Trigger>
 *         <Steps.Indicator />
 *         Account
 *       </Steps.Trigger>
 *       <Steps.Separator />
 *     </Steps.Item>
 *     <Steps.Item index={1}>
 *       <Steps.Trigger>
 *         <Steps.Indicator />
 *         Profile
 *       </Steps.Trigger>
 *       <Steps.Separator />
 *     </Steps.Item>
 *     <Steps.Item index={2}>
 *       <Steps.Trigger>
 *         <Steps.Indicator />
 *         Review
 *       </Steps.Trigger>
 *     </Steps.Item>
 *   </Steps.List>
 *
 *   <Steps.Content index={0}>Account form content</Steps.Content>
 *   <Steps.Content index={1}>Profile form content</Steps.Content>
 *   <Steps.Content index={2}>Review content</Steps.Content>
 *   <Steps.CompletedContent>All steps complete!</Steps.CompletedContent>
 *
 *   <Steps.PrevTrigger asChild>
 *     <Button>Back</Button>
 *   </Steps.PrevTrigger>
 *   <Steps.NextTrigger asChild>
 *     <Button>Next</Button>
 *   </Steps.NextTrigger>
 * </Steps.Root>
 * ```
 */
export const Steps = {
  /**
   * # Steps.Root
   *
   * Container component that manages step state and provides context to child components.
   * Supports both controlled (step/onStepChange) and uncontrolled (defaultStep) modes.
   */
  Root: StepsRoot,

  /**
   * # Steps.List
   *
   * Container for grouping step items.
   */
  List: StepsList,

  /**
   * # Steps.Item
   *
   * Container for a single step (trigger + separator).
   */
  Item: StepsItem,

  /**
   * # Steps.Trigger
   *
   * Clickable element within each step for direct navigation.
   */
  Trigger: StepsTrigger,

  /**
   * # Steps.Indicator
   *
   * Visual marker showing step status (number, icon, or custom content).
   */
  Indicator: StepsIndicator,

  /**
   * # Steps.Number
   *
   * Displays the step number (1-indexed).
   */
  Number: StepsNumber,

  /**
   * # Steps.Title
   *
   * Displays the step title.
   */
  Title: StepsTitle,

  /**
   * # Steps.Description
   *
   * Displays optional hint text below the title.
   */
  Description: StepsDescription,

  /**
   * # Steps.Separator
   *
   * Visual line connecting step indicators.
   */
  Separator: StepsSeparator,

  /**
   * # Steps.Content
   *
   * Content container that auto-shows/hides based on current step.
   */
  Content: StepsContent,

  /**
   * # Steps.CompletedContent
   *
   * Content displayed when all steps are complete.
   */
  CompletedContent: StepsCompletedContent,

  /**
   * # Steps.PrevTrigger
   *
   * Navigation button to go to previous step.
   */
  PrevTrigger: StepsPrevTrigger,

  /**
   * # Steps.NextTrigger
   *
   * Navigation button to go to next step.
   */
  NextTrigger: StepsNextTrigger,

  /**
   * # Steps.Status
   *
   * Renders different content based on step state.
   */
  Status: StepsStatus,
};

export type {
  StepsRootProps,
  StepsListProps,
  StepsItemProps,
  StepsTriggerProps,
  StepsIndicatorProps,
  StepsNumberProps,
  StepsTitleProps,
  StepsDescriptionProps,
  StepsSeparatorProps,
  StepsContentProps,
  StepsCompletedContentProps,
  StepsPrevTriggerProps,
  StepsNextTriggerProps,
  StepsStatusProps,
  StepsChangeDetails,
  StepsSize,
  StepsOrientation,
} from "./steps.types";

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export {
  StepsRoot as _StepsRoot,
  StepsList as _StepsList,
  StepsItem as _StepsItem,
  StepsTrigger as _StepsTrigger,
  StepsIndicator as _StepsIndicator,
  StepsNumber as _StepsNumber,
  StepsTitle as _StepsTitle,
  StepsDescription as _StepsDescription,
  StepsSeparator as _StepsSeparator,
  StepsContent as _StepsContent,
  StepsCompletedContent as _StepsCompletedContent,
  StepsPrevTrigger as _StepsPrevTrigger,
  StepsNextTrigger as _StepsNextTrigger,
  StepsStatus as _StepsStatus,
};

export { StepsContext, StepsItemContext } from "./components";
