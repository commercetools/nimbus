import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";
import {
  CardRoot,
  CardHeader as CardHeaderSlot,
  CardContent as CardContentSlot,
  type CardHeaderProps,
} from "./card.slots";
import type { CardProps } from "./card.types";
import { Stack } from "../stack";
import { mergeProps, useFocusRing } from "react-aria";

// Extend the Card's ForwardRef type with the component's compound components
type CardComponent = ForwardRefExoticComponent<
  CardProps & RefAttributes<HTMLDivElement>
> & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
};

type CardContextValue = {
  setHeader: (header: React.ReactNode) => void;
  setContent: (content: React.ReactNode) => void;
};

const CardContext = createContext<CardContextValue | undefined>(undefined);

/**
 * Card
 * ============================================================
 * A versatile bordered container for grouping related content
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
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
        <CardRoot
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
        </CardRoot>
      </CardContext.Provider>
    );
  }
  // We must cast to appease ForwardRef - can't wait for React 19
) as CardComponent;
Card.displayName = "Card";

export const CardHeader = ({ children, ...props }: CardHeaderProps) => {
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
CardHeader.displayName = "CardHeader";

export const CardContent = ({ children, ...props }: CardHeaderProps) => {
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
CardContent.displayName = "CardContent";

Card.Header = CardHeader;
Card.Content = CardContent;
