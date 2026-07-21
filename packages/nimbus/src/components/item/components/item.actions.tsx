import { ItemActionsSlot } from "../item.slots";
import type { ItemActionsProps } from "../item.types";

/**
 * Item.Actions - Trailing slot for interactive controls (Button, IconButton).
 *
 * Controls placed here keep a focus order independent of a link-mode
 * `Item.Root`, and — via the `data-item-actions` marker that a link-mode root
 * watches for — activate without triggering row navigation.
 *
 * @supportsStyleProps
 */
export const ItemActions = (props: ItemActionsProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemActionsSlot ref={forwardedRef} data-item-actions="" {...restProps}>
      {children}
    </ItemActionsSlot>
  );
};

ItemActions.displayName = "Item.Actions";
