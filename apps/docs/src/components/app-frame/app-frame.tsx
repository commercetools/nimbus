/**
 * AppFrame - Holy Grail Layout Component
 *
 * Implements the 3-column body (left nav · main · right aside) of the app-frame
 * layout. The breadcrumb bar and top bar are owned by the persistent layout
 * shell (`dynamic-layout.tsx`) so they survive layout swaps; this grid only
 * fills the remaining space below them.
 */

import type { ReactNode, RefObject } from "react";
import { Box, Grid, ScrollArea } from "@commercetools/nimbus";

export interface AppFrameRootProps {
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
 * Root component - 3-column grid (left nav · main · right aside).
 *
 * Designed to be a flex child of the layout shell: it grows to fill the space
 * left under the breadcrumb/top bars (`flex: 1`) and clips its own overflow so
 * each column scrolls independently.
 */
function AppFrameRoot({ children }: AppFrameRootProps) {
  return (
    <Grid
      gridTemplateAreas={`"nav main aside"`}
      gridTemplateColumns="minmax(200px, 256px) minmax(80ch, 1fr) minmax(200px, 400px)"
      flex="1"
      minHeight="0"
      width="full"
      overflow="hidden"
    >
      {children}
    </Grid>
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
  LeftNav: AppFrameLeftNav,
  MainContent: AppFrameMainContent,
  RightAside: AppFrameRightAside,
};
