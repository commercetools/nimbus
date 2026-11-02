/**
 * App Frame Body
 *
 * The 3-column body (left nav · main · right aside) of the app-frame layout.
 * The top bar lives in the persistent shell (`dynamic-layout.tsx`); this
 * component is the part that swaps in/out when the active document switches
 * between the `app-frame` and `no-sidebar` layouts. The breadcrumb sits at the
 * top of the content column, above the page title.
 */

import { Suspense, useRef } from "react";
import { Outlet } from "react-router-dom";
import { LoadingSpinner, Box, Flex } from "@commercetools/nimbus";
import { AppFrame } from "@/components/app-frame";
import { Menu } from "@/components/navigation/menu";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb";
import { Toc } from "@/components/navigation/toc";
import { MobileNav } from "@/components/navigation/mobile-nav";
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

  // The home route uses a full-bleed editorial layout and spans the wider
  // content area (matching the top nav's own 1280px max width). Other docs fill
  // the column; only their prose is limited to a reading measure.
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
    <AppFrame.Root>
      {/* Left Navigation */}
      <AppFrame.LeftNav viewportRef={sidebarViewportRef}>
        <Suspense fallback={<LoadingSpinner />}>
          <Menu />
        </Suspense>
      </AppFrame.LeftNav>

      {/* Main Content. The table of contents is the aside of the scroll area.
          It is left out on the home route and on wide pages, which have no TOC
          and use the full width instead. */}
      <AppFrame.MainContent
        viewportRef={mainViewportRef}
        contentMaxWidth={isHome || isWide ? "1280px" : undefined}
        aside={
          !isHome && !isWide ? (
            <AppFrame.RightAside>
              <Suspense fallback={<LoadingSpinner />}>
                <Toc />
              </Suspense>
            </AppFrame.RightAside>
          ) : undefined
        }
      >
        <Suspense fallback={<LoadingSpinner />}>
          {/* The menu button (narrow screens only) and the breadcrumb share a
              row. The home page has no breadcrumb, so on wide screens the row
              is empty there and is not rendered. */}
          <Flex
            display={isHome ? { base: "flex", lg: "none" } : "flex"}
            alignItems="center"
            gap="200"
            mb="600"
          >
            <MobileNav />
            {!isHome && (
              <Suspense fallback={null}>
                <BreadcrumbNav />
              </Suspense>
            )}
          </Flex>
          {/* Animated wrapper that re-renders on route change */}
          <Box key={baseRoute} animationName="fade-in" animationDuration="slow">
            <Outlet />
          </Box>
        </Suspense>
      </AppFrame.MainContent>
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
