import { forwardRef } from "react";

import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { SelectOptionGroupSlot } from "./../select.slots";
import type { SelectOptionGroupProps } from "../select.types";

export const SelectOptionGroup = forwardRef<
  HTMLDivElement,
  SelectOptionGroupProps
>(({ label, items, children, ...props }, ref) => {
  // Validate that children is a function when items is provided
  if (items && typeof children !== "function") {
    throw new Error(
      'SelectOptionGroup: When "items" is provided, "children" must be a function'
    );
  }

  return (
    <RaListBoxSection ref={ref} {...props}>
      <SelectOptionGroupSlot asChild>
        <RaHeader>{label}</RaHeader>
      </SelectOptionGroupSlot>

      {items ? (
        <Collection items={items as Iterable<object>}>{children}</Collection>
      ) : (
        children
      )}
    </RaListBoxSection>
  );
});

SelectOptionGroup.displayName = "Select.OptionGroup";
