import { forwardRef, type ForwardedRef, type ReactNode } from "react";

import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { SelectOptionGroupSlot } from "./../select.slots";
import type { SelectOptionGroupProps } from "../select.types";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const SelectOptionGroup = fixedForwardRef(
  <T extends object>(
    { label, items, children, ...props }: SelectOptionGroupProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    // Validate that children is a function when items is provided
    if (items && typeof children !== "function") {
      throw new Error(
        'SelectOptionGroup: When "items" is provided, "children" must be a function'
      );
    }

    return (
      <RaListBoxSection ref={forwardedRef} {...props}>
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
  }
);

// @ts-expect-error - doesn't work with this complex types
SelectOptionGroup.displayName = "Select.OptionGroup";
