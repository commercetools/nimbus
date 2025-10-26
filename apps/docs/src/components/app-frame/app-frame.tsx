/**
 * AppFrame - Holy Grail Layout Component
 *
 * Implements a 3-column layout with sticky header
 * All built with Nimbus components
 */

import type { ReactNode } from "react";
import { Box, Grid } from "@commercetools/nimbus";
import { useLocation } from "react-router-dom";

export interface AppFrameRootProps {
  children: ReactNode;
}

export interface AppFrameBreadcrumbBarProps {
  children: ReactNode;
}

export interface AppFrameTopBarProps {
  children: ReactNode;
}

export interface AppFrameLeftNavProps {
  children: ReactNode;
}

export interface AppFrameMainContentProps {
  children: ReactNode;
}

export interface AppFrameRightAsideProps {
  children: ReactNode;
}

/**
 * Root component - Holy Grail grid layout with breadcrumb bar at top
 */
function AppFrameRoot({ children }: AppFrameRootProps) {
  return (
    <Grid
      gridTemplateAreas={`
        "breadcrumbs breadcrumbs breadcrumbs"
        "header header header"
        "nav main aside"
      `}
      gridTemplateRows="auto auto 1fr"
      gridTemplateColumns="minmax(200px, 256px) 80ch 1fr"
      height="100vh"
      width="100vw"
      overflow="hidden"
    >
      {children}
    </Grid>
  );
}

/**
 * Breadcrumb Bar - Sticky bar at the very top
 * Slides down with animation when transitioning away from /home route
 */
function AppFrameBreadcrumbBar({ children }: AppFrameBreadcrumbBarProps) {
  const location = useLocation();
  const isOnHome = location.pathname === "/home";

  return (
    <Box
      gridArea="breadcrumbs"
      position="sticky"
      top={0}
      zIndex={1000}
      bg="bg"
      borderBottom="solid-25"
      borderColor="neutral.3"
      px="400"
      py="200"
      css={{
        animation: !isOnHome ? "slideDownBreadcrumbs 0.3s ease-out" : "none",
        "@keyframes slideDownBreadcrumbs": {
          from: {
            opacity: 0,
            transform: "translateY(-8px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Top Bar - Sticky header below breadcrumbs
 */
function AppFrameTopBar({ children }: AppFrameTopBarProps) {
  return (
    <Box
      id="app-frame-top-bar"
      gridArea="header"
      position="sticky"
      top={0}
      zIndex={999}
      bg="bg"
      borderBottom="solid-25"
      borderColor="neutral.3"
    >
      {children}
    </Box>
  );
}

/**
 * Left Navigation - Scrollable sidebar
 */
function AppFrameLeftNav({ children }: AppFrameLeftNavProps) {
  return (
    <Box
      as="nav"
      gridArea="nav"
      overflowY="auto"
      overflowX="hidden"
      borderRight="solid-25"
      borderColor="neutral.3"
      bg="bg"
      py="400"
      css={{
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
      {children}
    </Box>
  );
}

/**
 * Main Content Area - Scrollable
 */
function AppFrameMainContent({ children }: AppFrameMainContentProps) {
  return (
    <Box
      as="main"
      id="main"
      gridArea="main"
      overflowY="auto"
      overflowX="hidden"
      p="800"
      bg="bg"
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
      {children}
    </Box>
  );
}

/**
 * Right Aside - Scrollable sidebar
 */
function AppFrameRightAside({ children }: AppFrameRightAsideProps) {
  return (
    <Box
      as="aside"
      gridArea="aside"
      overflowY="auto"
      overflowX="hidden"
      bg="bg"
      pl="400"
      pr="400"
      py="400"
      css={{
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
      {children}
    </Box>
  );
}

/**
 * AppFrame Compound Component
 */
export const AppFrame = {
  Root: AppFrameRoot,
  BreadcrumbBar: AppFrameBreadcrumbBar,
  TopBar: AppFrameTopBar,
  LeftNav: AppFrameLeftNav,
  MainContent: AppFrameMainContent,
  RightAside: AppFrameRightAside,
};
