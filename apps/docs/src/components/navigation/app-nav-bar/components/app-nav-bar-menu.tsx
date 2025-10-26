import { useAtom } from "jotai";
import { useLocation } from "react-router-dom";
import { Suspense } from "react";
import { Stack, Link, Text, Box } from "@commercetools/nimbus";
import { menuAtom } from "@/atoms/menu";
import { normalizeRoute } from "@/utils/normalize-route";

/**
 * AppNavBarMenu - Displays first-level menu items in tab-like navigation
 * Shows items like Home, Design Tokens, Components, etc.
 */
export const AppNavBarMenu = () => {
  const [menu] = useAtom(menuAtom);
  const location = useLocation();
  const activeRoute = normalizeRoute(location.pathname);

  if (!menu || menu.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" gap="0" alignItems="stretch">
      {menu.map((item) => {
        // Check if this item or any of its children is active
        const isActive =
          activeRoute === item.route ||
          activeRoute.startsWith(item.route + "/");

        return (
          <Box
            key={item.id}
            /*  css={{
              borderBottom: isActive ? "2px solid" : "none",
              borderColor: isActive ? "colorPalette.11" : "transparent",
              marginBottom: "-2px",
            }} */
            colorPalette={isActive ? "primary" : "neutral"}
          >
            <Link
              href={`/${item.route}`}
              display="block"
              focusRing="outside"
              borderRadius="50"
              textDecoration="none"
            >
              <Text
                borderRadius="100"
                color={isActive ? "colorPalette.11!" : "colorPalette.10!"}
                bg={isActive ? "colorPalette.3" : undefined}
                fontWeight="500"
                fontSize="350"
                px="400"
                py="150"
                transition="colors"
                transitionDuration="fast"
                _hover={{
                  color: "colorPalette.11",
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
