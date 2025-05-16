import { type RefAttributes } from "react";
import { Flex } from "@/components";
import { Popover as RaPopover, Input, ListBox } from "react-aria-components";
import { TextInput, IconButton } from "@/components";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { ComboBoxRootSlot, ComboBoxOptionsSlot } from "../combobox.slots";
import { ComboBoxOptions } from "./combobox.options";
import type { ComboBoxRootProps } from "../combobox.types";

export const ComboBoxRoot = <T extends object>({
  children,
  ref,
  ...rest
}: ComboBoxRootProps<T> & RefAttributes<HTMLDivElement>) => {
  return (
    <ComboBoxRootSlot {...rest} ref={ref}>
      <Input />
      <IconButton>
        <KeyboardArrowDown />
      </IconButton>

      <RaPopover>
        <ComboBoxOptions>{children}</ComboBoxOptions>
      </RaPopover>
    </ComboBoxRootSlot>
  );
};

ComboBoxRoot.displayName = "ComboBox.Root";
