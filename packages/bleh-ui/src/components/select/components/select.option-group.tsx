import { forwardRef, type ReactNode } from "react";
import { chakra } from "@chakra-ui/react";

import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
} from "react-aria-components";
import { SelectOptionGroupSlot } from "./../select.slots";
import type { SelectOptionGroupProps } from "../select.types";

export const SelectOptionGroup = forwardRef<
  HTMLDivElement,
  SelectOptionGroupProps & {
    label: string;
  }
>(({ label, items, children, ...props }, ref) => {
  return (
    <chakra.div asChild ref={ref} {...props}>
      <RaListBoxSection>
        <SelectOptionGroupSlot asChild>
          <RaHeader>{label}</RaHeader>
        </SelectOptionGroupSlot>
        {items
          ? items.map((item) => (children as (item: any) => ReactNode)(item))
          : children}
      </RaListBoxSection>
    </chakra.div>
  );
});

SelectOptionGroup.displayName = "Select.OptionGroup";
