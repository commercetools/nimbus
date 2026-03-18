import { TabNavRootSlot } from "../tab-nav.slots";
import type { TabNavProps } from "../tab-nav.types";

/**
 * # TabNav.Root
 *
 * The root container for the TabNav component. Renders a `<nav>` landmark
 * that provides the styling context for all child `TabNav.Item` links.
 *
 * Use this with `TabNav.Item` to build tab-styled navigation for route-based
 * navigation (not content-switching panels).
 *
 * @supportsStyleProps
 */
export const TabNavRoot = (props: TabNavProps) => {
  return <TabNavRootSlot {...props} />;
};

TabNavRoot.displayName = "TabNav.Root";
