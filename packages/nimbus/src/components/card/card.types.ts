import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type CardRecipeProps = {
  /** Internal padding variant for the card content */
  cardPadding?: SlotRecipeProps<"nimbusCard">["cardPadding"];
  /** Border style variant (outline, none, etc.) */
  borderStyle?: SlotRecipeProps<"nimbusCard">["borderStyle"];
  /** Elevation shadow level for the card */
  elevation?: SlotRecipeProps<"nimbusCard">["elevation"];
  /** Background style variant (white, gray, etc.) */
  backgroundStyle?: SlotRecipeProps<"nimbusCard">["backgroundStyle"];
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
