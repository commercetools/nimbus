import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useSlotId } from "@react-aria/utils";
import {
  Provider,
  HeadingContext,
  TextContext,
  DEFAULT_SLOT,
} from "react-aria-components";
import { CardRoot as CardRootSlot } from "../card.slots";
import type { CardProps } from "../card.types";

/**
 * Card.Root - The root component that provides context and styling for the card.
 *
 * When a `<Heading slot="title">` or `<Text slot="description">` is placed
 * inside, the card automatically gains `role="article"` with `aria-labelledby`
 * and/or `aria-describedby` pointing to those elements.
 *
 * @supportsStyleProps
 */
export const CardRoot = ({ ref, children, ...props }: CardProps) => {
  const recipe = useSlotRecipe({ key: "nimbusCard" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);

  const titleId = useSlotId();
  const descriptionId = useSlotId();

  const hasSlots = !!titleId || !!descriptionId;
  const ariaProps = hasSlots
    ? {
        role: "article" as const,
        "aria-labelledby": titleId || undefined,
        "aria-describedby": descriptionId || undefined,
      }
    : {};

  return (
    <Provider
      values={[
        [
          HeadingContext,
          { slots: { [DEFAULT_SLOT]: {}, title: { id: titleId } } },
        ],
        [
          TextContext,
          {
            slots: { [DEFAULT_SLOT]: {}, description: { id: descriptionId } },
          },
        ],
      ]}
    >
      <CardRootSlot ref={ref} {...recipeProps} {...ariaProps} {...restProps}>
        {children}
      </CardRootSlot>
    </Provider>
  );
};

CardRoot.displayName = "Card.Root";
