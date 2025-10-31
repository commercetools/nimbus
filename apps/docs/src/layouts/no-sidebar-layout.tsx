/**
 * No Sidebar Layout Component
 *
 * A simplified full-width layout without left navigation or right aside (TOC).
 * Only includes the top bar and breadcrumb navigation.
 * Does not use AppFrame grid to allow true full-width content.
 */

import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner, Box, Flex } from "@commercetools/nimbus";
import { AppNavBar } from "@/components/navigation/app-nav-bar";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";

export function NoSidebarLayout() {
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
      <Box
        as="main"
        flex={1}
        overflowY="auto"
        overflowX="hidden"
        p="800"
        bg="bg"
        width="full"
        css={{
          // Fade in + slide down animation
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
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "var(--colors-neutral-2)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--colors-neutral-6)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "var(--colors-neutral-7)",
          },
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          {/* Animated wrapper that re-renders on route change */}
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
    </Flex>
  );
}
