import { ToolbarRoot } from "./toolbar.slots.tsx";
import type { ToolbarComponent, ToolbarProps } from "./toolbar.types.ts";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { useBreakpointValue } from "@chakra-ui/react/hooks";
import { useChakraContext } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { toolbarRecipe } from "./toolbar.recipe.ts";
import { Toolbar as RaToolbar } from "react-aria-components";

export const Toolbar: ToolbarComponent = ({
  ref: forwardedRef,
  orientation = "horizontal",
  ...props
}: ToolbarProps) => {
  const recipe = useRecipe({ recipe: toolbarRecipe });
  const [recipeProps, variantFreeProps] = recipe.splitVariantProps({
    orientation,
    ...props,
  });
  const [styleProps, functionalProps] = extractStyleProps(variantFreeProps);

  const sysCtx = useChakraContext();

  // The react-aria Toolbar does not support responsive values for the
  // `orientation` prop. We normalize `orientation` to a string
  // ("horizontal" or "vertical") using `system.normalizeValue` and
  // `useBreakpointValue` to ensure a concrete value is passed.

  const normalizedOrientation = sysCtx.normalizeValue(orientation);
  const computedOrientation: "horizontal" | "vertical" =
    useBreakpointValue(normalizedOrientation) ?? "horizontal";

  return (
    <ToolbarRoot
      orientation={orientation}
      {...recipeProps}
      {...styleProps}
      asChild
    >
      <RaToolbar
        ref={forwardedRef}
        orientation={computedOrientation}
        {...functionalProps}
      />
    </ToolbarRoot>
  );
};
