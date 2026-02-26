import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type DetailPageRecipeProps = {
  /** Content width variant (wide, narrow, full) */
  contentVariant?: SlotRecipeProps<"nimbusDetailPage">["contentVariant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DetailPageRootSlotProps = HTMLChakraProps<
  "div",
  DetailPageRecipeProps
>;

export type DetailPageHeaderSlotProps = HTMLChakraProps<"header">;

export type DetailPageBackLinkSlotProps = HTMLChakraProps<"a">;

export type DetailPageTitleSlotProps = HTMLChakraProps<"h1">;

export type DetailPageSubtitleSlotProps = HTMLChakraProps<"p">;

export type DetailPageContentSlotProps = HTMLChakraProps<"main">;

export type DetailPageFooterSlotProps = HTMLChakraProps<"footer">;

// ============================================================
// MAIN PROPS
// ============================================================

export type DetailPageProps = OmitInternalProps<DetailPageRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

export type DetailPageHeaderProps =
  OmitInternalProps<DetailPageHeaderSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };

export type DetailPageBackLinkProps =
  OmitInternalProps<DetailPageBackLinkSlotProps> & {
    /** The URL to navigate to when the back link is clicked */
    href: string;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLAnchorElement>;
  };

export type DetailPageTitleProps =
  OmitInternalProps<DetailPageTitleSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLHeadingElement>;
  };

export type DetailPageSubtitleProps =
  OmitInternalProps<DetailPageSubtitleSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLParagraphElement>;
  };

export type DetailPageContentProps =
  OmitInternalProps<DetailPageContentSlotProps> & {
    /** Content width variant */
    variant?: "wide" | "narrow" | "full";
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };

export type DetailPageFooterProps =
  OmitInternalProps<DetailPageFooterSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };
