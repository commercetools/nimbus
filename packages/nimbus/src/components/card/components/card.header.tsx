import { useContext, useEffect } from "react";
import {
  CardHeader as CardHeaderSlot,
  type CardHeaderProps,
} from "../card.slots";
import { CardContext } from "./card.root";

const CardHeader = ({ children, ...props }: CardHeaderProps) => {
  const context = useContext(CardContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <CardHeaderSlot {...props}>{children}</CardHeaderSlot>
      );
      // Register it with the parent
      context.setHeader(slotElement);

      // On unmount, remove it
      return () => context.setHeader(null);
    }
  }, [children, props]);

  return null;
};
CardHeader.displayName = "Card.Header";

export default CardHeader;
