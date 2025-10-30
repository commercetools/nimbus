import type { OmitUnwantedProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type CardRecipeProps = {
  /** Internal padding variant for the card content */
  cardPadding?: SlotRecipeProps<"card">["cardPadding"];
  /** Border style variant (outline, none, etc.) */
  borderStyle?: SlotRecipeProps<"card">["borderStyle"];
  /** Elevation shadow level for the card */
  elevation?: SlotRecipeProps<"card">["elevation"];
  /** Background style variant (white, gray, etc.) */
  backgroundStyle?: SlotRecipeProps<"card">["backgroundStyle"];
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

export type CardProps = OmitUnwantedProps<CardRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

export type CardHeaderProps = OmitUnwantedProps<CardHeaderSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export type CardContentProps = OmitUnwantedProps<CardContentSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
