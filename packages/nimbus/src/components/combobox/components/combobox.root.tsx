import { type RefAttributes } from "react";
import { Flex } from "@/components";
import { Popover as RaPopover, Input } from "react-aria-components";
import { TextInput, IconButton } from "@/components";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { ComboBoxRootSlot, ComboBoxOptionsSlot } from "../combobox.slots";
import type { ComboBoxRootProps } from "../combobox.types";

export const ComboBoxRoot = <T extends object>({
  children,
  ref,
  ...rest
}: ComboBoxRootProps<T> & RefAttributes<HTMLDivElement>) => {
  return (
    <ComboBoxRootSlot {...rest} ref={ref}>
      <Flex>
        <TextInput />
        {
          //@ts-expect-error aria props are handled by ButtonContext internally in IconButton
          <IconButton>
            <KeyboardArrowDown />
          </IconButton>
        }
      </Flex>
      <RaPopover>
        <ComboBoxOptionsSlot>{children}</ComboBoxOptionsSlot>
      </RaPopover>
    </ComboBoxRootSlot>
  );
};

ComboBoxRoot.displayName = "ComboBox.Root";
