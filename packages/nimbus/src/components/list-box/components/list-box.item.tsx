import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { ListBoxItemSlot } from "../list-box.slots";
import type { ListBoxItemProps } from "../list-box.types";

/**
 * ListBox.Item
 *
 * A single focusable option in the list box (`role="option"`). Participates in
 * keyboard navigation, selection, and type-ahead. May render arbitrary content
 * via `children`.
 *
 * @supportsStyleProps
 */
export const ListBoxItem = ({ children, ref, ...props }: ListBoxItemProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <ListBoxItemSlot ref={ref} {...styleProps} asChild>
      <RaListBoxItem {...functionalProps}>{children}</RaListBoxItem>
    </ListBoxItemSlot>
  );
};

ListBoxItem.displayName = "ListBox.Item";
