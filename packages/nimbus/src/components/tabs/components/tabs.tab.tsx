import { Tab as RATab } from "react-aria-components";
import { TabsTabSlot } from "../tabs.slots";
import type { TabProps } from "../tabs.types";

/**
 * # Tab
 *
 * An individual tab button that allows users to switch to a specific panel.
 *
 * @supportsStyleProps
 */
export const TabsTab = ({ children, isDisabled, ...props }: TabProps) => {
  return (
    <TabsTabSlot asChild {...props}>
      <RATab isDisabled={isDisabled}>{children}</RATab>
    </TabsTabSlot>
  );
};

TabsTab.displayName = "Tabs.Tab";
