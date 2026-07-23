import { Breadcrumbs as RaBreadcrumbs } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { BreadcrumbsRootSlot, BreadcrumbsListSlot } from "../breadcrumbs.slots";
import type { BreadcrumbsProps } from "../breadcrumbs.types";
import { BreadcrumbsSeparatorContext } from "./breadcrumbs.context";
import { BreadcrumbsItem } from "./breadcrumbs.item";

/**
 * # Breadcrumbs.Root
 *
 * The root container for the Breadcrumbs component. Renders a `<nav>` landmark
 * wrapping an ordered list (`<ol>`) of breadcrumb items, built on React Aria
 * Components' `Breadcrumbs`. The last item is treated as the current page
 * automatically.
 *
 * Accepts either compound `Breadcrumbs.Item` children or a declarative `items`
 * array. Always provide an `aria-label` (e.g. `"Breadcrumb"`) to identify the
 * navigation landmark.
 *
 * @supportsStyleProps
 */
export const BreadcrumbsRoot = (props: BreadcrumbsProps) => {
  const { children, items, separator = "›", onAction, ...elementProps } = props;

  if (process.env.NODE_ENV !== "production") {
    const labelProps = elementProps as Record<string, unknown>;
    if (!labelProps["aria-label"] && !labelProps["aria-labelledby"]) {
      console.warn(
        'Breadcrumbs.Root: provide an `aria-label` (e.g. "Breadcrumb") to name the navigation landmark.'
      );
    }
  }

  // Standard pattern: split recipe variants first, then style props.
  const recipe = useSlotRecipe({ key: "nimbusBreadcrumbs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(elementProps);
  const [styleProps, rest] = extractStyleProps(restRecipeProps);

  return (
    <BreadcrumbsSeparatorContext.Provider value={separator}>
      <BreadcrumbsRootSlot {...recipeProps} {...styleProps} {...rest}>
        {/* role="list" keeps list semantics under `list-style: none`, which
            WebKit otherwise strips (Safari + VoiceOver). React Aria does not
            forward `role` (neither via the slot nor as a prop), so set it
            directly on the rendered <ol> node. */}
        <BreadcrumbsListSlot asChild>
          <RaBreadcrumbs
            ref={(node: HTMLOListElement | null) =>
              node?.setAttribute("role", "list")
            }
            items={items}
            onAction={onAction}
          >
            {items
              ? (item) => (
                  <BreadcrumbsItem
                    key={item.id}
                    id={item.id}
                    href={item.href}
                    target={item.target}
                    rel={item.rel}
                    isDisabled={item.isDisabled}
                    routerOptions={item.routerOptions}
                  >
                    {item.label}
                  </BreadcrumbsItem>
                )
              : children}
          </RaBreadcrumbs>
        </BreadcrumbsListSlot>
      </BreadcrumbsRootSlot>
    </BreadcrumbsSeparatorContext.Provider>
  );
};

BreadcrumbsRoot.displayName = "Breadcrumbs.Root";
