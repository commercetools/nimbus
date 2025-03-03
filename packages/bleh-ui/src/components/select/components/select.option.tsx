import { forwardRef } from "react";
import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { SelectOptionSlot } from "./../select.slots";
import type { SelectOptionProps } from "../select.types";

export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  ({ ...props }, ref) => {
    return (
      <SelectOptionSlot asChild ref={ref}>
        <RaListBoxItem {...props} />
      </SelectOptionSlot>
    );
  }
);

SelectOption.displayName = "Select.Option";
