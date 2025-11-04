import { useAtom } from "jotai";
import { Suspense } from "react";
import { Stack, Link, Text, Box } from "@commercetools/nimbus";
import { menuAtom } from "@/atoms/menu";
import { useRouteInfo } from "@/hooks/use-route-info";

/**
 * AppNavBarMenu - Displays first-level menu items in tab-like navigation
 * Shows items like Home, Design Tokens, Components, etc.
 */
export const AppNavBarMenu = () => {
  const [menu] = useAtom(menuAtom);
  const { baseRoute } = useRouteInfo();
  const activeRoute = baseRoute;

  if (!menu || menu.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" gap="200" alignItems="stretch">
      {menu.map((item) => {
        // Check if this item or any of its children is active
        const isActive =
          activeRoute === item.route ||
          activeRoute.startsWith(item.route + "/");

        return (
          <Box key={item.id} colorPalette={isActive ? "primary" : "neutral"}>
            <Link
              href={`/${item.route}`}
              display="block"
              focusVisibleRing="outside"
              textDecoration="none"
            >
              <Text
                borderRadius="200"
                color={isActive ? "colorPalette.11!" : "colorPalette.10!"}
                bg={isActive ? "colorPalette.3" : undefined}
                fontWeight="500"
                fontSize="350"
                px="350"
                py="150"
                transition="colors"
                transitionDuration="fast"
                _hover={{
                  colorPalette: "primary",
                  color: "colorPalette.11",
                  bg: isActive ? "colorPalette.3" : "colorPalette.2",
                }}
              >
                {item.label}
              </Text>
            </Link>
          </Box>
        );
      })}
    </Stack>
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
