import { type RefAttributes } from "react";
import { Flex } from "@/components";
import {
  Popover as RaPopover,
  Input,
  ListBox,
  ComboBox,
} from "react-aria-components";
import { TextInput, IconButton } from "@/components";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { ComboBoxRootSlot, ComboBoxOptionsSlot } from "../combobox.slots";
import { ComboBoxOptions } from "./combobox.options";
import type { ComboBoxRootProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ComboBoxRoot = <T extends object>({
  children,
  ref,
  ...rest
}: ComboBoxRootProps<T> & RefAttributes<HTMLDivElement>) => {
  const [styleProps, restProps] = extractStyleProps(rest);
  return (
    <ComboBox {...restProps} ref={ref}>
      <ComboBoxRootSlot {...styleProps}>
        <Input />
        <IconButton>
          <KeyboardArrowDown />
        </IconButton>

        <RaPopover>
          <ComboBoxOptions>{children}</ComboBoxOptions>
        </RaPopover>
      </ComboBoxRootSlot>
    </ComboBox>
  );
};

ComboBoxRoot.displayName = "ComboBox.Root";
