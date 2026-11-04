import { Flex, Box, Stack } from "@commercetools/nimbus";
import { Suspense } from "react";

import { ColorThemeMenu, ColorModeToggle } from "@/components/top-bar";
import { AppNavBarSearch } from "./components/app-nav-bar-search/app-nav-bar-search.tsx";
import { AppNavBarBrand } from "./components/app-nav-bar-brand.tsx";
import { AppNavBarMenuWithSuspense } from "./components/app-nav-bar-menu.tsx";
import { MobileNav } from "@/components/navigation/mobile-nav";

type AppNavBarProps = {
  /**
   * Show the button that opens the sidebar menu in a drawer. It appears below
   * the `lg` breakpoint, where the sidebar is hidden. Pass `false` for pages
   * that have no sidebar.
   */
  showMobileNav?: boolean;
};

export const AppNavBar = ({ showMobileNav = false }: AppNavBarProps) => {
  return (
    <Flex
      id="app-nav-bar"
      width="full"
      alignItems="center"
      justifyContent="space-between"
      px="400"
      py="100"
      minHeight="1400"
      // TODO: Remove this once we have a proper layout
      maxWidth="1280px"
    >
      {/* Left: Sidebar menu button + Logo + Search + Main Menu */}
      <Stack direction="row" gap="400" alignItems="center" flexShrink="0">
        {showMobileNav && <MobileNav />}
        <AppNavBarBrand />
        <Suspense fallback={<Box>Loading search...</Box>}>
          <AppNavBarSearch />
        </Suspense>
        <AppNavBarMenuWithSuspense />
      </Stack>

      {/* Right: Color Mode + Color Theme */}
      <Stack direction="row" gap="400" alignItems="center" flexShrink="0">
        <ColorModeToggle />
        <ColorThemeMenu />
      </Stack>
    </Flex>
  );
};
