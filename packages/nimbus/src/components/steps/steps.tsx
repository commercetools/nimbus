import { createContext, useContext } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import { Check } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import type {
  StepsRootProps,
  StepsListProps,
  StepsItemProps,
  StepsIndicatorProps,
  StepsSeparatorProps,
  StepsContentProps,
  StepsLabelProps,
  StepsDescriptionProps,
  StepsContextValue,
  StepsItemContextValue,
} from "./steps.types";
import {
  StepsRootSlot,
  StepsListSlot,
  StepsItemSlot,
  StepsIndicatorSlot,
  StepsSeparatorSlot,
  StepsContentSlot,
  StepsLabelSlot,
  StepsDescriptionSlot,
} from "./steps.slots";

// ============================================================
// CONTEXT
// ============================================================

const StepsContext = createContext<StepsContextValue | null>(null);

/**
 * Hook to access the Steps context.
 * Must be used within a Steps.Root component.
 *
 * @throws Error if used outside of Steps.Root
 */
export const useStepsContext = (): StepsContextValue => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error(
      "Steps.* components must be used within Steps.Root. " +
        "Wrap your Steps.Item, Steps.Indicator, etc. in a Steps.Root component."
    );
  }
  return context;
};

const StepsItemContext = createContext<StepsItemContextValue | null>(null);

/**
 * Hook to access the StepsItem context.
 * Must be used within a Steps.Item component.
 *
 * @throws Error if used outside of Steps.Item
 */
export const useStepsItemContext = (): StepsItemContextValue => {
  const context = useContext(StepsItemContext);
  if (!context) {
    throw new Error(
      "Steps.Indicator must be used within Steps.Item. " +
        "Wrap your Steps.Indicator in a Steps.Item component."
    );
  }
  return context;
};

// ============================================================
// COMPONENTS
// ============================================================

/**
 * # Steps.Root
 *
 * Container component that manages step state and provides context to child components.
 *
 * @example
 * ```tsx
 * <Steps.Root step={1} count={3} size="sm" orientation="horizontal">
 *   <Steps.List>
 *     {/* Step items *\/}
 *   </Steps.List>
 * </Steps.Root>
 * ```
 */
