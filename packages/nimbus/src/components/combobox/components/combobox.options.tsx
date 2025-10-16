import { ListBox as RaListBox } from "react-aria-components";
import { ComboBoxOptionsSlot } from "../combobox.slots";
import type { ComboBoxOptionsProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

export const ComboBoxOptions = <T extends object>({
  children,
  ref,
  ...props
}: ComboBoxOptionsProps<T>) => {
  const [styleProps, restProps] = extractStyleProps(props);
  return (
    <ComboBoxOptionsSlot {...styleProps} asChild>
      <RaListBox ref={ref} {...restProps}>
        {children}
      </RaListBox>
    </ComboBoxOptionsSlot>
  );
};

ComboBoxOptions.displayName = "ComboBox.Options";
