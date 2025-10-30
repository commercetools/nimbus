import { Collection as RaCollection } from "react-aria-components";
import { TabsPanelsSlot } from "../tabs.slots";
import { TabsPanel } from "./tabs.panel";
import type { TabItemProps, TabPanelsProps } from "../tabs.types";

/**
 * # TabPanels
 *
 * A container for the tab panels that displays panelContent based on the selected tab.
 */
export const TabsPanels = ({ tabs, children, ...props }: TabPanelsProps) => {
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
            <TabsPanel key={tab.id} id={tab.id}>
              {tab.panelContent}
            </TabsPanel>
          )}
        </RaCollection>
      ) : (
        children
      )}
    </TabsPanelsSlot>
  );
};

TabsPanels.displayName = "Tabs.Panels";
