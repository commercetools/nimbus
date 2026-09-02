import { Flex } from "@commercetools/nimbus";
import type { ReactNode } from "react";

interface InlineSlotProps {
  /** Layout direction for multiple agent cards */
  direction?: "row" | "column";
  children: ReactNode;
  gap?: string;
  /** Pass-through for tour spotlight targeting */
  "data-tour"?: string;
  [key: `data-${string}`]: string | undefined;
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
  ...rest
}: InlineSlotProps) => {
  return (
    <Flex
      direction={direction}
      gap={gap}
      width="100%"
      data-slot-direction={direction}
      {...rest}
    >
      {children}
    </Flex>
  );
};
