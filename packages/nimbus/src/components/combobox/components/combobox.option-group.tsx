import { type RefAttributes, type ReactNode } from "react";
import { Header as RaHeader, Collection } from "react-aria-components";
import { ComboBoxOptionGroupSlot } from "../combobox.slots";
import type { ComboBoxOptionGroupProps } from "../combobox.types";

export const ComboBoxOptionGroup = <T extends object>({
  children,
  label,
  items,
  ref,
  ...props
}: ComboBoxOptionGroupProps<T> & RefAttributes<HTMLDivElement>) => (
  <ComboBoxOptionGroupSlot ref={ref} {...props}>
    <RaHeader>{label}</RaHeader>
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
  </ComboBoxOptionGroupSlot>
);

ComboBoxOptionGroup.displayName = "ComboBox.OptionGroup";
