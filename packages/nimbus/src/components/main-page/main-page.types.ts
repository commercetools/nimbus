import type { HTMLChakraProps, UnstyledProp } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type MainPageRecipeProps = UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type MainPageRootSlotProps = HTMLChakraProps<"div", MainPageRecipeProps>;

export type MainPageHeaderSlotProps = HTMLChakraProps<"header">;

export type MainPageTitleSlotProps = HTMLChakraProps<"h1">;

export type MainPageSubtitleSlotProps = HTMLChakraProps<"p">;

export type MainPageActionsSlotProps = HTMLChakraProps<"div">;

export type MainPageContentSlotProps = HTMLChakraProps<"main">;

export type MainPageFooterSlotProps = HTMLChakraProps<"footer">;

// ============================================================
// MAIN PROPS
// ============================================================

export type MainPageRootProps = MainPageRootSlotProps & {
  /** The page sections (Header, Content, Footer) */
  children?: React.ReactNode;
  /** Ref to the root div element */
  ref?: React.Ref<HTMLDivElement>;
};

/** Convenience alias for MainPageRootProps */
export type MainPageProps = MainPageRootProps;

export type MainPageHeaderProps = MainPageHeaderSlotProps & {
  /** The header content (Title and/or Actions) */
  children?: React.ReactNode;
  /** Ref to the header element */
  ref?: React.Ref<HTMLElement>;
};

export type MainPageTitleProps = MainPageTitleSlotProps & {
  /** The page title content */
  children?: React.ReactNode;
  /** Ref to the heading element */
  ref?: React.Ref<HTMLHeadingElement>;
};

export type MainPageSubtitleProps = MainPageSubtitleSlotProps & {
  /** The subtitle content */
  children?: React.ReactNode;
  /** Ref to the paragraph element */
  ref?: React.Ref<HTMLParagraphElement>;
};

export type MainPageActionsProps = MainPageActionsSlotProps & {
  /** Action buttons or controls */
  children?: React.ReactNode;
  /** Ref to the actions container element */
  ref?: React.Ref<HTMLDivElement>;
};

export type MainPageContentProps = MainPageContentSlotProps & {
  /** The main page content */
  children?: React.ReactNode;
  /** Ref to the main content element */
  ref?: React.Ref<HTMLElement>;
};

export type MainPageFooterProps = MainPageFooterSlotProps & {
  /** Footer content (e.g., FormActionBar or custom buttons) */
  children?: React.ReactNode;
  /** Ref to the footer element */
  ref?: React.Ref<HTMLElement>;
};
