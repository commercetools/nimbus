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
export const TabsTab = ({
  children,
  isDisabled,
  href,
  target,
  rel,
  routerOptions,
  ...props
}: TabProps) => {
  return (
    <TabsTabSlot asChild {...props}>
      <RATab
        isDisabled={isDisabled}
        href={href}
        target={target}
        rel={rel}
        routerOptions={routerOptions}
      >
        {children}
      </RATab>
    </TabsTabSlot>
  );
};

TabsTab.displayName = "Tabs.Tab";
