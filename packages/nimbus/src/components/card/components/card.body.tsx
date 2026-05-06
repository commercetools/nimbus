import { CardBody as CardBodySlot } from "../card.slots";
import type { CardBodyProps } from "../card.types";

/**
 * Card.Body - The main content area of the card
 *
 * @supportsStyleProps
 */
export const CardBody = (props: CardBodyProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <CardBodySlot ref={forwardedRef} {...restProps}>
      {children}
    </CardBodySlot>
  );
};

CardBody.displayName = "Card.Body";
