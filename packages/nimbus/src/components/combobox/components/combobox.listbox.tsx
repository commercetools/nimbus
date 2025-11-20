import { ListBox as RaListBox } from "react-aria-components";
import { ComboBoxListBoxSlot } from "../combobox.slots";
import type { ComboBoxListBoxProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.ListBox
 *
 * Container for options list.
 * Uses useListBox hook from React Aria to build the listbox with proper ARIA attributes.
 *
 * @example
 * ```tsx
 * <ComboBox.ListBox>
 *   {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
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

  return (
    <ComboBoxListBoxSlot {...styleProps} ref={ref} asChild>
      <RaListBox
        {...functionalProps}
        shouldFocusOnHover={true}
        shouldFocusWrap={true}
      >
        {children}
      </RaListBox>
    </ComboBoxListBoxSlot>
  );
}

ComboBoxListBox.displayName = "ComboBox.ListBox";
