/**
 * Dynamic Layout Component
 *
 * The persistent layout shell. It renders the breadcrumb bar and top bar
 * (AppNavBar) at stable positions that never unmount, and swaps only the body
 * below them between the `app-frame` and `no-sidebar` variants based on the
 * active document's `layout` property.
 *
 * Keeping the top bar mounted across layout swaps is what lets the AppNavBar's
 * animated TabNav indicator slide continuously when navigating to/from a
 * no-sidebar page (e.g. Icons) instead of re-appearing from scratch.
 */

import { Suspense, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Flex, Box, LoadingSpinner } from "@commercetools/nimbus";
import { AppFrameBody } from "./app-layout";
import { NoSidebarBody } from "./no-sidebar-layout";
import { AppNavBar } from "@/components/navigation/app-nav-bar";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb";
import { useActiveDoc } from "@/hooks/useActiveDoc";

type LayoutKind = "app-frame" | "no-sidebar";

export function DynamicLayout() {
  const { doc: activeDoc } = useActiveDoc();
  const location = useLocation();

  // Sticky layout choice. `activeDoc` is momentarily `undefined` on every
  // navigation while the next route's doc loads. We remember the last resolved
  // layout and keep rendering it through the loading window so the body doesn't
  // flicker between variants on every link click. The body only swaps when a
  // freshly resolved doc actually calls for a different layout.
  const lastLayoutRef = useRef<LayoutKind | null>(null);

  if (activeDoc) {
    lastLayoutRef.current =
      activeDoc.meta.layout === "no-sidebar" ? "no-sidebar" : "app-frame";
  }

  // Default to app-frame on the very first load, before any doc has resolved.
  const layout = lastLayoutRef.current ?? "app-frame";
  const isNoSidebar = layout === "no-sidebar";
  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <Flex direction="column" height="100vh" width="100vw" overflow="hidden">
      {/* Breadcrumb Bar - persistent position at the very top. In the
          no-sidebar layout it slides up/away on the home route; the app-frame
          layout keeps it static (matching the previous per-layout behavior). */}
      <Box
        id="app-frame-breadcrumb-bar"
        position="sticky"
        top={0}
        zIndex={1000}
        bg="bg"
        borderBottom="solid-25"
        borderColor="neutral.3"
        width="full"
        px="400"
        py="200"
        css={
          isNoSidebar
            ? {
                animation: `${isHome ? "slideUp" : "slideDown"} 0.3s ease-out forwards`,
                "@keyframes slideUp": {
                  from: {
                    transform: "translateY(0)",
                    opacity: 1,
                  },
                  to: {
                    transform: "translateY(-100%)",
                    opacity: 0,
                    height: 0,
                    minHeight: 0,
                    padding: 0,
                    margin: 0,
                    border: "none",
                  },
                },
                "@keyframes slideDown": {
                  from: {
                    transform: "translateY(-100%)",
                    opacity: 0,
                  },
                  to: {
                    transform: "translateY(0)",
                    opacity: 1,
                  },
                },
              }
            : undefined
        }
      >
        <Suspense fallback={<Box />}>
          <BreadcrumbNav />
        </Suspense>
      </Box>

      {/* Top Bar - persistent position. AppNavBar (and its animated TabNav
          indicator) stays mounted across body/layout swaps. */}
      <Box
        id="app-frame-top-bar"
        position="sticky"
        top={0}
        zIndex={999}
        bg="bg"
        borderBottom="solid-25"
        borderColor="neutral.3"
        width="full"
      >
        <Suspense fallback={<LoadingSpinner />}>
          <AppNavBar />
        </Suspense>
      </Box>

      {/* Body - the only part that swaps between layout variants. */}
      {isNoSidebar ? <NoSidebarBody /> : <AppFrameBody />}
    </Flex>
  );
}
