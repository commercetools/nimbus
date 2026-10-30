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
import { useActiveDoc } from "@/hooks/useActiveDoc";

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

  // The home route uses a full-bleed editorial layout, so it opts out of the
  // 80ch reading column and spans the wider content area (matching the top
  // nav's own 1280px max width). Every other doc keeps the reading measure.
  const isHome = baseRoute === "" || baseRoute === "home";

  // `layout: wide` pages (overviews with a card grid) have no use for a table
  // of contents, so they drop the aside and widen the column. `activeDoc` is
  // undefined while the next route loads; keep the last value so the column
  // does not jump between widths on every navigation.
  const { doc: activeDoc } = useActiveDoc();
  const wideRef = useRef(false);
  if (activeDoc) {
    wideRef.current = activeDoc.meta.layout === "wide";
  }
  const isWide = wideRef.current;

  return (
    <AppFrame.Root hideAside={isHome || isWide}>
      {/* Left Navigation */}
      <AppFrame.LeftNav viewportRef={sidebarViewportRef}>
        <Suspense fallback={<LoadingSpinner />}>
          <Menu />
        </Suspense>
      </AppFrame.LeftNav>

      {/* Main Content */}
      <AppFrame.MainContent
        viewportRef={mainViewportRef}
        contentMaxWidth={isHome || isWide ? "1280px" : "80ch"}
      >
        <Suspense fallback={<LoadingSpinner />}>
          {/* Animated wrapper that re-renders on route change */}
          <Box key={baseRoute} animationName="fade-in" animationDuration="slow">
            <Outlet />
          </Box>
        </Suspense>
      </AppFrame.MainContent>

      {/* Right Aside (TOC only - Settings disabled). Omitted on the home route
          and on wide pages, which have no TOC and use the full width instead. */}
      {!isHome && !isWide && (
        <AppFrame.RightAside>
          <Stack gap="800">
            <Suspense fallback={<LoadingSpinner />}>
              <Toc />
            </Suspense>
          </Stack>
        </AppFrame.RightAside>
      )}
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
