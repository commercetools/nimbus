import { TabList as RATabList } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { TabsListSlot } from "../tabs.slots";
import { Tab } from "./tabs.tab";
import { useTabsContextOptional } from "./tabs.context";
import type { TabListProps, TabItemProps } from "../tabs.types";

/**
 * # TabList
 *
 * A container for the tab buttons that allows users to switch between different panels.
 */
export const TabList = ({
  tabs: tabsProp,
  children,
  ...props
}: TabListProps) => {
  const context = useTabsContextOptional();
  const tabs = tabsProp || context?.tabs;
  const [styleProps, restProps] = extractStyleProps(props);

  // Ensure RATabList always has children - either from tabs or provided children
  if (!tabs && !children) {
    throw new Error(
      'Tabs.List: Either provide "tabs" prop or "children" must be provided'
    );
  }

  return (
    <TabsListSlot {...styleProps} asChild>
      <RATabList items={tabs as TabItemProps[]} {...restProps}>
        {tabs
          ? (tab: TabItemProps) => (
              <Tab key={tab.id} id={tab.id} isDisabled={tab.isDisabled}>
                {tab.title}
              </Tab>
            )
          : children}
      </RATabList>
    </TabsListSlot>
  );
};

TabList.displayName = "Tabs.List";
