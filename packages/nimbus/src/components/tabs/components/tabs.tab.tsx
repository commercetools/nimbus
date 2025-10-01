import { Tab as RATab } from "react-aria-components";
import { TabsTabSlot } from "../tabs.slots";
import type { TabProps } from "../tabs.types";

/**
 * # Tab
 *
 * An individual tab button that allows users to switch to a specific panel.
 */
export const Tab = ({ children, isDisabled, ...props }: TabProps) => {
  return (
    <TabsTabSlot asChild {...props}>
      <RATab isDisabled={isDisabled}>{children}</RATab>
    </TabsTabSlot>
  );
};

Tab.displayName = "Tabs.Tab";
