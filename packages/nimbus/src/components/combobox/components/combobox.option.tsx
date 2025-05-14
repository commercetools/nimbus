import { type RefAttributes } from "react";

import { ComboBoxOptionSlot } from "../combobox.slots";
import type { ComboBoxOptionProps } from "../combobox.types";
import { ListBoxItem } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ComboBoxOption = <T extends object>({
  children,
  ref,
  ...props
}: ComboBoxOptionProps<T> & RefAttributes<HTMLDivElement>) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <ComboBoxOptionSlot asChild>
      <ListBoxItem ref={ref} {...restProps} {...styleProps}>
        {children}
      </ListBoxItem>
    </ComboBoxOptionSlot>
  );
};

ComboBoxOption.displayName = "ComboBox.Option";
