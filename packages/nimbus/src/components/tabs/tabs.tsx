import { forwardRef } from "react";
import { TabsRoot } from "./components/tabs.root";
import { TabList } from "./components/tabs.list";
import { Tab } from "./components/tabs.tab";
import { TabPanels } from "./components/tabs.panels";
import { TabPanel } from "./components/tabs.panel";
import type { TabsProps } from "./tabs.types";

const TabsBase = forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, ...props }, ref) => {
    return (
      <TabsRoot ref={ref} tabs={tabs} {...props}>
        <TabList />
        <TabPanels />
      </TabsRoot>
    );
  }
);

TabsBase.displayName = "Tabs";

export const Tabs = Object.assign(TabsBase, {
  Root: TabsRoot,
  List: TabList,
  Tab: Tab,
  Panels: TabPanels,
  Panel: TabPanel,
});

export type { TabsProps, TabListProps, TabItemProps } from "./tabs.types";

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export {
  TabsRoot as _TabsRoot,
  TabList as _TabList,
  Tab as _Tab,
  TabPanels as _TabPanels,
  TabPanel as _TabPanel,
};
