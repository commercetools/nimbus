import { useAtom } from "jotai";
import { Suspense } from "react";
import { TabNav } from "@commercetools/nimbus";
import { menuAtom } from "@/atoms/menu";
import { useRouteInfo } from "@/hooks/use-route-info";

/**
 * AppNavBarMenu - Displays first-level menu items in tab-like navigation
 * Shows items like Home, Design Tokens, Components, etc.
 *
 * Uses the Nimbus `TabNav` component for route-based navigation. `TabNav.Item`
 * renders React Aria `<a>` links, which are intercepted by the app's
 * `NimbusProvider router={{ navigate }}` for client-side routing.
 */
export const AppNavBarMenu = () => {
  const [menu] = useAtom(menuAtom);
  const { baseRoute } = useRouteInfo();
  const activeRoute = baseRoute;

  if (!menu || menu.length === 0) {
    return null;
  }

  return (
    <TabNav.Root aria-label="Main navigation" width="auto">
      {menu.map((item) => {
        // Check if this item or any of its children is active
        const isActive =
          activeRoute === item.route ||
          activeRoute.startsWith(item.route + "/");

        return (
          <TabNav.Item
            key={item.id}
            href={`/${item.route}`}
            isCurrent={isActive}
          >
            {item.label}
          </TabNav.Item>
        );
      })}
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
