import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DetailPageRootSlot } from "../detail-page.slots";
import type { DetailPageProps } from "../detail-page.types";

/**
 * DetailPage.Root - The root container for the detail page layout
 *
 * @supportsStyleProps
 */
export const DetailPageRoot = ({
  ref,
  children,
  ...props
}: DetailPageProps) => {
  const recipe = useSlotRecipe({ key: "nimbusDetailPage" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);

  return (
    <DetailPageRootSlot ref={ref} {...recipeProps} {...restProps}>
      {children}
    </DetailPageRootSlot>
  );
};

DetailPageRoot.displayName = "DetailPage.Root";
