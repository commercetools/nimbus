/**
 * No Sidebar Body
 *
 * The full-width, scrollable body of the no-sidebar layout (no left navigation
 * or right aside). The breadcrumb bar and top bar live in the persistent shell
 * (`dynamic-layout.tsx`); this component is the part that swaps in/out when the
 * active document switches between the `app-frame` and `no-sidebar` layouts.
 */

import { Suspense, useRef } from "react";
import { Outlet } from "react-router-dom";
import { LoadingSpinner, Box, ScrollArea } from "@commercetools/nimbus";
import {
  ScrollContainerProvider,
  useMainViewport,
} from "@/contexts/scroll-container-context";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { useRouteInfo } from "@/hooks/use-route-info";

function NoSidebarBodyInner() {
  const mainViewportRef = useMainViewport();

  // Enable scroll restoration on navigation
  useScrollRestoration();

  // Key the content on the resolved base route (not the full pathname) so a
  // page that owns a sub-route space — like Icons (`/icons/:name`,
  // `/icons/category/:slug`) — is NOT remounted as you navigate within it. A
  // remount would re-suspend (flashing the spinner), drop the page's state, and
  // re-run its data loads even though everything is already loaded. This
  // matches the app-frame layout's behavior.
  const { baseRoute } = useRouteInfo();

  return (
    <ScrollArea
      as="main"
      viewportRef={mainViewportRef}
      flex={1}
      bg="bg"
      width="full"
      size="sm"
      css={{
        animation: "fadeInSlideDown 0.4s ease-out forwards",
        "@keyframes fadeInSlideDown": {
          from: {
            opacity: 0,
            transform: "translateY(-16px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Box p="800">
        <Suspense fallback={<LoadingSpinner />}>
          <Box
            key={baseRoute}
            animationName="fade-in"
            animationDuration="slow"
            width="full"
          >
            <Outlet />
          </Box>
        </Suspense>
      </Box>
    </ScrollArea>
  );
}

export function NoSidebarBody() {
  const mainViewportRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollContainerProvider mainViewportRef={mainViewportRef}>
      <NoSidebarBodyInner />
    </ScrollContainerProvider>
  );
}
