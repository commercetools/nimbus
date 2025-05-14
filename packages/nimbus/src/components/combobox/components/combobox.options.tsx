import { type RefAttributes, useContext } from "react";
import { ComboBoxStateContext, ListBox } from "react-aria-components";
import { ComboBoxOptionsSlot } from "../combobox.slots";
import type { ComboBoxOptionsProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ComboBoxOptions = <T extends object>({
  children,
  ref,
  ...props
}: ComboBoxOptionsProps<T> & RefAttributes<HTMLDivElement>) => {
  const [styleProps, restProps] = extractStyleProps(props);

  const state = useContext(ComboBoxStateContext);
  console.log(state);
  return (
    <ComboBoxOptionsSlot asChild>
      <ListBox ref={ref} {...restProps} {...styleProps}>
        {children}
      </ListBox>
    </ComboBoxOptionsSlot>
  );
};

ComboBoxOptions.displayName = "ComboBox.Options";
