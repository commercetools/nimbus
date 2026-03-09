import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

export type DetailPageRecipeProps = UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DetailPageRootSlotProps = HTMLChakraProps<
  "div",
  DetailPageRecipeProps
>;

export type DetailPageHeaderSlotProps = HTMLChakraProps<"header">;

export type DetailPageHeaderActionsSlotProps = HTMLChakraProps<"div">;

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
};

export type DetailPageHeaderProps =
  OmitInternalProps<DetailPageHeaderSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };

export type DetailPageHeaderActionsProps =
  OmitInternalProps<DetailPageHeaderActionsSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
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
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };

export type DetailPageFooterProps =
  OmitInternalProps<DetailPageFooterSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
  };
