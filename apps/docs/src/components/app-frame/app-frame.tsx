/**
 * AppFrame - Holy Grail Layout Component
 *
 * Implements a 3-column layout with sticky header
 * All built with Nimbus components
 */

import type { ReactNode, RefObject } from "react";
import { Box, Grid, ScrollArea } from "@commercetools/nimbus";

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
  viewportRef?: RefObject<HTMLDivElement | null>;
}

export interface AppFrameMainContentProps {
  children: ReactNode;
  viewportRef?: RefObject<HTMLDivElement | null>;
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
      gridTemplateColumns="minmax(200px, 256px) minmax(80ch, 1fr) minmax(200px, 400px)"
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
function AppFrameLeftNav({ children, viewportRef }: AppFrameLeftNavProps) {
  return (
    <ScrollArea
      as="nav"
      id="app-frame-left-nav"
      viewportRef={viewportRef}
      gridArea="nav"
      borderRight="solid-25"
      borderColor="neutral.3"
      bg="bg"
      size="sm"
    >
      <Box py="400">{children}</Box>
    </ScrollArea>
  );
}

/**
 * Main Content Area - Scrollable with constrained content width
 */
function AppFrameMainContent({
  children,
  viewportRef,
}: AppFrameMainContentProps) {
  return (
    <ScrollArea
      as="main"
      id="main"
      viewportRef={viewportRef}
      gridArea="main"
      bg="bg"
      size="sm"
    >
      <Box p="800">
        <Box maxWidth="80ch" mx="auto">
          {children}
        </Box>
      </Box>
    </ScrollArea>
  );
}

/**
 * Right Aside - Scrollable sidebar
 */
function AppFrameRightAside({ children }: AppFrameRightAsideProps) {
  return (
    <ScrollArea as="aside" gridArea="aside" bg="bg" variant="always" size="sm">
      <Box px="800" py="400">
        {children}
      </Box>
    </ScrollArea>
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
