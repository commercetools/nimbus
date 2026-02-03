import { createContext, useContext } from "react";
import type { StepsContextValue, StepsItemContextValue } from "../steps.types";

export const StepsContext = createContext<StepsContextValue | null>(null);

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

export const StepsItemContext = createContext<StepsItemContextValue | null>(
  null
);

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
