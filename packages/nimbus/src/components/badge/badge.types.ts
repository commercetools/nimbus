import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type BadgeRecipeProps = {
  /**
   * Size variant of the badge
   * @default "md"
   */
  size?: RecipeProps<"nimbusBadge">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type BadgeRootSlotProps = HTMLChakraProps<"span", BadgeRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

export type BadgeProps = OmitInternalProps<BadgeRootSlotProps> & {
  /**
   * Content to display inside the badge
   */
  children?: React.ReactNode;
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLSpanElement>;
  /**
   * Data attributes for testing or custom metadata
   */
  [key: `data-${string}`]: string;
};
