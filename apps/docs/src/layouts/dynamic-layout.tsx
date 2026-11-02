/**
 * Dynamic Layout Component
 *
 * The persistent layout shell. It renders the top bar (AppNavBar) at a stable
 * position that never unmounts, and swaps only the body below it between the
 * `app-frame` and `no-sidebar` variants based on the active document's
 * `layout` property. The breadcrumb is part of each body, above the content.
 *
 * Keeping the top bar mounted across layout swaps is what lets the AppNavBar's
 * animated TabNav indicator slide continuously when navigating to/from a
 * no-sidebar page (e.g. Icons) instead of re-appearing from scratch.
 */

import { Suspense, useRef } from "react";
import { Flex, Box, LoadingSpinner } from "@commercetools/nimbus";
import { AppFrameBody } from "./app-layout";
import { NoSidebarBody } from "./no-sidebar-layout";
import { AppNavBar } from "@/components/navigation/app-nav-bar";
import { useActiveDoc } from "@/hooks/useActiveDoc";

type LayoutKind = "app-frame" | "no-sidebar";

export function DynamicLayout() {
  const { doc: activeDoc } = useActiveDoc();

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

  return (
    <Flex direction="column" height="100vh" width="100vw" overflow="hidden">
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
