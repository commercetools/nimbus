import { ListItemSlot } from "../list.slots";
import type { ListItemProps } from "../list.types";

/**
 * # ListItem
 *
 * Represents a single item in the list.
 * Should be used as a child of ListRoot.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <ListItem>List item content</ListItem>
 * ```
 */
export const ListItem = (props: ListItemProps) => {
  return <ListItemSlot {...props} />;
};

ListItem.displayName = "List.Item";
