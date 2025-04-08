import {
  createContext,
  forwardRef,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CardRoot as CardRootSlot } from "../card.slots";
import type { CardProps } from "../card.types";
import { Stack } from "../../stack";
import { mergeProps, useFocusRing } from "react-aria";

type CardContextValue = {
  setHeader: (header: React.ReactNode) => void;
  setContent: (content: React.ReactNode) => void;
};

export const CardContext = createContext<CardContextValue | undefined>(
  undefined
);

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    const { isFocused, isFocusVisible, focusProps } = useFocusRing();
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
        <CardRootSlot
          ref={ref}
          {...mergeProps(props, focusProps)}
          data-focus={isFocused || undefined}
          data-focus-visible={isFocusVisible || undefined}
          tabIndex={0}
        >
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
  }
);

CardRoot.displayName = "Card.Root";

export default CardRoot;
