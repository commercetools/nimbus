import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { BreadcrumbsRootSlot, BreadcrumbsListSlot } from "../breadcrumbs.slots";
import type { BreadcrumbsRootComponent } from "../breadcrumbs.types";

/**
 * Breadcrumbs.Root - Renders the navigation landmark (`<nav>`) and the ordered
 * list of breadcrumb items, providing styling context to its parts.
 *
 * Collection props (`items`, `onAction`, `isDisabled`, `children`) are
 * forwarded to the React Aria `Breadcrumbs` list; labelling props
 * (`aria-label`, `aria-labelledby`) and style props apply to the `<nav>`.
 *
 * @supportsStyleProps
 */
export const BreadcrumbsRoot: BreadcrumbsRootComponent = (props) => {
  // Collection + labelling props are destructured from the typed props; the
  // rest is split into recipe variants (size) and Chakra style props that
  // apply to the <nav>.
  const {
    children,
    items,
    onAction,
    isDisabled,
    ref,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  } = props;

  const recipe = useSlotRecipe({ key: "nimbusBreadcrumbs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(rest);
  const [styleProps, navProps] = extractStyleProps(restRecipeProps);

  return (
    <BreadcrumbsRootSlot
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      {...recipeProps}
      {...styleProps}
      {...navProps}
    >
      <BreadcrumbsListSlot
        items={items}
        onAction={onAction}
        isDisabled={isDisabled}
      >
        {children}
      </BreadcrumbsListSlot>
    </BreadcrumbsRootSlot>
  );
};

BreadcrumbsRoot.displayName = "Breadcrumbs.Root";
