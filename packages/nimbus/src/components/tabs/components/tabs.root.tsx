import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { Tabs as RATabs } from "react-aria-components";
import { TabsRootSlot } from "../tabs.slots";
import type { TabsProps } from "../tabs.types";
import { TabsList } from "./tabs.list";
import { TabsPanels } from "./tabs.panels";
import { extractStyleProps } from "@/utils";

/**
 * # Tabs
 *
 * A tabs component built on React Aria Components that allows users to switch between different views.
 *
 * @supportsStyleProps
 */
export const TabsRoot = (props: TabsProps) => {
  // Standard pattern: Split recipe variants
  const recipe = useSlotRecipe({ key: "tabs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // Separate component-specific props from React Aria props
  const { children, tabs, ...raTabsProps } = functionalProps;

  return (
    <TabsRootSlot asChild {...recipeProps} {...styleProps}>
      <RATabs {...raTabsProps}>
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
