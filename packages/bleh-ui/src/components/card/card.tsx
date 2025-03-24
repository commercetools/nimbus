import { forwardRef } from "react";
import { CardRoot } from "./card.slots";
import type { CardProps } from "./card.types";

/**
 * Card
 * ============================================================
 * A versatile bordered container for grouping related content
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardRoot ref={ref} {...props}>
        {children}
      </CardRoot>
    );
  }
);
Card.displayName = "Card";
