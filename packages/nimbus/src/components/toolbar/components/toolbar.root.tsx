import { forwardRef } from "react";
import { ToolbarRoot as ToolbarRootSlot } from "../toolbar.slots.tsx";
import type { ToolbarRootProps } from "../toolbar.types.ts";
import { Toolbar } from "react-aria-components";
import {
  useBreakpointValue,
  useChakraContext,
  useSlotRecipe,
} from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { toolbarSlotRecipe } from "../toolbar.recipe.ts";

export const ToolbarRoot = ({
  ref: forwardedRef,
  orientation = "horizontal",
  ...props
}: ToolbarRootProps) => {
  const recipe = useSlotRecipe({ recipe: toolbarSlotRecipe });
  const [recipeProps, variantFreeProps] = recipe.splitVariantProps(props);
  const [styleProps, functionalProps] = extractStyleProps(variantFreeProps);

  const sysCtx = useChakraContext();

  // The react-aria Toolbar does not support responsive values for the
  // `orientation` prop. We normalize `orientation` to a string
  // ("horizontal" or "vertical") using `system.normalizeValue` and
  // `useBreakpointValue` to ensure a concrete value is passed.
  const computedOrientation = useBreakpointValue(
    sysCtx.normalizeValue(orientation)
  );

  return (
    <ToolbarRootSlot
      ref={forwardedRef}
      orientation={orientation}
      {...recipeProps}
      {...styleProps}
      asChild
    >
      <Toolbar orientation={computedOrientation} {...functionalProps} />
    </ToolbarRootSlot>
  );
};

// Manually assign a displayName for debugging purposes
ToolbarRoot.displayName = "Toolbar.Root";