const StepsRoot = (props: StepsRootProps) => {
  const {
    ref: forwardedRef,
    step,
    count,
    size = "sm",
    orientation = "horizontal",
    children,
    ...restProps
  } = props;

  // Development-only validation
  if (process.env.NODE_ENV === "development") {
    if (step < 0 || step > count) {
      console.warn(
        `[Steps] step prop (${step}) is out of bounds. ` +
          `Expected value between 0 and ${count}.`
      );
    }
    if (count < 1) {
      console.warn(`[Steps] count prop (${count}) must be at least 1.`);
    }
  }

  const recipe = useSlotRecipe({ key: "nimbusSteps" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps({
    size,
    orientation,
    ...restProps,
  });

  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  const contextValue: StepsContextValue = {
    step,
    count,
    size,
    orientation,
  };

  return (
    <StepsContext.Provider value={contextValue}>
      <StepsRootSlot
        ref={forwardedRef}
        data-slot="root"
        {...recipeProps}
        {...styleProps}
        {...functionalProps}
      >
        {children}
      </StepsRootSlot>
    </StepsContext.Provider>
  );
};
StepsRoot.displayName = "Steps.Root";

/**
 * # Steps.List
 *
 * Flex container that wraps all step items and separators.
 *
 * @example
 * ```tsx
 * <Steps.List>
 *   <Steps.Item index={0}>...</Steps.Item>
 *   <Steps.Separator />
 *   <Steps.Item index={1}>...</Steps.Item>
 * </Steps.List>
 * ```
 */
const StepsList = (props: StepsListProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsListSlot
      ref={forwardedRef}
      data-slot="list"
      role="list"
      aria-label="Progress steps"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsListSlot>
  );
};
StepsList.displayName = "Steps.List";

/**
 * # Steps.Item
 *
 * Container for a single step. Automatically derives state from its index
 * relative to the current step.
 *
 * @example
 * ```tsx
 * <Steps.Item index={0}>
 *   <Steps.Indicator type="numeric" />
 *   <Steps.Content>
 *     <Steps.Label>Step Title</Steps.Label>
 *     <Steps.Description>Optional description</Steps.Description>
 *   </Steps.Content>
 * </Steps.Item>
 * ```
 */
const StepsItem = (props: StepsItemProps) => {
  const { ref: forwardedRef, index, children, ...restProps } = props;

  const { step, count } = useStepsContext();

  // Derive state from index relative to current step
  const state: StepsItemContextValue["state"] =
    index < step ? "complete" : index === step ? "current" : "incomplete";
  const isCurrent = index === step;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  const itemContextValue: StepsItemContextValue = {
    index,
    state,
  };

  return (
    <StepsItemContext.Provider value={itemContextValue}>
      <StepsItemSlot
        ref={forwardedRef}
        data-slot="item"
        data-state={state}
        role="listitem"
        aria-current={isCurrent ? "step" : undefined}
        aria-label={`Step ${index + 1} of ${count}: ${state}`}
        {...styleProps}
        {...functionalProps}
      >
        {children}
      </StepsItemSlot>
    </StepsItemContext.Provider>
  );
};
StepsItem.displayName = "Steps.Item";

/**
 * # Steps.Indicator
 *
 * Visual indicator showing step number or icon.
 * When type="numeric", displays step number (1, 2, 3...) and shows checkmark when complete.
 * When type="icon", displays the provided icon with state-based styling.
 *
 * @example
 * ```tsx
 * // Numeric indicator
 * <Steps.Indicator type="numeric" />
 *
 * // Custom icon indicator
 * <Steps.Indicator type="icon" icon={<UserIcon />} />
 * ```
 */
const StepsIndicator = (props: StepsIndicatorProps) => {
  const {
    ref: forwardedRef,
    type = "numeric",
    icon,
    showCompleteIcon = true,
    ...restProps
  } = props;

  const { index, state } = useStepsItemContext();

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  const isComplete = state === "complete";

  // Determine what to render
  let content: React.ReactNode;
  if (type === "numeric") {
    if (isComplete && showCompleteIcon) {
      content = <Check />;
    } else {
      content = index + 1;
    }
  } else {
    // type === "icon"
    content = icon;
  }

  return (
    <StepsIndicatorSlot
      ref={forwardedRef}
      data-slot="indicator"
      data-state={state}
      aria-hidden="true"
      {...styleProps}
      {...functionalProps}
    >
      {content}
    </StepsIndicatorSlot>
  );
};
StepsIndicator.displayName = "Steps.Indicator";

/**
 * # Steps.Separator
 *
 * Visual line connecting step indicators.
 * Orientation and size are automatically determined from context.
 *
 * @example
 * ```tsx
 * <Steps.Item index={0}>...</Steps.Item>
 * <Steps.Separator />
 * <Steps.Item index={1}>...</Steps.Item>
 * ```
 */
const StepsSeparator = (props: StepsSeparatorProps) => {
  const { ref: forwardedRef, ...restProps } = props;

  const { orientation } = useStepsContext();

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsSeparatorSlot
      ref={forwardedRef}
      data-slot="separator"
      data-orientation={orientation}
      aria-hidden="true"
      {...styleProps}
      {...functionalProps}
    />
  );
};
StepsSeparator.displayName = "Steps.Separator";

/**
 * # Steps.Content
 *
 * Container for step label and optional description.
 *
 * @example
 * ```tsx
 * <Steps.Content>
 *   <Steps.Label>Step Title</Steps.Label>
 *   <Steps.Description>Optional description</Steps.Description>
 * </Steps.Content>
 * ```
 */
const StepsContent = (props: StepsContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsContentSlot
      ref={forwardedRef}
      data-slot="content"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsContentSlot>
  );
};
StepsContent.displayName = "Steps.Content";

/**
 * # Steps.Label
 *
 * Displays the step title.
 *
 * @example
 * ```tsx
 * <Steps.Label>Account Setup</Steps.Label>
 * ```
 */
const StepsLabel = (props: StepsLabelProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsLabelSlot
      ref={forwardedRef}
      data-slot="label"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsLabelSlot>
  );
};
StepsLabel.displayName = "Steps.Label";

/**
 * # Steps.Description
 *
 * Displays optional hint text below the label.
 *
 * @example
 * ```tsx
 * <Steps.Description>Create your account to get started</Steps.Description>
 * ```
 */
const StepsDescription = (props: StepsDescriptionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <StepsDescriptionSlot
      ref={forwardedRef}
      data-slot="description"
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </StepsDescriptionSlot>
  );
};
StepsDescription.displayName = "Steps.Description";

// ============================================================
// NAMESPACE EXPORT
// ============================================================

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

// Also export individual components for consumers who prefer direct imports
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
