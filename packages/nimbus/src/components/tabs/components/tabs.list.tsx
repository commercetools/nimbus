import { forwardRef } from "react";
import { TabList as RATabList } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { TabList as TabListSlot } from "../tabs.slots";
import { Tab } from "./tabs.tab";
import { useTabsContextOptional } from "./tabs.context";
import type { TabListProps, TabItemProps } from "../tabs.types";

/**
 * # TabList
 *
 * A container for the tab buttons that allows users to switch between different panels.
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ tabs: tabsProp, children, ...props }, ref) => {
    const context = useTabsContextOptional();
    const tabs = tabsProp || context?.tabs;
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <TabListSlot ref={ref} {...styleProps} asChild>
        <RATabList items={tabs as TabItemProps[]} {...restProps}>
          {tabs
            ? (tab: TabItemProps) => (
                <Tab key={tab.id} id={tab.id} isDisabled={tab.isDisabled}>
                  {tab.title}
                </Tab>
              )
            : children}
        </RATabList>
      </TabListSlot>
    );
  }
);

TabList.displayName = "Tabs.List";
