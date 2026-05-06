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
  /** Controls padding and gap scaling. */
  size?: SlotRecipeProps<"nimbusCard">["size"];
  /** Controls visual treatment (border, shadow, background). */
  variant?: SlotRecipeProps<"nimbusCard">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type CardRootSlotProps = HTMLChakraProps<"div", CardRecipeProps>;

export type CardHeaderSlotProps = HTMLChakraProps<"div">;

export type CardBodySlotProps = HTMLChakraProps<"div">;

export type CardFooterSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the Card.Root component. */
export type CardProps = OmitInternalProps<CardRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

/** Props for the Card.Header component. */
export type CardHeaderProps = OmitInternalProps<CardHeaderSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** Props for the Card.Body component. */
export type CardBodyProps = OmitInternalProps<CardBodySlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** Props for the Card.Footer component. */
export type CardFooterProps = OmitInternalProps<CardFooterSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
