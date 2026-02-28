import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DetailPageRootSlot } from "../detail-page.slots";
import type { DetailPageProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

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
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <DetailPageRootSlot
      ref={ref}
      {...recipeProps}
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </DetailPageRootSlot>
  );
};

DetailPageRoot.displayName = "DetailPage.Root";
