import type { CardRootProps } from "./card.slots";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type CardRecipeVariantProps = {
  /** CardPadding variant */
  cardPadding?: "sm" | "md" | "lg";
  /** BorderStyle variant */
  borderStyle?: "none" | "outlined";
  /** Elevation variant */
  elevation?: "none" | "elevated";
  /** BackgroundStyle variant */
  backgroundStyle?: "default" | "muted";
} & {
  [key: `data-${string}`]: unknown;
};

/**
 * Main props interface for the Card component.
 * Extends CardRecipeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type CardProps = CardRecipeVariantProps &
  CardRootProps & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };
