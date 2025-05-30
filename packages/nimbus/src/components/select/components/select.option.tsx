import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { SelectOptionSlot } from "./../select.slots";
import type { SelectOptionProps } from "../select.types";

export const SelectOption = <T extends object>(
  props: SelectOptionProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => {
  const { ref, ...restProps } = props;
  return (
    <SelectOptionSlot asChild ref={ref}>
      <RaListBoxItem {...restProps} />
    </SelectOptionSlot>
  );
};

SelectOption.displayName = "Select.Option";
