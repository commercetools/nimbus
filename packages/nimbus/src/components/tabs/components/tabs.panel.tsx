import { forwardRef } from "react";
import { TabPanel as RATabPanel } from "react-aria-components";
import { TabPanel as TabPanelSlot } from "../tabs.slots";
import type { TabPanelProps } from "../tabs.types";

/**
 * # TabPanel
 *
 * An individual tab panel that displays content when its corresponding tab is selected.
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, ...props }, ref) => {
    return (
      <TabPanelSlot asChild ref={ref} {...props}>
        <RATabPanel>{children}</RATabPanel>
      </TabPanelSlot>
    );
  }
);

TabPanel.displayName = "Tabs.Panel";
