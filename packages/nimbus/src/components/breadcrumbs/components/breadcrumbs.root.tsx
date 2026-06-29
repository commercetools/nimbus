import { useMemo } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { BreadcrumbsRootSlot, BreadcrumbsListSlot } from "../breadcrumbs.slots";
import type { BreadcrumbsProps } from "../breadcrumbs.types";
import { BreadcrumbsContext } from "./breadcrumbs.context";

/**
 * # Breadcrumbs.Root
 *
 * The root container for the Breadcrumbs component. Renders a `<nav>` landmark
 * wrapping an ordered list (`<ol>`) of `Breadcrumbs.Item` links, and provides
 * the styling context and separator configuration for all child items.
 *
 * Always provide an `aria-label` (e.g. `"Breadcrumb"`) to identify the
 * navigation landmark.
 *
 * @supportsStyleProps
 */
export const BreadcrumbsRoot = (props: BreadcrumbsProps) => {
  const { children, separator = "/", ...elementProps } = props;

  // Standard pattern: split recipe variants first.
  const recipe = useSlotRecipe({ key: "nimbusBreadcrumbs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(elementProps);

  // Standard pattern: extract style props from the remaining props.
  const [styleProps, rest] = extractStyleProps(restRecipeProps);

  const contextValue = useMemo(() => ({ separator }), [separator]);

  return (
    <BreadcrumbsContext.Provider value={contextValue}>
      <BreadcrumbsRootSlot {...recipeProps} {...styleProps} {...rest}>
        <BreadcrumbsListSlot>{children}</BreadcrumbsListSlot>
      </BreadcrumbsRootSlot>
    </BreadcrumbsContext.Provider>
  );
};

BreadcrumbsRoot.displayName = "Breadcrumbs.Root";
