import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { FeedbackCardRoot as FeedbackCardRootSlot } from "../feedback-card.slots";
import type { FeedbackCardRootProps } from "../feedback-card.types";

/**
 * FeedbackCard.Root — the layout container.
 *
 * Renders a responsive, wrapping flex row that positions the content and the
 * action. It is a neutral `<div>` with no implicit ARIA role; `role`, `aria-*`,
 * and other attributes forward through, so consumers can opt into grouping
 * semantics (e.g. `role="group"` + `aria-label`). All Chakra style props are
 * forwarded, which is how consumers supply the visual context.
 *
 * @supportsStyleProps
 */
export const FeedbackCardRoot = ({
  ref,
  children,
  ...props
}: FeedbackCardRootProps) => {
  // No variants exist on this recipe; splitting is kept for consistency with
  // the design-system Root pattern and to keep any future variant props off
  // the DOM element.
  const recipe = useSlotRecipe({ key: "nimbusFeedbackCard" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);

  return (
    <FeedbackCardRootSlot ref={ref} {...recipeProps} {...restProps}>
      {children}
    </FeedbackCardRootSlot>
  );
};

FeedbackCardRoot.displayName = "FeedbackCard.Root";
