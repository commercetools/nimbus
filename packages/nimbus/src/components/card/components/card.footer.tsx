import { CardFooter as CardFooterSlot } from "../card.slots";
import type { CardFooterProps } from "../card.types";

/**
 * Card.Footer - The footer section for actions and metadata
 *
 * @supportsStyleProps
 */
export const CardFooter = (props: CardFooterProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <CardFooterSlot ref={forwardedRef} {...restProps}>
      {children}
    </CardFooterSlot>
  );
};

CardFooter.displayName = "Card.Footer";
