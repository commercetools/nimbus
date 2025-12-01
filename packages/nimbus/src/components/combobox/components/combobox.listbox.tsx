import { cloneElement, isValidElement, type ReactElement } from "react";
import { ListBox as RaListBox } from "react-aria-components";
import { ComboBoxListBoxSlot } from "../combobox.slots";
import type { ComboBoxListBoxProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.ListBox
 *
 * Container for the dropdown options list that displays filtered results.
 * Use the render prop pattern - do NOT manually map over items as this is less performant.
 * The item is automatically provided from the items passed to ComboBox.Root.
 *
 * Automatically injects `id` and `textValue` props to Option components from item metadata.
 *
 * @example
 * ```tsx
 * <ComboBox.ListBox>
 *   {(item) => (
 *     <ComboBox.Option>
 *       {item.name}
 *     </ComboBox.Option>
 *   )}
 * </ComboBox.ListBox>
 * ```
 *
 * @supportsStyleProps
 */
export function ComboBoxListBox<T extends object>({
  children,
  ref,
  ...restProps
}: ComboBoxListBoxProps<T>) {
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  // Wrap children function to automatically inject id and textValue props
  const wrappedChildren =
    typeof children === "function"
      ? (item: T) => {
          const element = children(item);

          // If item has id or textValue properties, inject them into the Option
          const itemWithMetadata = item as T & {
            id?: string;
            textValue?: string;
          };

          if (
            isValidElement(element) &&
            (itemWithMetadata.id || itemWithMetadata.textValue)
          ) {
            // Clone element and inject id/textValue props
            // Our injected props come AFTER spread to override any existing values
            return cloneElement(
              element as ReactElement<{
                id?: string;
                textValue?: string;
              }>,
              {
                ...(element.props as object),
                ...(itemWithMetadata.id ? { id: itemWithMetadata.id } : {}),
                ...(itemWithMetadata.textValue
                  ? { textValue: itemWithMetadata.textValue }
                  : {}),
              }
            );
          }

          return element;
        }
      : children;

  return (
    <ComboBoxListBoxSlot {...styleProps} ref={ref} asChild>
      <RaListBox {...functionalProps}>{wrappedChildren}</RaListBox>
    </ComboBoxListBoxSlot>
  );
}

ComboBoxListBox.displayName = "ComboBox.ListBox";
