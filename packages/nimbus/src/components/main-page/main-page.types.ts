import type { HTMLChakraProps, UnstyledProp } from "@chakra-ui/react";
import type { PageContentProps } from "../page-content/page-content.types";

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

export type MainPageActionsSlotProps = HTMLChakraProps<"div">;

export type MainPageContentSlotProps = HTMLChakraProps<"main">;

export type MainPageFooterSlotProps = HTMLChakraProps<"footer">;

// ============================================================
// MAIN PROPS
// ============================================================

export type MainPageProps = MainPageRootSlotProps & {
  /** The page sections (Header, Content, Footer) */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

export type MainPageHeaderProps = MainPageHeaderSlotProps & {
  /** The header content (Title and/or Actions) */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

export type MainPageTitleProps = MainPageTitleSlotProps & {
  /** The page title text or element */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
};

export type MainPageActionsProps = MainPageActionsSlotProps & {
  /** Action buttons or controls */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export type MainPageContentProps = Omit<MainPageContentSlotProps, "asChild"> & {
  /** The main page content */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
  /** Width constraint variant forwarded to PageContent.Root */
  variant?: PageContentProps["variant"];
  /** Column layout pattern forwarded to PageContent.Root */
  columns?: PageContentProps["columns"];
};

export type MainPageFooterProps = MainPageFooterSlotProps & {
  /** Footer content (e.g., FormActionBar or custom buttons) */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};
