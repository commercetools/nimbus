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
  /**
   * Drop the right aside column entirely and let the main content span the
   * remaining width. Used by the home route, which has no table of contents and
   * wants the full-bleed area rather than an empty aside gap.
   */
  hideAside?: boolean;
}

export interface AppFrameLeftNavProps {
  children: ReactNode;
  viewportRef?: RefObject<HTMLDivElement | null>;
}

export interface AppFrameMainContentProps {
  children: ReactNode;
  viewportRef?: RefObject<HTMLDivElement | null>;
  /**
   * Max width of the centered content column. Defaults to `80ch` — the reading
   * measure used by documentation pages. The home route passes a wider value so
   * its full-bleed layout can use the available space on large screens.
   */
  contentMaxWidth?: string;
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
function AppFrameRoot({ children, hideAside = false }: AppFrameRootProps) {
  return (
    <Grid
      gridTemplateAreas={hideAside ? `"nav main"` : `"nav main aside"`}
      gridTemplateColumns={
        hideAside
          ? "minmax(200px, 256px) minmax(0, 1fr)"
          : "minmax(200px, 256px) minmax(80ch, 1fr) minmax(200px, 400px)"
      }
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
  contentMaxWidth = "80ch",
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
        <Box maxWidth={contentMaxWidth} mx="auto">
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
