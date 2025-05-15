import { type ForwardedRef } from "react";
import { ListBox as RaListBox } from "react-aria-components";
import { ComboBoxOptionsSlot } from "../combobox.slots";
import type { ComboBoxOptionsProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxOptions = fixedForwardRef(
  <T extends object>(
    { children, ...props }: ComboBoxOptionsProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [styleProps, restProps] = extractStyleProps(props);
    return (
      <ComboBoxOptionsSlot {...styleProps} asChild>
        <RaListBox ref={ref} {...restProps}>
          {children}
        </RaListBox>
      </ComboBoxOptionsSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxOptions.displayName = "ComboBox.Options";
