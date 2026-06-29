import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type BreadcrumbsRecipeProps = {
  /**
   * Size of the breadcrumb items.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusBreadcrumbs">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type BreadcrumbsRootSlotProps = HTMLChakraProps<
  "nav",
  BreadcrumbsRecipeProps
>;

export type BreadcrumbsListSlotProps = HTMLChakraProps<
  "ol",
  BreadcrumbsRecipeProps
>;

export type BreadcrumbsItemSlotProps = HTMLChakraProps<
  "li",
  BreadcrumbsRecipeProps
>;

export type BreadcrumbsLinkSlotProps = HTMLChakraProps<
  "a",
  BreadcrumbsRecipeProps
>;

export type BreadcrumbsSeparatorSlotProps = HTMLChakraProps<
  "span",
  BreadcrumbsRecipeProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Breadcrumbs.Root component.
 * Renders a `<nav>` landmark containing an ordered list of breadcrumb links.
 */
export type BreadcrumbsProps = OmitInternalProps<BreadcrumbsRootSlotProps> & {
  /**
   * The visible separator rendered between breadcrumb items. Accepts any
   * React node (e.g. a string like "/" or an icon). The separator is
   * decorative and hidden from assistive technologies.
   * @default "/"
   */
  separator?: React.ReactNode;
  /**
   * A ref to the root `<nav>` element.
   */
  ref?: React.Ref<HTMLElement>;
  [key: `data-${string}`]: unknown;
};

/**
 * Props for the Breadcrumbs.Item component.
 * Renders an `<li>` containing a navigation link. The last item in a
 * `Breadcrumbs.Root` should set `isCurrent` to represent the current page.
 */
export type BreadcrumbsItemProps =
  OmitInternalProps<BreadcrumbsLinkSlotProps> & {
    /**
     * The URL this breadcrumb links to. Omit (or pair with `isCurrent`) for the
     * current page, which renders as non-interactive text.
     */
    href?: string;
    /**
     * Whether this item represents the current page. When true, the item renders
     * as non-interactive text with `aria-current="page"` and no `href` is
     * applied. Set this on the last breadcrumb.
     * @default false
     */
    isCurrent?: boolean;
    /**
     * Whether the item is disabled. Disabled items cannot be interacted with and
     * are visually dimmed.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * The target window for the link.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
     */
    target?: React.HTMLAttributeAnchorTarget;
    /**
     * The relationship between the current document and the linked URL.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel
     */
    rel?: string;
    /**
     * The label content displayed inside the breadcrumb.
     */
    children?: React.ReactNode;
    /**
     * A ref to the underlying `<a>` element.
     */
    ref?: React.Ref<HTMLAnchorElement>;
    [key: `data-${string}`]: unknown;
  };
