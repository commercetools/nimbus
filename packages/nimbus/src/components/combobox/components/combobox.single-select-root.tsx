import { type ForwardedRef } from "react";
// import { Flex } from "@/components";
import {
  ComboBox as RaComboBox,
  Popover as RaPopover,
  Input,
} from "react-aria-components";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.button-group";
import type { ComboBoxRootProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const SingleSelectRoot = fixedForwardRef(
  <T extends object>(
    { children, ...rest }: ComboBoxRootProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
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
  }
);
