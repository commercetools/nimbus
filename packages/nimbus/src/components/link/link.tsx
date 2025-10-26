import { Link as RaLink } from "react-aria-components";
import { LinkRoot } from "./link.slots";
import type { LinkProps } from "./link.types";
import { extractStyleProps } from "@/utils";
import { useRecipe } from "@chakra-ui/react";
import { linkRecipe } from "./link.recipe";

/**
 * # Link
 *
 * To allow a user to navigate to a different page or resource
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/link}
 */
export const Link = (props: LinkProps) => {
  const recipe = useRecipe({ recipe: linkRecipe });
  // Extract recipe props
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  // Extract style props for Chakra UI styling
  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  return (
    <LinkRoot asChild {...recipeProps} {...styleProps}>
      <RaLink {...functionalProps} />
    </LinkRoot>
  );
};

Link.displayName = "Link";
