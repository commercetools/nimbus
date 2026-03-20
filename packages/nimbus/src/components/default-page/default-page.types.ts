import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

export type DefaultPageRecipeProps = UnstyledProp;

type DefaultPageRecipeVariantProps = {
  /** When true, the header stays pinned at the top of the viewport while scrolling */
  stickyHeader?: boolean;
  /** When true, the footer stays pinned at the bottom of the viewport while scrolling */
  stickyFooter?: boolean;
};

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

export type DefaultPageProps = DefaultPageRecipeVariantProps &
  OmitInternalProps<DefaultPageRootSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

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
