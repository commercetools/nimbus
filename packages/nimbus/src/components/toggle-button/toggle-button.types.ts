import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";
import type { ToggleButtonProps as RaToggleButtonProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonRecipeProps = {
  size?: RecipeProps<"toggleButton">["size"];
  variant?: RecipeProps<"toggleButton">["variant"];
  tone?: RecipeProps<"toggleButton">["tone"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ToggleButtonRootSlotProps = HTMLChakraProps<
  "button",
  ToggleButtonRecipeProps
>;

// ============================================================
// HELPER TYPES
// ============================================================

type ExcludedProps = "css" | "colorScheme" | "recipe" | "as" | "asChild";

// ============================================================
// MAIN PROPS
// ============================================================

export type ToggleButtonProps = Omit<
  ToggleButtonRootSlotProps,
  keyof RaToggleButtonProps | ExcludedProps
> &
  RaToggleButtonProps & {
    ref?: React.Ref<HTMLButtonElement>;
  };
