import React, { createContext, useContext } from "react";
import type { TabItemProps } from "../tabs.types";

interface TabsContextValue {
  tabs: TabItemProps[];
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
};

export const useTabsContextOptional = () => {
  return useContext(TabsContext);
};

export const TabsProvider: React.FC<{
  children: React.ReactNode;
  tabs: TabItemProps[];
}> = ({ children, tabs }) => {
  return (
    <TabsContext.Provider value={{ tabs }}>{children}</TabsContext.Provider>
  );
};
