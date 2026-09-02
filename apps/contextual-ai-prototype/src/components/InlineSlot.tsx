import { Flex } from "@commercetools/nimbus";
import type { ReactNode } from "react";

interface InlineSlotProps {
  /** Layout direction for multiple agent cards */
  direction?: "row" | "column";
  children: ReactNode;
  gap?: string;
}

/**
 * Container for inline render targets. Renders agent cards in a
 * horizontal row (dashboards, wide content) or vertical stack
 * (narrow columns, expanded table rows).
 */
export const InlineSlot = ({
  direction = "column",
  children,
  gap = "300",
}: InlineSlotProps) => {
  return (
    <Flex
      direction={direction}
      gap={gap}
      width="100%"
      data-slot-direction={direction}
    >
      {children}
    </Flex>
  );
};
