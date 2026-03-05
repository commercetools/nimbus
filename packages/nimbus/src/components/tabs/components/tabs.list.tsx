import { TabList as RATabList } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { TabsListSlot } from "../tabs.slots";
import { TabsTab } from "./tabs.tab";
import type { TabListProps, TabItemProps } from "../tabs.types";

/**
 * # TabList
 *
 * A container for the tab buttons that allows users to switch between different panels.
 *
 * @supportsStyleProps
 */
export const TabsList = ({ tabs, children, ...props }: TabListProps) => {
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
              <TabsTab
                key={tab.id}
                id={tab.id}
                isDisabled={tab.isDisabled}
                href={tab.href}
                target={tab.target}
                rel={tab.rel}
                routerOptions={tab.routerOptions}
              >
                {tab.tabLabel}
              </TabsTab>
            )
          : children}
      </RATabList>
    </TabsListSlot>
  );
};

TabsList.displayName = "Tabs.List";
