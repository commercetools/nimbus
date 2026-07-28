import { ItemHeaderSlot } from "../item.slots";
import type { ItemHeaderProps } from "../item.types";

/**
 * Item.Header - Optional full-width band rendered above the row.
 *
 * @supportsStyleProps
 */
export const ItemHeader = (props: ItemHeaderProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemHeaderSlot ref={forwardedRef} {...restProps}>
      {children}
    </ItemHeaderSlot>
  );
};

ItemHeader.displayName = "Item.Header";
