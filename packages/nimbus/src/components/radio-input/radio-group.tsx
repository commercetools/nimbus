import { useRadioGroupState } from "react-stately";
import { useRadioGroup } from "react-aria";
import { createContext, useContext } from "react";
import type { RadioGroupProps } from "./radio-input.types";
import type { ReactNode } from "react";

const RadioGroupContext = createContext<any>(null);

export function useRadioGroupContext() {
  return useContext(RadioGroupContext);
}

export const RadioGroup = (
  props: RadioGroupProps & { children: ReactNode }
) => {
  const state = useRadioGroupState(props);
  const { radioGroupProps, labelProps } = useRadioGroup(props, state);

  return (
    <div {...radioGroupProps}>
      {props.label && <span {...labelProps}>{props.label}</span>}
      <RadioGroupContext.Provider value={state}>
        {props.children}
      </RadioGroupContext.Provider>
    </div>
  );
};
