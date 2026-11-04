import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

export type DefaultPageRecipeProps = UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DefaultPageRootSlotProps = HTMLChakraProps<
  "div",
  DefaultPageRecipeProps
>;

export type DefaultPageHeaderSlotProps = HTMLChakraProps<"header">;

export type DefaultPageActionsSlotProps = HTMLChakraProps<"div">;

export type DefaultPageBackLinkSlotProps = HTMLChakraProps<"a">;

export type DefaultPageBackLinkLabelSlotProps = HTMLChakraProps<"span">;

export type DefaultPageTitleSlotProps = HTMLChakraProps<"h1">;

export type DefaultPageSubtitleSlotProps = HTMLChakraProps<"p">;

export type DefaultPageTabNavSlotProps = HTMLChakraProps<"div">;

export type DefaultPageContentSlotProps = HTMLChakraProps<"main">;

export type DefaultPageFooterSlotProps = HTMLChakraProps<"footer">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Shared base props for DefaultPage.Root, common to both layout modes.
 */
type DefaultPageBaseProps = OmitInternalProps<DefaultPageRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Show a shorter header while the content is scrolled away from the top.
   *
   * The collapsed header hides the subtitle visually, shows the back link as
   * an icon with a tooltip, and shows the title smaller. A title with several
   * lines keeps all of them. Actions, tab navigation and other header content
   * stay visible.
   *
   * - In browsers that support scroll-driven animations, the header follows
   *   the scroll position: it changes step by step over the height it gives
   *   back, and is full again at the top.
   * - In other browsers, and when the user prefers reduced motion, the header
   *   changes in one step after scrolling has paused, and not while the mouse
   *   pointer is over the header. It returns to its full form only when the
   *   content is back at the top.
   * - `DefaultPage.Header` accepts a function as children that receives
   *   `{ isCollapsed }`.
   * - Root sets the CSS variable `--default-page-header-height`: the height of
   *   the collapsed header when the header follows the scroll position, and
   *   the current header height in the one-step change.
   *
   * Has an effect only when the header is pinned: with `layout="constrained"`,
   * or with `layout="flexible"` and `stickyHeader`. Otherwise development
   * builds log a warning.
   *
   * @default false
   */
  collapseHeaderOnScroll?: boolean;
};

/**
 * Props for DefaultPage.Root when using constrained layout (default).
 *
 * The page fills its parent height. The content area scrolls independently
 * while the header and footer are always pinned by the CSS grid.
 */
type DefaultPageConstrainedProps = DefaultPageBaseProps & {
  /**
   * Controls the scroll behaviour of the page.
   *
   * - `"constrained"` — The page fills its parent container (`height: 100%`).
   *   Only the content area scrolls. Header and footer are pinned by the grid.
   * - `"flexible"` — The page grows with its content (`height: auto`). The
   *   whole page scrolls. Use `stickyHeader`/`stickyFooter` to pin elements.
   *
   * @default "constrained"
   */
  layout?: "constrained";
};

/**
 * Props for DefaultPage.Root when using flexible layout.
 *
 * The page grows with its content and the whole page scrolls. Use
 * `stickyHeader` and/or `stickyFooter` to pin the header or footer.
 */
type DefaultPageFlexibleProps = DefaultPageBaseProps & {
  /**
   * Controls the scroll behaviour of the page.
   *
   * - `"constrained"` — The page fills its parent container (`height: 100%`).
   *   Only the content area scrolls. Header and footer are pinned by the grid.
   * - `"flexible"` — The page grows with its content (`height: auto`). The
   *   whole page scrolls. Use `stickyHeader`/`stickyFooter` to pin elements.
   */
  layout: "flexible";
  /**
   * Pin the header at the top of the scroll container while the page scrolls.
   * Only available with `layout="flexible"`.
   */
  stickyHeader?: boolean;
  /**
   * Pin the footer at the bottom of the scroll container while the page scrolls.
   * Only available with `layout="flexible"`.
   */
  stickyFooter?: boolean;
};

/**
 * Discriminated union on the `layout` prop.
 *
 * - `"constrained"` (default) — pinned header/footer, scrollable content.
 * - `"flexible"` — whole-page scroll; unlocks `stickyHeader` / `stickyFooter`.
 */
export type DefaultPageProps =
  DefaultPageConstrainedProps | DefaultPageFlexibleProps;

/**
 * State that `DefaultPage.Header` passes to a function as its children.
 */
export type DefaultPageHeaderRenderProps = {
  /**
   * `true` once the header has started to collapse
   * (`collapseHeaderOnScroll` on `DefaultPage.Root`), and until it is back in
   * its full form. Always `false` when the header cannot collapse.
   */
  isCollapsed: boolean;
};

export type DefaultPageHeaderProps = Omit<
  OmitInternalProps<DefaultPageHeaderSlotProps>,
  "children"
> & {
  /**
   * The header parts. Pass a function to adapt page-owned header content to
   * the header state, for example to hide a note while the header is
   * collapsed. Content that changes its size when the state changes makes
   * the header measure itself again.
   */
  children?:
    | React.ReactNode
    | ((renderProps: DefaultPageHeaderRenderProps) => React.ReactNode);
  ref?: React.Ref<HTMLElement>;
};

export type DefaultPageActionsProps =
  OmitInternalProps<DefaultPageActionsSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

export type DefaultPageBackLinkProps =
  OmitInternalProps<DefaultPageBackLinkSlotProps> & {
    /** The URL to navigate to when the back link is clicked */
    href: string;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLAnchorElement>;
  };

export type DefaultPageTitleProps =
  OmitInternalProps<DefaultPageTitleSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLHeadingElement>;
  };

export type DefaultPageSubtitleProps =
  OmitInternalProps<DefaultPageSubtitleSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLParagraphElement>;
  };

export type DefaultPageTabNavProps =
  OmitInternalProps<DefaultPageTabNavSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

export type DefaultPageContentProps =
  OmitInternalProps<DefaultPageContentSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };

export type DefaultPageFooterProps =
  OmitInternalProps<DefaultPageFooterSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };
