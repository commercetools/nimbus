import { type ForwardedRef } from "react";
import { ListBox as RaListBox } from "react-aria-components";
import { ComboBoxListBoxSlot } from "../combobox.slots";
import type { ComboBoxListBoxProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxListBox = fixedForwardRef(
  <T extends object>(
    { children, ...props }: ComboBoxListBoxProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    const [styleProps, rest] = extractStyleProps(props);
    return (
      <ComboBoxListBoxSlot asChild {...styleProps}>
        <RaListBox
          ref={forwardedRef}
          {...rest}
          selectionMode="multiple"
          onSelectionChange={() => {}}
          disallowEmptySelection={false}
        >
          {children}
        </RaListBox>
      </ComboBoxListBoxSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxListBox.displayName = "ComboBox.ListBox";
