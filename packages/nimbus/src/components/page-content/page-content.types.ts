import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type PageContentRecipeProps = {
  /** Width constraint variant for the content container */
  variant?: SlotRecipeProps<"nimbusPageContent">["variant"];
  /** Column layout pattern */
  columns?: SlotRecipeProps<"nimbusPageContent">["columns"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type PageContentRootSlotProps = HTMLChakraProps<
  "div",
  PageContentRecipeProps
>;

export type PageContentColumnSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type PageContentProps = Omit<PageContentRootSlotProps, "asChild"> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

export type PageContentColumnProps = PageContentColumnSlotProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Enable sticky positioning for this column.
   * Applies `position: sticky` with `top: 0`. Use the `top` style prop to
   * customize the offset (e.g., `top="400"`).
   */
  sticky?: boolean;
};
