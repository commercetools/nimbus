import { Collection as RaCollection } from "react-aria-components";
import { TabsPanelsSlot } from "../tabs.slots";
import { TabPanel } from "./tabs.panel";
import { useTabsContextOptional } from "./tabs.context";
import type { TabItemProps, TabPanelsProps } from "../tabs.types";

/**
 * # TabPanels
 *
 * A container for the tab panels that displays content based on the selected tab.
 */
export const TabPanels = ({
  tabs: tabsProp,
  children,
  ...props
}: TabPanelsProps) => {
  const context = useTabsContextOptional();
  const tabs = tabsProp || context?.tabs;

  // Ensure TabPanels always has children - either from tabs or provided children
  if (!tabs && !children) {
    throw new Error(
      'Tabs.Panels: Either provide "items" prop or "children" must be provided'
    );
  }

  return (
    <TabsPanelsSlot {...props}>
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
    </TabsPanelsSlot>
  );
};

TabPanels.displayName = "Tabs.Panels";
