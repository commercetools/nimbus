import { createContext, useMemo, useState, type ReactNode } from "react";
import { CardRoot as CardRootSlot } from "../card.slots";
import type { CardProps } from "../card.types";
import { Stack } from "../../stack";

type CardContextValue = {
  setHeader: (header: React.ReactNode) => void;
  setContent: (content: React.ReactNode) => void;
};

export const CardContext = createContext<CardContextValue | undefined>(
  undefined
);

/**
 * # Card
 *
 * A versatile container component presents self-contained information
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/card}
 */
export const CardRoot = ({ children, ref, ...props }: CardProps) => {
  const [headerNode, setHeader] = useState<ReactNode>(null);
  const [contentNode, setContent] = useState<ReactNode>(null);

  // Memoize the context value so we don't cause unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      setHeader,
      setContent,
    }),
    [setHeader, setContent]
  );

  return (
    <CardContext.Provider value={contextValue}>
      <CardRootSlot ref={ref} {...props}>
        {/* Always render them in this order/layout to protect consumers */}
        <Stack direction="column" gap="200">
          {headerNode}
          {contentNode}
        </Stack>

        {/* Render all consumer sub-components, including our own */}
        {children}
      </CardRootSlot>
    </CardContext.Provider>
  );
};

CardRoot.displayName = "Card.Root";
