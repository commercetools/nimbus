import { TabPanel as RATabPanel } from "react-aria-components";
import { TabsPanelSlot } from "../tabs.slots";
import type { TabPanelProps } from "../tabs.types";

/**
 * # TabPanel
 *
 * An individual tab panel that displays panelContent when its corresponding tab is selected.
 *
 * @supportsStyleProps
 */
export const TabsPanel = ({
  children,
  ref,
  shouldForceMount,
  ...props
}: TabPanelProps) => {
  // Ensure TabPanel always has children
  if (!children) {
    throw new Error("Tabs.Panel: children prop is required");
  }

  return (
    <TabsPanelSlot asChild ref={ref} {...props}>
      <RATabPanel shouldForceMount={shouldForceMount}>{children}</RATabPanel>
    </TabsPanelSlot>
  );
};

TabsPanel.displayName = "Tabs.Panel";
