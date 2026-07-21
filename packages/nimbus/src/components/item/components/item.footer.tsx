import { ItemFooterSlot } from "../item.slots";
import type { ItemFooterProps } from "../item.types";

/**
 * Item.Footer - Optional full-width band rendered below the row.
 *
 * @supportsStyleProps
 */
export const ItemFooter = (props: ItemFooterProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemFooterSlot ref={forwardedRef} {...restProps}>
      {children}
    </ItemFooterSlot>
  );
};

ItemFooter.displayName = "Item.Footer";
