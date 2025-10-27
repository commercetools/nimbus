import { useContext, useEffect } from "react";
import { CardHeader as CardHeaderSlot } from "../card.slots";
import { CardContext } from "./card.root";
import type { CardHeaderProps } from "../card.types";
import { extractStyleProps } from "@/utils";

/**
 * Card.Header - The header section of the card
 *
 * @supportsStyleProps
 */
export const CardHeader = ({ children, ...props }: CardHeaderProps) => {
  const context = useContext(CardContext);

  // Standard pattern: Extract and forward style props
  const [styleProps, functionalProps] = extractStyleProps(props);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <CardHeaderSlot {...styleProps} {...functionalProps}>
          {children}
        </CardHeaderSlot>
      );
      // Register it with the parent
      context.setHeader(slotElement);

      // On unmount, remove it
      return () => context.setHeader(null);
    }
  }, [children, styleProps, functionalProps, context]);

  return null;
};
CardHeader.displayName = "Card.Header";
