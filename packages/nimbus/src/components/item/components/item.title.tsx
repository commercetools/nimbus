import { ItemTitleSlot } from "../item.slots";
import type { ItemTitleProps } from "../item.types";

/**
 * Item.Title - The primary label of the row.
 *
 * @supportsStyleProps
 */
export const ItemTitle = (props: ItemTitleProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemTitleSlot ref={forwardedRef} {...restProps}>
      {children}
    </ItemTitleSlot>
  );
};

ItemTitle.displayName = "Item.Title";
