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
  // React Aria keys its link handling off the *presence* of the `href` prop,
  // not its value: forwarding `href={undefined}` still makes it coerce the href
  // to an empty string, and React then rejects the resulting `href=""` on the
  // non-anchor tab element with a dev-only "An empty string was passed to the
  // href attribute" console error. Only forward the link props when there's an
  // actual href, so plain (non-link) tabs never carry them.
  const linkProps = href != null ? { href, target, rel, routerOptions } : {};
  return (
    <TabsTabSlot asChild {...props}>
      <RATab isDisabled={isDisabled} {...linkProps}>
        {children}
      </RATab>
    </TabsTabSlot>
  );
};

TabsTab.displayName = "Tabs.Tab";
