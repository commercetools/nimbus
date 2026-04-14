import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { CardRoot as CardRootSlot } from "../card.slots";
import type { CardProps } from "../card.types";

/**
 * Card.Root - The root component that provides context and styling for the card
 *
 * @supportsStyleProps
 */
export const CardRoot = ({ ref, children, ...props }: CardProps) => {
  const recipe = useSlotRecipe({ key: "nimbusCard" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);

  return (
    <CardRootSlot ref={ref} {...recipeProps} {...restProps}>
      {children}
    </CardRootSlot>
  );
};

CardRoot.displayName = "Card.Root";
