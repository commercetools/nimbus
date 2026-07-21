import { ItemMediaSlot } from "../item.slots";
import type { ItemMediaProps } from "../item.types";

/**
 * Item.Media - Fixed, non-shrinking leading slot for an icon, avatar, or image.
 *
 * `variant` (`default | icon | image`) sizes and shapes the media independently
 * of `Item.Root`'s `variant`; it is applied via a `data-variant` attribute that
 * the recipe's media slot targets.
 *
 * Media is presentation only — it injects no accessible name of its own. Pass a
 * decorative icon (hidden by its own `aria-hidden`) or supply an explicit name
 * on the child when the media is meaningful.
 *
 * @supportsStyleProps
 */
export const ItemMedia = (props: ItemMediaProps) => {
  const {
    ref: forwardedRef,
    children,
    variant = "default",
    ...restProps
  } = props;

  return (
    <ItemMediaSlot ref={forwardedRef} data-variant={variant} {...restProps}>
      {children}
    </ItemMediaSlot>
  );
};

ItemMedia.displayName = "Item.Media";
