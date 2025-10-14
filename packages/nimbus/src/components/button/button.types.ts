import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type ButtonRecipeProps = {
  size?: RecipeProps<"button">["size"];
  variant?: RecipeProps<"button">["variant"];
  tone?: RecipeProps<"button">["tone"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ButtonRootSlotProps = Omit<
  HTMLChakraProps<"button", ButtonRecipeProps>,
  "slot"
> & {
  slot?: string | null | undefined;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type ButtonProps = Omit<ButtonRootSlotProps, keyof RaButtonProps> &
  RaButtonProps & {
    [key: `data-${string}`]: unknown;
    slot?: string | null | undefined;
    ref?: React.Ref<HTMLButtonElement>;
  };
