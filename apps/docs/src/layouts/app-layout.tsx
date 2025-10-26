/**
 * App Layout Component
 *
 * Main layout shell using the new Holy Grail AppFrame
 */

import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Stack, LoadingSpinner, Box } from "@commercetools/nimbus";
import { AppFrame } from "@/components/app-frame";
import { AppNavBar } from "@/components/navigation/app-nav-bar";
import { Menu } from "@/components/navigation/menu";
import { Toc } from "@/components/navigation/toc";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb";
//import { DevOnly } from "@/components/utils/dev-only";
//import { DocumentMetaSettings } from "@/components/document-meta-settings/document-meta-settings";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";

export function AppLayout() {
  // Enable scroll restoration on navigation
  useScrollRestoration();

  // Get current location to trigger content animation on route changes
  const location = useLocation();

  return (
    <AppFrame.Root>
      {/* Breadcrumb Bar - At the very top */}
      <AppFrame.BreadcrumbBar>
        <Suspense fallback={<Box />}>
          <BreadcrumbNav />
        </Suspense>
      </AppFrame.BreadcrumbBar>

      {/* Top Bar */}
      <AppFrame.TopBar>
        <Suspense fallback={<LoadingSpinner />}>
          <AppNavBar />
        </Suspense>
      </AppFrame.TopBar>

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
          <Box
            key={location.pathname}
            animationName="fade-in"
            animationDuration="slow"
          >
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
