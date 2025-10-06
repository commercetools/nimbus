import { Tabs as RATabs } from "react-aria-components";
import { TabsRootSlot } from "../tabs.slots";
import type { TabsProps } from "../tabs.types";
import { TabList } from "./tabs.list";
import { TabPanels } from "./tabs.panels";

/**
 * # Tabs
 *
 * A tabs component built on React Aria Components that allows users to switch between different views.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/tabs}
 */
export const TabsRoot = ({
  children,
  orientation = "horizontal",
  disabledKeys,
  placement = "start",
  size = "md",
  tabs,
  ...props
}: TabsProps) => {
  return (
    <TabsRootSlot
      asChild
      orientation={orientation}
      placement={placement}
      size={size}
      {...props}
    >
      <RATabs disabledKeys={disabledKeys} {...tabs}>
        {children || (
          <>
            <TabList tabs={tabs} />
            <TabPanels tabs={tabs} />
          </>
        )}
      </RATabs>
    </TabsRootSlot>
  );
};

TabsRoot.displayName = "Tabs.Root";
