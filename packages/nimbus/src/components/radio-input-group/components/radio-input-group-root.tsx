import { forwardRef, type ReactNode, createContext, useContext } from "react";
import { useRadioGroupState } from "react-stately";
import { useRadioGroup } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react";
import type { RadioGroupProps } from "../radio-input-group.types";
import {
  RadioInputRoot as RadioInputRootSlot,
  RadioInputGroupSlot,
} from "../radio-input-group.slots";

import type { RadioGroupState } from "react-stately";

export const RadioInputGroupStateContext =
  createContext<RadioGroupState | null>(null);

export function useRadioGroupContext() {
  return useContext(RadioInputGroupStateContext);
}

export const RadioInputGroupRoot = forwardRef<
  HTMLLabelElement,
  RadioGroupProps & { children: ReactNode }
>(({ children, label, ...props }, forwardedRef) => {
  const state = useRadioGroupState(props);
  const { radioGroupProps, labelProps } = useRadioGroup(props, state);
  const recipe = useSlotRecipe({ key: "radioInput" });
  const [recipeProps] = recipe.splitVariantProps(props);

  return (
    <RadioInputGroupStateContext.Provider value={state}>
      <RadioInputRootSlot
        data-slot="root"
        ref={forwardedRef}
        {...radioGroupProps}
        {...recipeProps}
      >
        {label && <legend {...labelProps}>{label}</legend>}
        <RadioInputGroupSlot data-slot="group" {...recipeProps}>
          {children}
        </RadioInputGroupSlot>
      </RadioInputRootSlot>
    </RadioInputGroupStateContext.Provider>
  );
});

RadioInputGroupRoot.displayName = "RadioInputGroup.Root";
