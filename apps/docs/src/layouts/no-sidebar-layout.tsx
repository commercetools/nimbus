/**
 * No Sidebar Layout Component
 *
 * A simplified full-width layout without left navigation or right aside (TOC).
 * Only includes the top bar and breadcrumb navigation.
 * Does not use AppFrame grid to allow true full-width content.
 */

import { Suspense, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner, Box, Flex, ScrollArea } from "@commercetools/nimbus";
import { AppNavBar } from "@/components/navigation/app-nav-bar";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb";
import {
  ScrollContainerProvider,
  useMainViewport,
} from "@/contexts/scroll-container-context";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";

function NoSidebarLayoutInner() {
  const mainViewportRef = useMainViewport();

  // Enable scroll restoration on navigation
  useScrollRestoration();

  // Get current location to trigger content animation on route changes
  const location = useLocation();

  return (
    <Flex direction="column" height="100vh" width="100vw" overflow="hidden">
      {/* Breadcrumb Bar - At the very top */}
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
        css={{
          animation: `${location.pathname === "/" || location.pathname === "/home" ? "slideUp" : "slideDown"} 0.3s ease-out forwards`,
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
        }}
      >
        <Suspense fallback={<Box />}>
          <BreadcrumbNav />
        </Suspense>
      </Box>

      {/* Top Bar */}
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

      {/* Main Content - Full width, scrollable */}
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
              key={location.pathname}
              animationName="fade-in"
              animationDuration="slow"
              width="full"
            >
              <Outlet />
            </Box>
          </Suspense>
        </Box>
      </ScrollArea>
    </Flex>
  );
}

export function NoSidebarLayout() {
  const mainViewportRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollContainerProvider mainViewportRef={mainViewportRef}>
      <NoSidebarLayoutInner />
    </ScrollContainerProvider>
  );
}
