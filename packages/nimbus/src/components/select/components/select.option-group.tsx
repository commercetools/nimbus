import { type ReactNode } from "react";

import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { SelectOptionGroupSlot } from "./../select.slots";
import type { SelectOptionGroupProps } from "../select.types";

export const SelectOptionGroup = <T extends object>(
  props: SelectOptionGroupProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => {
  const { ref, label, items, children, ...restProps } = props;

  // Validate that children is a function when items is provided
  if (items && typeof children !== "function") {
    throw new Error(
      'SelectOptionGroup: When "items" is provided, "children" must be a function'
    );
  }

  return (
    <RaListBoxSection ref={ref} {...restProps}>
      <SelectOptionGroupSlot asChild>
        <RaHeader>{label}</RaHeader>
      </SelectOptionGroupSlot>

      {items ? (
        <Collection items={items}>
          {(item: T) => {
            if (typeof children === "function") {
              return children(item);
            }
            return null;
          }}
        </Collection>
      ) : (
        (children as ReactNode)
      )}
    </RaListBoxSection>
  );
};

SelectOptionGroup.displayName = "Select.OptionGroup";
