import type { FC, Ref } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { type ToolbarProps as RaToolbarProps } from "react-aria-components";
import type { ToolbarSlotProps } from "./toolbar.slots";
import { toolbarRecipe } from "./toolbar.recipe";

type DefaultExcludedProps = "css" | "asChild" | "as";

// Root toolbar component
export type ToolbarProps = Omit<
  ToolbarSlotProps,
  DefaultExcludedProps | "orientation" | "children" | "slot"
> &
  // Some RA props are incompatible / not supported
  // orientation: can change based on breakpoint
  // className & style: RA accepts a fn (a pattern we don't want to support, yet)
  Omit<RaToolbarProps, "orientation" | "className" | "style"> & {
    /**
     * The orientation of the toolbar.
     * Supports responsive values for different breakpoints.
     * @default "horizontal"
     */
    orientation?: RecipeVariantProps<typeof toolbarRecipe>["orientation"];
    /**
     * The size of the toolbar.
     * @default "md"
     */
    size?: RecipeVariantProps<typeof toolbarRecipe>["size"];

    /**
     * The visual variant of the toolbar.
     * @default "plain"
     */
    variant?: RecipeVariantProps<typeof toolbarRecipe>["variant"];

    ref?: Ref<HTMLDivElement>;
  };

export type ToolbarComponent = FC<ToolbarProps>;
