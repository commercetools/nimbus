import {
  useChakraContext,
  useSlotRecipe,
} from "@chakra-ui/react/styled-system";
import { Tabs as RATabs } from "react-aria-components";
import { TabsRootSlot } from "../tabs.slots";
import type { TabsProps } from "../tabs.types";
import { TabsList } from "./tabs.list";
import { TabsPanels } from "./tabs.panels";
import { extractStyleProps } from "@/utils";
import { useBreakpointValue } from "@chakra-ui/react";

/**
 * # Tabs
 *
 * A tabs component built on React Aria Components that allows users to switch between different views.
 *
 * @supportsStyleProps
 */
export const TabsRoot = ({ children, tabs, ...props }: TabsProps) => {
  const sysCtx = useChakraContext();
  // Standard pattern: Split recipe variants
  const recipe = useSlotRecipe({ key: "tabs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // The react-aria Tabs do not support responsive values for the
  // `orientation` prop. We normalize `orientation` to a string
  // ("horizontal" or "vertical") using `system.normalizeValue` and
  // `useBreakpointValue` to ensure a concrete value is passed.
  const normalizedOrientation = sysCtx.normalizeValue(recipeProps.orientation);

  return (
    <TabsRootSlot asChild {...recipeProps} {...styleProps}>
      <RATabs {...functionalProps} orientation={normalizedOrientation}>
        {children || (
          <>
            <TabsList tabs={tabs} />
            <TabsPanels tabs={tabs} />
          </>
        )}
      </RATabs>
    </TabsRootSlot>
  );
};

TabsRoot.displayName = "Tabs.Root";
