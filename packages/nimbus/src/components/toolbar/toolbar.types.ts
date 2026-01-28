import type { FC, Ref } from "react";
import type {
  HTMLChakraProps,
  UnstyledProp,
  ConditionalValue,
} from "@chakra-ui/react";
import { type ToolbarProps as RaToolbarProps } from "react-aria-components";
import type {
  ToolbarSize,
  ToolbarOrientation,
  ToolbarVariant,
} from "./toolbar.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToolbarRecipeProps = {
  /** Size variant of the toolbar */
  size?: ConditionalValue<ToolbarSize | undefined>;
  /** Layout orientation of the toolbar */
  orientation?: ConditionalValue<ToolbarOrientation | undefined>;
  /** Visual style variant of the toolbar */
  variant?: ConditionalValue<ToolbarVariant | undefined>;
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
