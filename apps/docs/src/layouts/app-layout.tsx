/**
 * App Layout Component
 *
 * Main layout shell using the new Holy Grail AppFrame
 */

import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Stack, LoadingSpinner, Box } from "@commercetools/nimbus";
import { AppFrame } from "@/components/app-frame";
import { AppNavBar } from "@/components/navigation/app-nav-bar";
import { Menu } from "@/components/navigation/menu";
import { Toc } from "@/components/navigation/toc";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb";
//import { DevOnly } from "@/components/utils/dev-only";
//import { DocumentMetaSettings } from "@/components/document-meta-settings/document-meta-settings";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { useSidebarScrollRestoration } from "@/hooks/use-sidebar-scroll-restoration";
import { useHashNavigation } from "@/hooks/use-hash-navigation";
import { useRouteInfo } from "@/hooks/use-route-info";

export function AppLayout() {
  // Enable scroll restoration on navigation
  useScrollRestoration();

  // Enable sidebar scroll restoration
  useSidebarScrollRestoration();

  // Enable hash navigation (anchor scrolling)
  useHashNavigation();

  const { baseRoute } = useRouteInfo();

  return (
    <AppFrame.Root>
      {/* Top Bar */}
      <AppFrame.TopBar>
        <Suspense fallback={<LoadingSpinner />}>
          <AppNavBar />
        </Suspense>
      </AppFrame.TopBar>

      {/* Breadcrumb Bar - At the very top */}
      <AppFrame.BreadcrumbBar>
        <Suspense fallback={<Box />}>
          <BreadcrumbNav />
        </Suspense>
      </AppFrame.BreadcrumbBar>

      {/* Left Navigation */}
      <AppFrame.LeftNav>
        <Suspense fallback={<LoadingSpinner />}>
          <Menu />
        </Suspense>
      </AppFrame.LeftNav>

      {/* Main Content */}
      <AppFrame.MainContent>
        <Suspense fallback={<LoadingSpinner />}>
          {/* Animated wrapper that re-renders on route change */}
          <Box key={baseRoute} animationName="fade-in" animationDuration="slow">
            <Outlet />
          </Box>
        </Suspense>
      </AppFrame.MainContent>

      {/* Right Aside (TOC only - Settings disabled) */}
      <AppFrame.RightAside>
        <Stack gap="800">
          {/* Disabled for now to show consumer view */}
          {/* <DevOnly>
            <Suspense fallback={<LoadingSpinner />}>
              <DocumentMetaSettings />
            </Suspense>
          </DevOnly> */}
          <Suspense fallback={<LoadingSpinner />}>
            <Toc />
          </Suspense>
        </Stack>
      </AppFrame.RightAside>
    </AppFrame.Root>
  );
}
