import { type ForwardedRef } from "react";
import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { SelectOptionSlot } from "./../select.slots";
import type { SelectOptionProps } from "../select.types";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const SelectOption = fixedForwardRef(
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
);

// @ts-expect-error - doesn't work with this complex types
SelectOption.displayName = "Select.Option";
