/**
 * AppFrame - Holy Grail Layout Component
 *
 * Implements the body of the app-frame layout: the left nav and the main scroll
 * area, which holds the content and the right aside. The breadcrumb bar and top bar are owned by the persistent layout
 * shell (`dynamic-layout.tsx`) so they survive layout swaps; this grid only
 * fills the remaining space below them.
 */

import type { ReactNode, RefObject } from "react";
import { Box, Flex, Grid, ScrollArea } from "@commercetools/nimbus";

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
  /**
   * Max width of the centered content column. Defaults to `80ch` — the reading
   * measure used by documentation pages. The home route passes a wider value so
   * its full-bleed layout can use the available space on large screens.
   */
  contentMaxWidth?: string;
  /**
   * Content of the right aside (the table of contents). It sits next to the
   * content, inside the same scroll area, and stays in view while the page
   * scrolls. Leave it out for pages without an aside.
   */
  aside?: ReactNode;
}

export interface AppFrameRightAsideProps {
  children: ReactNode;
}

/**
 * Root component - 2-column grid (left nav · main) from the `lg` breakpoint up.
 * The right aside lives inside the main column, so the content and the aside
 * scroll together. Below `lg`, only the main column shows; the sidebar moves
 * into a drawer (`MobileNav`) and the table of contents is hidden.
 *
 * Designed to be a flex child of the layout shell: it grows to fill the space
 * left under the breadcrumb/top bars (`flex: 1`) and clips its own overflow so
 * the navigation and the main column scroll independently.
 */
function AppFrameRoot({ children }: AppFrameRootProps) {
  return (
    <Grid
      gridTemplateAreas={{
        base: `"main"`,
        lg: `"nav main"`,
      }}
      gridTemplateColumns={{
        base: "minmax(0, 1fr)",
        lg: "minmax(200px, 256px) minmax(0, 1fr)",
      }}
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
      display={{ base: "none", lg: "block" }}
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
 * Main Content Area - the scroll area of the page. It holds the content and,
 * from the `lg` breakpoint up, the optional aside next to it.
 */
function AppFrameMainContent({
  children,
  viewportRef,
  contentMaxWidth,
  aside,
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
      <Flex
        // The top padding is zero so the sticky view tabs sit flush with the
        // top of the scroll area; the header brings its own spacing.
        px="800"
        pb="800"
        gap="1200"
        alignItems="flex-start"
        justifyContent="center"
      >
        <Box flex="1" minWidth="0" maxWidth={contentMaxWidth} pt="800">
          {children}
        </Box>
        {aside}
      </Flex>
    </ScrollArea>
  );
}

/**
 * Right Aside - sticky column that stays in view while the page scrolls. It
 * does not scroll on its own unless it is taller than the screen.
 */
function AppFrameRightAside({ children }: AppFrameRightAsideProps) {
  return (
    <Box
      as="aside"
      display={{ base: "none", lg: "block" }}
      flexShrink="0"
      width="240px"
      position="sticky"
      top="800"
      mt="800"
      maxHeight="calc(100vh - 200px)"
      overflowY="auto"
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
  LeftNav: AppFrameLeftNav,
  MainContent: AppFrameMainContent,
  RightAside: AppFrameRightAside,
};
