import { CardHeader as CardHeaderSlot } from "../card.slots";
import type { CardHeaderProps } from "../card.types";

/**
 * Card.Header - The header section of the card
 *
 * @supportsStyleProps
 */
export const CardHeader = (props: CardHeaderProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <CardHeaderSlot ref={forwardedRef} {...restProps}>
      {children}
    </CardHeaderSlot>
  );
};

CardHeader.displayName = "Card.Header";
