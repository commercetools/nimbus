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
  | DefaultPageConstrainedProps
  | DefaultPageFlexibleProps;

export type DefaultPageHeaderProps =
  OmitInternalProps<DefaultPageHeaderSlotProps> & {
    children?: React.ReactNode;
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
