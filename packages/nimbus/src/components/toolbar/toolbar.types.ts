import type { FC, Ref } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import { type ToolbarProps as RaToolbarProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToolbarRecipeProps = {
  size?: RecipeProps<"toolbar">["size"];
  orientation?: RecipeProps<"toolbar">["orientation"];
  variant?: RecipeProps<"toolbar">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ToolbarRootSlotProps = Omit<
  HTMLChakraProps<"div", ToolbarRecipeProps>,
  "translate"
> & {
  translate?: "yes" | "no";
};

// ============================================================
// HELPER TYPES
// ============================================================

type DefaultExcludedProps = "css" | "asChild" | "as";

// ============================================================
// MAIN PROPS
// ============================================================
export type ToolbarProps = Omit<
  ToolbarRootSlotProps,
  DefaultExcludedProps | "children" | "slot"
> &
  Omit<RaToolbarProps, "orientation" | "className" | "style"> & {
    ref?: Ref<HTMLDivElement>;
  };

export type ToolbarComponent = FC<ToolbarProps>;
