import { forwardRef, type ForwardedRef } from "react";
import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { SelectOptionSlot } from "./../select.slots";
import type { SelectOptionProps } from "../select.types";

export const SelectOption = forwardRef(
  <T extends object>(
    props: SelectOptionProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <SelectOptionSlot asChild ref={forwardedRef}>
        <RaListBoxItem {...props} />
      </SelectOptionSlot>
    );
  }
) as <T extends object>(props: SelectOptionProps<T>) => JSX.Element;

// @ts-expect-error - doesn't work with this complex types
SelectOption.displayName = "Select.Option";
