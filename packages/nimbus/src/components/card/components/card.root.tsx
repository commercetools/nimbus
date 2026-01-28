import { createContext, useMemo, useState, type ReactNode } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { CardRoot as CardRootSlot } from "../card.slots";
import type { CardProps } from "../card.types";
import { Stack } from "../../stack";
import { extractStyleProps } from "@/utils";

type CardContextValue = {
  setHeader: (header: React.ReactNode) => void;
  setContent: (content: React.ReactNode) => void;
};

export const CardContext = createContext<CardContextValue | undefined>(
  undefined
);

/**
 * Card.Root - The root component that provides context and styling for the card
 *
 * @supportsStyleProps
 */
export const CardRoot = ({ ref, children, ...props }: CardProps) => {
  // Standard pattern: First split recipe variants
  const recipe = useSlotRecipe({ key: "nimbusCard" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Second extract style props from remaining
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

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
        {...recipeProps}
        {...styleProps}
        {...functionalProps}
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
};

CardRoot.displayName = "Card.Root";
