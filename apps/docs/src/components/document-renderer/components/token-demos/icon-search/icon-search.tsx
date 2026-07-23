import {
  Box,
  Flex,
  ScrollArea,
  Splitter,
  useResponsiveSplitterSizes,
} from "@commercetools/nimbus";
import { useCallback, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { ALL_CATEGORIES, useIconData } from "./use-icon-data";
import { CategoryRail } from "./category-rail";
import { IconBrowse } from "./icon-browse";
import { IconDetailDialog } from "./icon-detail";
import {
  DEFAULT_SURFACE,
  ICON_SIZE_DEFAULT,
  IconDisplayControls,
  type Surface,
} from "./icon-display-controls";

/**
 * IconSearch is the entry point rendered by the Icons doc (`<IconSearch />` in
 * the MDX). Because `use-route-info` resolves any `/icons/*` path to the Icons
 * doc (longest-prefix match), this single component owns the `/icons` URL space:
 *
 *   /icons                      -> browse, no filter
 *   /icons/category/:slug       -> browse, filtered to :slug
 *
 * Individual icons don't get their own route — clicking a tile opens the icon's
 * detail in a Dialog (local state), which is plenty for a quick look without the
 * overhead of a route per icon. The Splitter shell stays mounted across
 * category navigation, so the rail never remounts.
 */
export const IconSearch = () => {
  const { pathname } = useLocation();
  const { entries, categories, metadata } = useIconData();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // Grid view controls, owned here so the sidebar controls and the grid stay in
  // sync. `iconSize` (px) drives the previewed glyph size; `surface` picks the
  // optional shape drawn behind each glyph.
  const [iconSize, setIconSize] = useState(ICON_SIZE_DEFAULT);
  const [surface, setSurface] = useState<Surface>(DEFAULT_SURFACE);

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

  // The only sub-route is the category filter; everything else is the root.
  const sub = pathname.replace(/^\/icons\/?/, "").replace(/\/+$/, "");
  const segments = sub ? sub.split("/") : [];
  const categorySlug =
    segments[0] === "category"
      ? (segments[1] ?? ALL_CATEGORIES)
      : ALL_CATEGORIES;

  return (
    <Box position="absolute" inset="0" overflow="hidden">
      <Splitter.Root {...rootProps}>
        <Splitter.Aside borderRight="solid-25" borderColor="neutral.3">
          {/* Controls pinned above the scrollable category list so size +
              surface stay reachable no matter how far the list is scrolled. */}
          <Flex direction="column" height="100%">
            <Box flexShrink={0} borderBottom="solid-25" borderColor="neutral.3">
              <IconDisplayControls
                iconSize={iconSize}
                onIconSizeChange={setIconSize}
                surface={surface}
                onSurfaceChange={setSurface}
              />
            </Box>
            <Box flex="1" minH="0">
              <ScrollArea height="100%">
                <CategoryRail
                  categories={categories}
                  totalCount={entries.length}
                  activeSlug={categorySlug}
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
              categorySlug={categorySlug}
              onSelectIcon={setSelectedIcon}
              loading={metadata === null}
              scrollToTop={scrollMainToTop}
              iconSize={iconSize}
              surface={surface}
            />
          </ScrollArea>
        </Splitter.Main>
      </Splitter.Root>

      <IconDetailDialog
        name={selectedIcon}
        metadata={metadata}
        onClose={() => setSelectedIcon(null)}
      />
    </Box>
  );
};
