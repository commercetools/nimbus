import { TabsRoot } from "./components/tabs.root";
import { TabsList } from "./components/tabs.list";
import { TabsTab } from "./components/tabs.tab";
import { TabsPanels } from "./components/tabs.panels";
import { TabsPanel } from "./components/tabs.panel";

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panels: TabsPanels,
  Panel: TabsPanel,
};

export type { TabsProps, TabListProps, TabItemProps } from "./tabs.types";

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export {
  TabsRoot as _TabsRoot,
  TabsList as _TabsList,
  TabsTab as _TabsTab,
  TabsPanels as _TabsPanels,
  TabsPanel as _TabsPanel,
};
