import {
  Box,
  ScrollArea,
  Splitter,
  useResponsiveSplitterSizes,
} from "@commercetools/nimbus";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { ALL_CATEGORIES, useIconData } from "./use-icon-data";
import { CategoryRail } from "./category-rail";
import { IconBrowse } from "./icon-browse";
import { IconDetailDialog } from "./icon-detail";

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
          <ScrollArea height="100%">
            <CategoryRail
              categories={categories}
              totalCount={entries.length}
              activeSlug={categorySlug}
            />
          </ScrollArea>
        </Splitter.Aside>

        <Splitter.Handle />

        <Splitter.Main>
          <ScrollArea height="100%">
            <IconBrowse
              entries={entries}
              categorySlug={categorySlug}
              onSelectIcon={setSelectedIcon}
              loading={metadata === null}
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
