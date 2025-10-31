import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { SelectOptionSlot } from "./../select.slots";
import type { SelectOptionProps } from "../select.types";
import { extractStyleProps } from "@/utils";

/**
 * Select.Option - An individual selectable option within the select dropdown
 *
 * @supportsStyleProps
 */
export const SelectOption = (props: SelectOptionProps) => {
  const { ref, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <SelectOptionSlot asChild {...styleProps}>
      <RaListBoxItem ref={ref} {...functionalProps} />
    </SelectOptionSlot>
  );
};

SelectOption.displayName = "Select.Option";
