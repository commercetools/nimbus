import type { FC, Ref } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import { type ToolbarProps as RaToolbarProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToolbarRecipeProps = {
  /** Size variant of the toolbar */
  size?: RecipeProps<"nimbusToolbar">["size"];
  /** Layout orientation of the toolbar */
  orientation?: RecipeProps<"nimbusToolbar">["orientation"];
  /** Visual style variant of the toolbar */
  variant?: RecipeProps<"nimbusToolbar">["variant"];
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
