import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { MainPageRootSlot } from "../main-page.slots";
import type { MainPageProps } from "../main-page.types";

/**
 * MainPage.Root - The root page container that provides a CSS grid layout
 * with header, content, and optional footer areas.
 *
 * @supportsStyleProps
 */
export const MainPageRoot = ({ ref, children, ...props }: MainPageProps) => {
  const recipe = useSlotRecipe({ key: "nimbusMainPage" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);

  return (
    <MainPageRootSlot ref={ref} {...recipeProps} {...restProps}>
      {children}
    </MainPageRootSlot>
  );
};

MainPageRoot.displayName = "MainPage.Root";
