/**
 * App Frame Body
 *
 * The 3-column body (left nav · main · right aside) of the app-frame layout.
 * The breadcrumb bar and top bar live in the persistent shell
 * (`dynamic-layout.tsx`); this component is the part that swaps in/out when the
 * active document switches between the `app-frame` and `no-sidebar` layouts.
 */

import { Suspense, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Stack, LoadingSpinner, Box } from "@commercetools/nimbus";
import { AppFrame } from "@/components/app-frame";
import { Menu } from "@/components/navigation/menu";
import { Toc } from "@/components/navigation/toc";
import {
  ScrollContainerProvider,
  useMainViewport,
  useSidebarViewport,
} from "@/contexts/scroll-container-context";

import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { useSidebarScrollRestoration } from "@/hooks/use-sidebar-scroll-restoration";
import { useHashNavigation } from "@/hooks/use-hash-navigation";
import { useRouteInfo } from "@/hooks/use-route-info";

function AppFrameBodyInner() {
  const mainViewportRef = useMainViewport();
  const sidebarViewportRef = useSidebarViewport();

  // Enable scroll restoration on navigation
  useScrollRestoration();

  // Enable sidebar scroll restoration
  useSidebarScrollRestoration();

  // Enable hash navigation (anchor scrolling)
  useHashNavigation();

  const { baseRoute } = useRouteInfo();

  return (
    <AppFrame.Root>
      {/* Left Navigation */}
      <AppFrame.LeftNav viewportRef={sidebarViewportRef}>
        <Suspense fallback={<LoadingSpinner />}>
          <Menu />
        </Suspense>
      </AppFrame.LeftNav>

      {/* Main Content */}
      <AppFrame.MainContent viewportRef={mainViewportRef}>
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
          <Suspense fallback={<LoadingSpinner />}>
            <Toc />
          </Suspense>
        </Stack>
      </AppFrame.RightAside>
    </AppFrame.Root>
  );
}

export function AppFrameBody() {
  const mainViewportRef = useRef<HTMLDivElement>(null);
  const sidebarViewportRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollContainerProvider
      mainViewportRef={mainViewportRef}
      sidebarViewportRef={sidebarViewportRef}
    >
      <AppFrameBodyInner />
    </ScrollContainerProvider>
  );
}
