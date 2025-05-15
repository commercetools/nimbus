import { type ForwardedRef } from "react";
import { ComboBoxOptionSlot } from "../combobox.slots";
import type { ComboBoxOptionProps } from "../combobox.types";
import { ListBoxItem } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxOption = fixedForwardRef(
  <T extends object>(
    { children, ...props }: ComboBoxOptionProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [styleProps, restProps] = extractStyleProps(props);
    return (
      <ComboBoxOptionSlot {...styleProps} asChild>
        <ListBoxItem ref={ref} {...restProps}>
          {children}
        </ListBoxItem>
      </ComboBoxOptionSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxOption.displayName = "ComboBox.Option";
