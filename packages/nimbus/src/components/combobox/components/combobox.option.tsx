import { type RefAttributes } from "react";

import { ComboBoxOptionSlot } from "../combobox.slots";
import type { ComboBoxOptionProps } from "../combobox.types";

export const ComboBoxOption = <T extends object>({
  children,
  ref,
  ...props
}: ComboBoxOptionProps<T> & RefAttributes<HTMLDivElement>) => (
  <ComboBoxOptionSlot ref={ref} {...props}>
    {children}
  </ComboBoxOptionSlot>
);

ComboBoxOption.displayName = "ComboBox.Option";
