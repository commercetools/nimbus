import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type CardRecipeProps = {
  cardPadding?: SlotRecipeProps<"card">["cardPadding"];
  borderStyle?: SlotRecipeProps<"card">["borderStyle"];
  elevation?: SlotRecipeProps<"card">["elevation"];
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

export type CardProps = CardRootSlotProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

export type CardHeaderProps = CardHeaderSlotProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export type CardContentProps = CardContentSlotProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
