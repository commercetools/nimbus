import { ItemContentSlot } from "../item.slots";
import type { ItemContentProps } from "../item.types";

/**
 * Item.Content - The growing middle column that wraps Item.Title and
 * Item.Description.
 *
 * @supportsStyleProps
 */
export const ItemContent = (props: ItemContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemContentSlot ref={forwardedRef} {...restProps}>
      {children}
    </ItemContentSlot>
  );
};

ItemContent.displayName = "Item.Content";
