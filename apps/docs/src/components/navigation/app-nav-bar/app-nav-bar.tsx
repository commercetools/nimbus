import { Flex, Box, Stack } from "@commercetools/nimbus";
import { DevOnly } from "@/components/utils/dev-only";
import { Suspense } from "react";

import { ColorThemeMenu, ColorModeToggle } from "@/components/top-bar";
import { AppNavBarSearch } from "./components/app-nav-bar-search/app-nav-bar-search.tsx";
import { AppNavBarCreateButton } from "./components/app-nav-bar-create-button.tsx";
import { AppNavBarBrand } from "./components/app-nav-bar-brand.tsx";
import { AppNavBarMenuWithSuspense } from "./components/app-nav-bar-menu.tsx";

export const AppNavBar = () => {
  return (
    <Flex
      id="app-nav-bar"
      width="full"
      alignItems="center"
      justifyContent="space-between"
      px="400"
      py="100"
    >
      {/* Left: Logo + Main Menu */}
      <Stack direction="row" gap="400" alignItems="center" flexShrink="0">
        <AppNavBarBrand />
        <AppNavBarMenuWithSuspense />
      </Stack>

      {/* Right: Search + Dev Controls + Color Mode + Color Theme */}
      <Stack direction="row" gap="400" alignItems="center" flexShrink="0">
        <Suspense fallback={<Box>Loading search...</Box>}>
          <AppNavBarSearch />
        </Suspense>
        <DevOnly>
          <AppNavBarCreateButton />
        </DevOnly>
        <ColorModeToggle />
        <ColorThemeMenu />
      </Stack>
    </Flex>
  );
};
