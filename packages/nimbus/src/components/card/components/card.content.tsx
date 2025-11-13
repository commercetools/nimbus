import { useContext, useEffect } from "react";
import { CardContent as CardContentSlot } from "../card.slots";
import { CardContext } from "./card.root";
import type { CardContentProps } from "../card.types";
import { extractStyleProps } from "@/utils";

/**
 * Card.Content - The main content area of the card
 *
 * @supportsStyleProps
 */
export const CardContent = ({ children, ...props }: CardContentProps) => {
  const context = useContext(CardContext);

  // Standard pattern: Extract and forward style props
  const [styleProps, functionalProps] = extractStyleProps(props);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <CardContentSlot {...styleProps} {...functionalProps}>
          {children}
        </CardContentSlot>
      );
      // Register it with the parent
      context.setContent(slotElement);

      // On unmount, remove it
      return () => context.setContent(null);
    }
  }, [children, styleProps, functionalProps, context]);

  return null;
};

CardContent.displayName = "Card.Content";
