import { type RefAttributes, useContext } from "react";
import { ComboBoxStateContext } from "react-aria-components";
import { ComboBoxOptionsSlot } from "../combobox.slots";
import type { ComboBoxOptionsProps } from "../combobox.types";

export const ComboBoxOptions = <T extends object>({
  children,
  ref,
  ...props
}: ComboBoxOptionsProps<T> & RefAttributes<HTMLDivElement>) => {
  const state = useContext(ComboBoxStateContext);
  console.log(state?.inputValue);
  return (
    <ComboBoxOptionsSlot ref={ref} {...props}>
      {children}
    </ComboBoxOptionsSlot>
  );
};

ComboBoxOptions.displayName = "ComboBox.Options";
