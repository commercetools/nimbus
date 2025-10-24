import type { OmitUnwantedProps } from "../../type-utils/omit-props";
import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type BadgeRecipeProps = {
  /**
   * Size variant of the badge
   * @default "md"
   */
  size?: RecipeProps<"badge">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type BadgeRootSlotProps = OmitUnwantedProps<
  HTMLChakraProps<"span", BadgeRecipeProps>
>;

// ============================================================
// MAIN PROPS
// ============================================================

export type BadgeProps = BadgeRootSlotProps & {
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
