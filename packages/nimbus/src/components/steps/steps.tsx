import {
  StepsRoot,
  StepsList,
  StepsItem,
  StepsIndicator,
  StepsSeparator,
  StepsContent,
  StepsLabel,
  StepsDescription,
} from "./components";

/**
 * # Steps
 *
 * A display-only progress indicator for multi-step processes like forms, wizards, and onboarding flows.
 * Supports horizontal and vertical orientations, three size variants, and numeric or icon indicators.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/steps}
 *
 * @example
 * ```tsx
 * <Steps.Root step={1} count={3}>
 *   <Steps.List>
 *     <Steps.Item index={0}>
 *       <Steps.Indicator type="numeric" />
 *       <Steps.Content>
 *         <Steps.Label>Account</Steps.Label>
 *         <Steps.Description>Create your account</Steps.Description>
 *       </Steps.Content>
 *     </Steps.Item>
 *
 *     <Steps.Separator />
 *
 *     <Steps.Item index={1}>
 *       <Steps.Indicator type="numeric" />
 *       <Steps.Content>
 *         <Steps.Label>Profile</Steps.Label>
 *         <Steps.Description>Complete your profile</Steps.Description>
 *       </Steps.Content>
 *     </Steps.Item>
 *
 *     <Steps.Separator />
 *
 *     <Steps.Item index={2}>
 *       <Steps.Indicator type="numeric" />
 *       <Steps.Content>
 *         <Steps.Label>Review</Steps.Label>
 *       </Steps.Content>
 *     </Steps.Item>
 *   </Steps.List>
 * </Steps.Root>
 * ```
 */
export const Steps = {
  /**
   * # Steps.Root
   *
   * Container component that manages step state and provides context to child components.
   */
  Root: StepsRoot,

  /**
   * # Steps.List
   *
   * Flex container that wraps all step items and separators.
   */
  List: StepsList,

  /**
   * # Steps.Item
   *
   * Container for a single step. Automatically derives state from its index.
   */
  Item: StepsItem,

  /**
   * # Steps.Indicator
   *
   * Visual indicator showing step number or icon.
   */
  Indicator: StepsIndicator,

  /**
   * # Steps.Separator
   *
   * Visual line connecting step indicators.
   */
  Separator: StepsSeparator,

  /**
   * # Steps.Content
   *
   * Container for step label and optional description.
   */
  Content: StepsContent,

  /**
   * # Steps.Label
   *
   * Displays the step title.
   */
  Label: StepsLabel,

  /**
   * # Steps.Description
   *
   * Displays optional hint text below the label.
   */
  Description: StepsDescription,
};

export type {
  StepsRootProps,
  StepsListProps,
  StepsItemProps,
  StepsIndicatorProps,
  StepsSeparatorProps,
  StepsContentProps,
  StepsLabelProps,
  StepsDescriptionProps,
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
  StepsIndicator as _StepsIndicator,
  StepsSeparator as _StepsSeparator,
  StepsContent as _StepsContent,
  StepsLabel as _StepsLabel,
  StepsDescription as _StepsDescription,
};

export { useStepsContext, useStepsItemContext } from "./components";
