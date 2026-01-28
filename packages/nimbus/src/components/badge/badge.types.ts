import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  ConditionalValue,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react";
import type { BadgeSize } from "./badge.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type BadgeRecipeProps = {
  /**
   * Size variant of the badge
   * @default "md"
   */
  size?: ConditionalValue<BadgeSize>;
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
