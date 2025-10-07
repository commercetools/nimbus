import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { SelectOptionSlot } from "./../select.slots";
import type { SelectOptionProps } from "../select.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const SelectOption = <T extends object>({
  ref,
  ...restProps
}: SelectOptionProps<T>) => {
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <SelectOptionSlot asChild {...styleProps}>
      <RaListBoxItem ref={ref} {...functionalProps} />
    </SelectOptionSlot>
  );
};

SelectOption.displayName = "Select.Option";
