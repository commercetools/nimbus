/**
 * No Sidebar Body
 *
 * The body of the no-sidebar layout: the space below the top bar, without the
 * site menu, breadcrumb or table of contents. The page draws its own frame in
 * it, including its `main` element, its scroll area and its breadcrumb. The
 * Icons page uses it for its category list and icon grid (see `IconSearch`).
 *
 * The top bar lives in the persistent shell (`dynamic-layout.tsx`); this
 * component is the part that swaps in/out when the active document switches
 * between the `app-frame` and `no-sidebar` layouts.
 */

import { Suspense, useRef } from "react";
import { Outlet } from "react-router-dom";
import { LoadingSpinner, Box } from "@commercetools/nimbus";
import { ScrollContainerProvider } from "@/contexts/scroll-container-context";
import { useRouteInfo } from "@/hooks/use-route-info";

function NoSidebarBodyInner() {
  // Key the content on the resolved base route (not the full pathname) so a
  // page that owns a sub-route space — like Icons, whose detail dialog is the
  // path segment `/icons/:name` (with its filters carried as query params) — is
  // NOT remounted as you navigate within it. A remount would re-suspend
  // (flashing the spinner), drop the page's state, and re-run its data loads
  // even though everything is already loaded. This matches the app-frame
  // layout's behavior.
  const { baseRoute } = useRouteInfo();

  return (
    // `position: relative` and a fixed height, so the page can fill the body
    // with `position: absolute; inset: 0`.
    <Box position="relative" flex="1" minHeight="0" width="full" bg="bg">
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
