import { forwardRef } from "react";
import { TabPanel as RATabPanel } from "react-aria-components";
import { TabsPanelSlot } from "../tabs.slots";
import type { TabPanelProps } from "../tabs.types";

/**
 * # TabPanel
 *
 * An individual tab panel that displays panelContent when its corresponding tab is selected.
 */
export const TabsPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, ...props }, ref) => {
    // Ensure TabPanel always has children
    if (!children) {
      throw new Error("Tabs.Panel: children prop is required");
    }

    return (
      <TabsPanelSlot asChild ref={ref} {...props}>
        <RATabPanel>{children}</RATabPanel>
      </TabsPanelSlot>
    );
  }
);

TabsPanel.displayName = "Tabs.Panel";
