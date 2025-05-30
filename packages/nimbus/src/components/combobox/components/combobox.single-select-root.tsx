import { type ForwardedRef } from "react";
import {
  ComboBox as RaComboBox,
  Popover as RaPopover,
  Input,
} from "react-aria-components";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.button-group";

import type { ComboBoxSingleSelectRootProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";

export const SingleSelectRoot = <T extends object>({
  children,
  ref,
  ...rest
}: ComboBoxSingleSelectRootProps<T>) => {
  return (
    <RaComboBox {...rest} ref={ref}>
      <ComboBoxValueSlot asChild>
        <Input />
      </ComboBoxValueSlot>
      <ComboBoxButtonGroup />
      <RaPopover>
        <ComboBoxOptions>{children}</ComboBoxOptions>
      </RaPopover>
    </RaComboBox>
  );
};
