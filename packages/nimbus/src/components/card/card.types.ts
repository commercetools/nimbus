import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  ConditionalValue,
  UnstyledProp,
} from "@chakra-ui/react";
import type {
  CardPadding,
  CardBorderStyle,
  CardElevation,
  CardBackgroundStyle,
} from "./card.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type CardRecipeProps = {
  /** Internal padding variant for the card content */
  cardPadding?: ConditionalValue<CardPadding | undefined>;
  /** Border style variant (outline, none, etc.) */
  borderStyle?: ConditionalValue<CardBorderStyle | undefined>;
  /** Elevation shadow level for the card */
  elevation?: ConditionalValue<CardElevation | undefined>;
  /** Background style variant (white, gray, etc.) */
  backgroundStyle?: ConditionalValue<CardBackgroundStyle | undefined>;
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type CardRootSlotProps = HTMLChakraProps<"div", CardRecipeProps>;

export type CardHeaderSlotProps = HTMLChakraProps<"div">;

export type CardContentSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type CardProps = OmitInternalProps<CardRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

export type CardHeaderProps = OmitInternalProps<CardHeaderSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export type CardContentProps = OmitInternalProps<CardContentSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
