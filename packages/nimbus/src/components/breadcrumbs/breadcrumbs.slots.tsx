import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  BreadcrumbsRootSlotProps,
  BreadcrumbsListSlotProps,
  BreadcrumbsItemSlotProps,
  BreadcrumbsLinkSlotProps,
  BreadcrumbsSeparatorSlotProps,
} from "./breadcrumbs.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusBreadcrumbs",
});

/**
 * Root slot component providing the styling context for the Breadcrumbs
 * component. Renders a `<nav>` landmark element.
 */
export const BreadcrumbsRootSlot: SlotComponent<
  HTMLElement,
  BreadcrumbsRootSlotProps
> = withProvider<HTMLElement, BreadcrumbsRootSlotProps>("nav", "root");

/**
 * List slot component for the ordered list of breadcrumbs.
 * Renders as an `<ol>` element.
 */
export const BreadcrumbsListSlot: SlotComponent<
  HTMLOListElement,
  BreadcrumbsListSlotProps
> = withContext<HTMLOListElement, BreadcrumbsListSlotProps>("ol", "list");

/**
 * Item slot component for an individual breadcrumb.
 * Renders as an `<li>` element.
 */
export const BreadcrumbsItemSlot: SlotComponent<
  HTMLLIElement,
  BreadcrumbsItemSlotProps
> = withContext<HTMLLIElement, BreadcrumbsItemSlotProps>("li", "item");

/**
 * Link slot component for an individual breadcrumb link.
 * Renders as an `<a>` element.
 */
export const BreadcrumbsLinkSlot: SlotComponent<
  HTMLAnchorElement,
  BreadcrumbsLinkSlotProps
> = withContext<HTMLAnchorElement, BreadcrumbsLinkSlotProps>("a", "link");

/**
 * Separator slot component rendered between breadcrumb items.
 * Renders as a decorative `<span>` element.
 */
export const BreadcrumbsSeparatorSlot: SlotComponent<
  HTMLSpanElement,
  BreadcrumbsSeparatorSlotProps
> = withContext<HTMLSpanElement, BreadcrumbsSeparatorSlotProps>(
  "span",
  "separator"
);
