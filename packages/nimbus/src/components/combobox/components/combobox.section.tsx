import { type RefAttributes, type ReactNode } from "react";
import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { ComboBoxSectionSlot } from "../combobox.slots";
import type { ComboBoxSectionProps } from "../combobox.types";

/**
 * # ComboBox.Section
 *
 * Section grouping for options with optional label header.
 * Wraps React Aria's ListBoxSection component.
 * Supports both static children and collection rendering with items.
 *
 * @example Static children
 * ```tsx
 * <ComboBox.ListBox>
 *   <ComboBox.Section label="Fruits">
 *     <ComboBox.Option id="apple">Apple</ComboBox.Option>
 *     <ComboBox.Option id="banana">Banana</ComboBox.Option>
 *   </ComboBox.Section>
 * </ComboBox.ListBox>
 * ```
 *
 * @example Collection rendering
 * ```tsx
 * <ComboBox.Section label="Fruits" items={fruits}>
 *   {(item) => <ComboBox.Option id={item.id}>{item.name}</ComboBox.Option>}
 * </ComboBox.Section>
 * ```
 *
 * @supportsStyleProps
 */
export function ComboBoxSection<T extends object>({
  children,
  label,
  items,
  ref,
  ...props
}: ComboBoxSectionProps<T> & RefAttributes<HTMLDivElement>) {
  // Validate that children is a function when items is provided
  if (items && typeof children !== "function") {
    throw new Error(
      'ComboBox.Section: When "items" is provided, "children" must be a function'
    );
  }

  return (
    <RaListBoxSection ref={ref} {...props}>
      {label && (
        <ComboBoxSectionSlot asChild>
          <RaHeader>{label}</RaHeader>
        </ComboBoxSectionSlot>
      )}
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

ComboBoxSection.displayName = "ComboBox.Section";
