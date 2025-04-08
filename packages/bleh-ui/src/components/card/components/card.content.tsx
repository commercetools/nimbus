import { useContext, useEffect } from "react";
import {
  CardContent as CardContentSlot,
  type CardContentProps,
} from "../card.slots";
import { CardContext } from "./card.root";

export const CardContent = ({ children, ...props }: CardContentProps) => {
  const context = useContext(CardContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <CardContentSlot {...props}>{children}</CardContentSlot>
      );
      // Register it with the parent
      context.setContent(slotElement);

      // On unmount, remove it
      return () => context.setContent(null);
    }
  }, [children, props]);

  return null;
};

CardContent.displayName = "Card.Content";

export default CardContent;
