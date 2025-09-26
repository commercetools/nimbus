import { forwardRef } from "react";
import { Collection as RaCollection } from "react-aria-components";
import { TabPanels as TabPanelsSlot } from "../tabs.slots";
import { TabPanel } from "./tabs.panel";
import { useTabsContextOptional } from "./tabs.context";
import type { TabItemProps, TabPanelsProps } from "../tabs.types";

/**
 * # TabPanels
 *
 * A container for the tab panels that displays content based on the selected tab.
 */
export const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ tabs: tabsProp, children, ...props }, ref) => {
    const context = useTabsContextOptional();
    const tabs = tabsProp || context?.tabs;

    return (
      <TabPanelsSlot ref={ref} {...props}>
        {tabs ? (
          <RaCollection items={tabs as TabItemProps[]}>
            {(tab: TabItemProps) => (
              <TabPanel key={tab.id} id={tab.id}>
                {tab.content}
              </TabPanel>
            )}
          </RaCollection>
        ) : (
          children
        )}
      </TabPanelsSlot>
    );
  }
);

TabPanels.displayName = "Tabs.Panels";
