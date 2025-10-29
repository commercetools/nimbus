import { ListBox as RaListBox } from "react-aria-components";
import { ComboBoxListBoxSlot } from "../combobox.slots";
import type { ComboBoxListBoxProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.ListBox
 *
 * Container for options list.
 * Reads from ListBoxContext provided by the custom context provider.
 *
 * The ListBoxContext provides:
 * - id (for aria-controls reference)
 * - aria-labelledby
 * - items collection
 * - selection mode and state
 * - renderEmptyState function
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
export const ComboBoxListBox = ({
  children,
  ...restProps
}: ComboBoxListBoxProps) => {
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <ComboBoxListBoxSlot asChild {...styleProps}>
      {/* RaListBox reads renderEmptyState from ListBoxContext */}
      <RaListBox {...functionalProps}>{children}</RaListBox>
    </ComboBoxListBoxSlot>
  );
};

ComboBoxListBox.displayName = "ComboBox.ListBox";
