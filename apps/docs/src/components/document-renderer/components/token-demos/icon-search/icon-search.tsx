import {
  Box,
  Flex,
  ScrollArea,
  Splitter,
  useResponsiveSplitterSizes,
} from "@commercetools/nimbus";
import { useCallback, useRef } from "react";

import { useIconData } from "./use-icon-data";
import { CategoryRail } from "./category-rail";
import { IconBrowse } from "./icon-browse";
import { IconDetailDialog } from "./icon-detail";
import { IconDisplayControls } from "./icon-display-controls";

/**
 * IconSearch is the entry point rendered by the Icons doc (`<IconSearch />` in
 * the MDX). Because `use-route-info` resolves any `/icons/*` path to the Icons
 * doc (longest-prefix match), this single component owns the `/icons` URL space,
 * and all browsing state lives in the URL (see `use-icon-route-state`):
 *
 *   /icons                                    -> browse, no filters
 *   /icons?category=:slug&tag=:t&search=:q    -> browse, filtered (AND-combined)
 *   /icons?size=:px&surface=:shape            -> grid display preferences
 *   /icons/:name                              -> the icon's detail dialog, layered
 *                                                on top of whatever filters apply
 *
 * Filter/display params write with `{ replace: true }` so tweaks don't spam
 * history; opening an icon pushes an entry so Back closes the dialog and
 * restores the exact filtered grid. Because the no-sidebar layout keys its
 * content on the base route, this Splitter shell stays mounted across every
 * navigation within `/icons` — the rail never remounts and the dialog
 * opens/closes without tearing down the grid.
 *
 * State is not threaded through props: children read the URL via
 * `useIconRouteState` directly, and this shell only passes the loaded data
 * down (`entries`, `categories`, `metadata`).
 */
export const IconSearch = () => {
  const { entries, categories, metadata } = useIconData();

  // The scrollable viewport of the main (grid) pane. Held so a pagination page
  // change can reset it to the top — see `scrollMainToTop`.
  const mainViewportRef = useRef<HTMLDivElement>(null);
  const scrollMainToTop = useCallback(() => {
    mainViewportRef.current?.scrollTo({ top: 0 });
  }, []);

  // Persist the category-rail width (in pixels) across reloads. The hook
  // measures the container, translates the pixel config to the percentage the
  // splitter consumes, drives its controlled `size`, and writes the settled
  // width back under `persistKey` on every resize.
  const { rootProps } = useResponsiveSplitterSizes({
    persistKey: "docs:icon-search-rail",
    size: 240,
    minSize: 180,
    maxSize: 400,
  });

  return (
    <Box position="absolute" inset="0" overflow="hidden">
      <Splitter.Root {...rootProps}>
        <Splitter.Aside borderRight="solid-25" borderColor="neutral.3">
          {/* Controls pinned above the scrollable category list so size +
              surface stay reachable no matter how far the list is scrolled. */}
          <Flex direction="column" height="100%">
            <Box flexShrink={0} borderBottom="solid-25" borderColor="neutral.3">
              <IconDisplayControls />
            </Box>
            <Box flex="1" minH="0">
              <ScrollArea height="100%">
                <CategoryRail
                  categories={categories}
                  totalCount={entries.length}
                />
              </ScrollArea>
            </Box>
          </Flex>
        </Splitter.Aside>

        <Splitter.Handle />

        <Splitter.Main>
          <ScrollArea height="100%" viewportRef={mainViewportRef}>
            <IconBrowse
              entries={entries}
              loading={metadata === null}
              scrollToTop={scrollMainToTop}
            />
          </ScrollArea>
        </Splitter.Main>
      </Splitter.Root>

      <IconDetailDialog entries={entries} metadata={metadata} />
    </Box>
  );
};
