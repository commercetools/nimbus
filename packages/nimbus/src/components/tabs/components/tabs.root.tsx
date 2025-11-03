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
export const TabsRoot = ({ children, tabs, ...props }: TabsProps) => {
  // Standard pattern: Split recipe variants
  const recipe = useSlotRecipe({ key: "tabs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // Extract orientation from recipe props for React Aria (handles both styling and behavior)
  const { orientation, ...slotProps } = recipeProps;

  return (
    <TabsRootSlot asChild {...slotProps} {...styleProps}>
      <RATabs
        {...functionalProps}
        orientation={orientation as "horizontal" | "vertical" | undefined}
      >
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
