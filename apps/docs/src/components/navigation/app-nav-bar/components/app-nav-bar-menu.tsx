import { useAtom } from "jotai";
import { Suspense } from "react";
import { TabNav } from "@commercetools/nimbus";
import { menuAtom } from "@/atoms/menu";
import {
  findActiveSection,
  firstPageRoute,
} from "@/components/navigation/menu/shape-navigation";
import { useRouteInfo } from "@/hooks/use-route-info";

/**
 * AppNavBarMenu - Displays the top-level sections in tab-like navigation
 * Shows items like Home, Styling, Components, etc.
 *
 * Uses the Nimbus `TabNav` component for route-based navigation. `TabNav.Item`
 * renders React Aria `<a>` links, which are intercepted by the app's
 * `NimbusProvider router={{ navigate }}` for client-side routing.
 */
export const AppNavBarMenu = () => {
  const [menu] = useAtom(menuAtom);
  const { baseRoute } = useRouteInfo();

  if (!menu || menu.length === 0) {
    return null;
  }

  // A section can hold pages from another URL path (Styling holds
  // `/home/design-tokens`), so the active tab comes from the navigation tree,
  // not from the first part of the URL.
  const activeSection = findActiveSection(menu, baseRoute);

  return (
    <TabNav.Root aria-label="Main navigation" variant="rounded" width="auto">
      {menu.map((item) => (
        <TabNav.Item
          key={item.id}
          href={`/${firstPageRoute(item) ?? item.route}`}
          isCurrent={item.id === activeSection?.id}
        >
          {item.label}
        </TabNav.Item>
      ))}
    </TabNav.Root>
  );
};

/**
 * Suspense wrapper for AppNavBarMenu
 */
export const AppNavBarMenuWithSuspense = () => (
  <Suspense fallback={null}>
    <AppNavBarMenu />
  </Suspense>
);
