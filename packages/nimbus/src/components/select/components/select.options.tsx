import { ListBox as RaListBox } from "react-aria-components";
import { SelectOptionsSlot } from "./../select.slots";
import type { SelectOptionsProps } from "../select.types";
import { extractStyleProps } from "@/utils";

export const SelectOptions = <T extends object>(
  props: SelectOptionsProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => {
  const { ref, ...restProps } = props;
  const [styleProps, rest] = extractStyleProps(restProps);
  return (
    <SelectOptionsSlot asChild {...styleProps}>
      <RaListBox ref={ref} {...rest} />
    </SelectOptionsSlot>
  );
};

SelectOptions.displayName = "Select.Options";
