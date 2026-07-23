import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { RouterOptions } from "../nimbus-provider/nimbus-provider.types";

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
// HELPER TYPES
// ============================================================

/**
 * A single entry for the declarative, data-driven `items` API of
 * `Breadcrumbs.Root`. The last entry in the array is treated as the current
 * page automatically.
 */
export type BreadcrumbItem = {
  /**
   * A unique key for the breadcrumb, passed to `Breadcrumbs.Root`'s `onAction`
   * handler when the breadcrumb is activated.
   */
  id: string | number;
  /**
   * The label content displayed inside the breadcrumb.
   */
  label: React.ReactNode;
  /**
   * The URL this breadcrumb links to. Ignored for the last (current) item.
   */
  href?: string;
  /**
   * The target window for the link.
   */
  target?: React.HTMLAttributeAnchorTarget;
  /**
   * The relationship between the current document and the linked URL.
   */
  rel?: string;
  /**
   * Whether this breadcrumb is disabled (non-interactive, dimmed, skipped in
   * the tab sequence).
   *
   * Note: disabling the *last* item is not recommended. The last item is
   * already treated as the current page (non-interactive), and a disabled item
   * renders as a plain `<span>` that bypasses React Aria's collection context —
   * so a disabled final item will not carry `aria-current="page"`.
   */
  isDisabled?: boolean;
  /**
   * Options forwarded to the client-side router for this link.
   */
  routerOptions?: RouterOptions;
};

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Breadcrumbs.Root component.
 * Renders a `<nav>` landmark containing an ordered list of breadcrumb links.
 * The last item is treated as the current page automatically.
 */
export type BreadcrumbsProps = OmitInternalProps<BreadcrumbsRootSlotProps> & {
  /**
   * The visible separator rendered between breadcrumb items. Accepts any
   * React node (e.g. a string like "/" or an icon). The separator is
   * decorative and hidden from assistive technologies.
   * @default "›"
   */
  separator?: React.ReactNode;
  /**
   * Data-driven list of breadcrumbs. When provided, one `Breadcrumbs.Item` is
   * rendered per entry (in order) and `children` is ignored. The last entry is
   * the current page. Prefer this for trails built from data; use compound
   * `Breadcrumbs.Item` children for static trails.
   */
  items?: BreadcrumbItem[];
  /**
   * Handler called with a breadcrumb's `id` when it is activated (clicked or
   * via keyboard). Useful for client-side routing.
   */
  onAction?: (key: string | number) => void;
  /**
   * The breadcrumb items. Provide `Breadcrumbs.Item` children for a static
   * trail. Ignored when `items` is provided.
   */
  children?: React.ReactNode;
  /**
   * A ref to the root `<nav>` element.
   */
  ref?: React.Ref<HTMLElement>;
  [key: `data-${string}`]: unknown;
};

/**
 * Props for the Breadcrumbs.Item component.
 * Renders an `<li>` containing a navigation link. The last item rendered inside
 * a `Breadcrumbs.Root` automatically represents the current page (non-interactive
 * text with `aria-current="page"`, removed from the tab sequence) — there is no
 * `isCurrent` prop.
 */
export type BreadcrumbsItemProps =
  // Omit `id` from the anchor slot props (typed `string`) so we can widen it to
  // React Aria's collection `Key` (`string | number`).
  Omit<OmitInternalProps<BreadcrumbsLinkSlotProps>, "id"> & {
    /**
     * A unique key for the breadcrumb, passed to `Breadcrumbs.Root`'s `onAction`
     * handler when this item is activated.
     */
    id?: string | number;
    /**
     * The URL this breadcrumb links to. Ignored for the last (current) item,
     * which renders as non-interactive text.
     */
    href?: string;
    /**
     * Whether the item is disabled. Disabled items cannot be interacted with,
     * are visually dimmed, and are removed from the tab sequence.
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
     * Options forwarded to the client-side router for this link.
     */
    routerOptions?: RouterOptions;
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
