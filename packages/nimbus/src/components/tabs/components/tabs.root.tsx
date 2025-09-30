import { Tabs as RATabs } from "react-aria-components";
import { TabsRootSlot } from "../tabs.slots";
import { TabsProvider } from "./tabs.context";
import type { TabsProps, TabItemProps } from "../tabs.types";

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
    <TabsProvider tabs={tabs as TabItemProps[]}>
      <TabsRootSlot
        asChild
        orientation={orientation}
        placement={placement}
        size={size}
        {...props}
      >
        <RATabs disabledKeys={disabledKeys} {...tabs}>
          {children}
        </RATabs>
      </TabsRootSlot>
    </TabsProvider>
  );
};

TabsRoot.displayName = "Tabs.Root";
