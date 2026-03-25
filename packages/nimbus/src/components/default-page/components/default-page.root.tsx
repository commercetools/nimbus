import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DefaultPageRootSlot } from "../default-page.slots";
import type { DefaultPageProps } from "../default-page.types";

/**
 * DefaultPage.Root - The root container for the default page layout
 *
 * @supportsStyleProps
 */
export const DefaultPageRoot = ({
  ref,
  children,
  ...props
}: DefaultPageProps) => {
  const recipe = useSlotRecipe({ key: "nimbusDefaultPage" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);

  return (
    <DefaultPageRootSlot ref={ref} {...recipeProps} {...restProps}>
      {children}
    </DefaultPageRootSlot>
  );
};

DefaultPageRoot.displayName = "DefaultPage.Root";
