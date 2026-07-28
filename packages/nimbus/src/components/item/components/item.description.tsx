import { ItemDescriptionSlot } from "../item.slots";
import type { ItemDescriptionProps } from "../item.types";

/**
 * Item.Description - Secondary text below the title.
 *
 * @supportsStyleProps
 */
export const ItemDescription = (props: ItemDescriptionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemDescriptionSlot ref={forwardedRef} {...restProps}>
      {children}
    </ItemDescriptionSlot>
  );
};

ItemDescription.displayName = "Item.Description";
