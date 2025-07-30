import type { ReactNode, Ref } from "react";
import type {
  ToolbarProps as RaToolbarProps,
  GroupProps as RaGroupProps,
  SeparatorProps as RaSeparatorProps,
} from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type {
  ToolbarRootSlotProps,
  ToolbarGroupSlotProps,
  ToolbarSeparatorSlotProps,
} from "./toolbar.slots";
import { toolbarSlotRecipe } from "./toolbar.recipe";

type DefaultExcludedProps = "css" | "asChild" | "as";

// Root toolbar component
export interface ToolbarRootProps
  extends Omit<
      ToolbarRootSlotProps,
      DefaultExcludedProps | "orientation" | "children" | "slot"
    >,
    // Some RA props are incompatible / not supported
    // orientaiton: can change based on breakpoint
    // className & style: RA accepts a fn (a pattern we don't want to support, yet)
    Omit<RaToolbarProps, "orientation" | "className" | "style"> {
  /**
   * The orientation of the toolbar.
   * Supports responsive values for different breakpoints.
   * @default "horizontal"
   */
  orientation?: RecipeVariantProps<typeof toolbarSlotRecipe>["orientation"];

  ref?: Ref<HTMLDivElement>;
}

// Toolbar group component
export interface ToolbarGroupProps
  extends Omit<ToolbarGroupSlotProps, DefaultExcludedProps>,
    // Manually picking all the supported props
    Pick<
      RaGroupProps,
      | "isDisabled"
      | "isInvalid"
      | "onHoverChange"
      | "onHoverStart"
      | "onHoverEnd"
    > {
  ref?: Ref<HTMLDivElement>;
}

// Toolbar separator component
export interface ToolbarSeparatorProps extends ToolbarSeparatorSlotProps {
  ref?: Ref<HTMLDivElement>;
}
