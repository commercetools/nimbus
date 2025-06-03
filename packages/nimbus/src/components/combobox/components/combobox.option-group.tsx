import { type RefAttributes, type ReactNode } from "react";
import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { ComboBoxOptionGroupSlot } from "../combobox.slots";
import type { ComboBoxOptionGroupProps } from "../combobox.types";

export const ComboBoxOptionGroup = <T extends object>({
  children,
  label,
  items,
  ref,
  ...props
}: ComboBoxOptionGroupProps<T> & RefAttributes<HTMLDivElement>) => {
  // Validate that items have proper keys for React Aria Collections
  if (items) {
    const itemsArray = Array.from(items);
    if (itemsArray.length > 0 && !("id" in itemsArray[0])) {
      throw new Error(
        'ComboBoxOptionGroup: When "items" is provided, each item must have an "id" property'
      );
    }
  }

  // Validate that children is a function when items is provided
  if (items && typeof children !== "function") {
    throw new Error(
      'ComboBoxOptionGroup: When "items" is provided, "children" must be a function'
    );
  }
  return (
    <RaListBoxSection ref={ref} {...props}>
      <ComboBoxOptionGroupSlot asChild>
        <RaHeader>{label}</RaHeader>
      </ComboBoxOptionGroupSlot>
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

ComboBoxOptionGroup.displayName = "ComboBox.OptionGroup";
