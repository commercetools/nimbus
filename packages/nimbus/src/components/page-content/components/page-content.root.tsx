import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { PageContentRootSlot } from "../page-content.slots";
import type { PageContentProps } from "../page-content.types";

/**
 * PageContent.Root - The root layout container that provides width constraints
 * and column layout via CSS grid.
 *
 * Uses a 3-column centering grid (`1fr minmax(min, max) 1fr`) to enforce
 * min/max width constraints. An inner content div (targeted via `data-slot`)
 * handles column layout when `columns` is set.
 *
 * @supportsStyleProps
 */
export const PageContentRoot = ({
  ref,
  children,
  ...props
}: PageContentProps) => {
  const recipe = useSlotRecipe({ key: "nimbusPageContent" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);

  return (
    <PageContentRootSlot ref={ref} {...recipeProps} {...restProps}>
      <div data-slot="content">{children}</div>
    </PageContentRootSlot>
  );
};

PageContentRoot.displayName = "PageContent.Root";
