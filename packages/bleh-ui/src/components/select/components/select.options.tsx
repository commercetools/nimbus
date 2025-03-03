import { forwardRef, type ReactNode } from "react";

import { ListBox as RaListBox } from "react-aria-components";
import { SelectOptionsSlot } from "./../select.slots";
import type { SelectOptionsProps } from "../select.types";

export const SelectOptions = forwardRef<HTMLDivElement, SelectOptionsProps>(
  ({ items, children, ...props }, forwardedRef) => {
    return (
      <SelectOptionsSlot asChild ref={forwardedRef} {...props}>
        <RaListBox>
          {items
            ? items.map((item) => (children as (item: any) => ReactNode)(item))
            : children}
        </RaListBox>
      </SelectOptionsSlot>
    );
  }
);

SelectOptions.displayName = "Select.Options";
