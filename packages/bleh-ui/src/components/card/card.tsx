import { forwardRef } from "react";
import { CardRoot } from "./card.slots";
import type { CardProps } from "./card.types";

/**
 * Card
 * ============================================================
 * A versatile bordered container for grouping related content
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
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
