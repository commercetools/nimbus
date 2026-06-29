import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import {
  Breadcrumbs as RaBreadcrumbs,
  Breadcrumb as RaBreadcrumb,
  Link as RaLink,
} from "react-aria-components";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  BreadcrumbsListProps,
  BreadcrumbsItemProps,
} from "./breadcrumbs.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusBreadcrumbs",
});

/**
 * Root slot — provides the recipe context and renders the navigation landmark
 * (`<nav>`) that wraps the breadcrumb list.
 */
export type BreadcrumbsRootSlotProps = HTMLChakraProps<"nav">;
export const BreadcrumbsRootSlot: SlotComponent<
  HTMLElement,
  BreadcrumbsRootSlotProps
> = withProvider<HTMLElement, BreadcrumbsRootSlotProps>("nav", "root");

/**
 * List slot — consumes context and renders the React Aria `Breadcrumbs`
 * collection (an `<ol>`).
 */
export const BreadcrumbsListSlot: SlotComponent<
  HTMLOListElement,
  BreadcrumbsListProps
> = withContext<HTMLOListElement, BreadcrumbsListProps>(RaBreadcrumbs, "list");

/**
 * Item slot — consumes context and renders the React Aria `Breadcrumb`
 * (an `<li>`).
 */
export const BreadcrumbsItemSlot: SlotComponent<
  HTMLLIElement,
  BreadcrumbsItemProps
> = withContext<HTMLLIElement, BreadcrumbsItemProps>(RaBreadcrumb, "item");

/**
 * Link slot — consumes context and renders the React Aria `Link` (an `<a>`,
 * or a `<span>` for the current page when no `href` is provided).
 */
export const BreadcrumbsLinkSlot: SlotComponent<
  HTMLAnchorElement,
  React.ComponentProps<typeof RaLink>
> = withContext<HTMLAnchorElement, React.ComponentProps<typeof RaLink>>(
  RaLink,
  "link"
);

/**
 * Separator slot — consumes context and renders the visual divider between
 * items. Decorative only (`aria-hidden`); hierarchy is conveyed by the list.
 */
export const BreadcrumbsSeparatorSlot: SlotComponent<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
> = withContext<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  "span",
  "separator"
);
