import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type SeparatorRecipeProps = {
  /** Orientation of the separator */
  orientation?: RecipeProps<"nimbusSeparator">["orientation"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type SeparatorRootSlotProps = HTMLChakraProps<
  "div",
  SeparatorRecipeProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

export type SeparatorProps = OmitInternalProps<SeparatorRootSlotProps> & {
  /**
   * Data attributes for testing or custom metadata
   */
  [key: `data-${string}`]: unknown;
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
};
