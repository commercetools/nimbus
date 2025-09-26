import { forwardRef } from "react";
import { Tab as RATab } from "react-aria-components";
import { TabsTab as TabsTabSlot } from "../tabs.slots";
import type { TabProps } from "../tabs.types";

/**
 * # Tab
 *
 * An individual tab button that allows users to switch to a specific panel.
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ children, isDisabled, ...props }, ref) => {
    return (
      <TabsTabSlot asChild ref={ref} {...props}>
        <RATab isDisabled={isDisabled}>{children}</RATab>
      </TabsTabSlot>
    );
  }
);

Tab.displayName = "Tabs.Tab";
