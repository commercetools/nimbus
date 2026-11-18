import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Box,
  Button,
  Drawer,
  Flex,
  Icon,
  ScrollArea,
} from "@commercetools/nimbus";
import { FilterList } from "@commercetools/nimbus-icons";

import { AppFrame } from "@/components/app-frame";
import { BreadcrumbNav } from "@/components/navigation/breadcrumb";
import { DocMetadata } from "@/components/doc-metadata";
import { useActiveDoc } from "@/hooks/useActiveDoc";
import { useManifest } from "@/contexts/manifest-context";

import { useIconData } from "./use-icon-data";
import { useIconSearch } from "./use-icon-search";
import { useIconRouteState } from "./use-icon-route-state";
import { CategoryRail } from "./category-rail";
import { IconBrowse } from "./icon-browse";
import { IconDetailDialog } from "./icon-detail";

/**
 * The Icons page (`<IconSearch />` in the Icons MDX). It uses the
 * `no-sidebar` layout, which leaves the whole body below the top bar to the
 * page, and draws the same frame as the other pages itself:
 *
 *   - Left column: the category list. The Icons page has no site menu, so
 *     the list takes its place. Below `lg` it moves into a drawer, like the
 *     site menu does on other pages.
 *   - Content column: breadcrumb, then the shared page header (title,
 *     description, illustration), then the search and the icon grid.
 *
 * All browsing state is in the URL (see `use-icon-route-state`):
 *
 *   /icons                                    -> all icons
 *   /icons?category=:slug&tag=:t&search=:q    -> filtered (all must match)
 *   /icons?size=:px&surface=:shape            -> display of the grid
 *   /icons/:name                              -> detail dialog of an icon, on
 *                                                top of the filtered grid
 *
 * The layout keys its content on the base route, so this component stays
 * mounted for every URL under `/icons`: the dialog opens and closes without
 * rebuilding the grid.
 */
export const IconSearch = () => {
  const { entries, categories, metadata } = useIconData();
  const loading = metadata === null;
  const search = useIconSearch(entries, loading);

  const { doc } = useActiveDoc();
  const { routeManifest } = useManifest();
  const meta = doc?.meta;
  const illustration = routeManifest?.routes.find(
    (route) => route.id === meta?.id
  )?.illustrations[0];

  // The scroll area of the content column, and the start of the results in
  // it. A page change scrolls back to the results, not to the page header.
  const mainViewportRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollToResults = useCallback(() => {
    const viewport = mainViewportRef.current;
    const results = resultsRef.current;
    if (!viewport || !results) return;
    const top =
      results.getBoundingClientRect().top -
      viewport.getBoundingClientRect().top +
      viewport.scrollTop;
    viewport.scrollTo({ top: Math.min(top, viewport.scrollTop) });
  }, []);

  const railProps = {
    categories,
    counts: search.categoryCounts,
    allCount: search.allCategoriesCount,
  };

  return (
    // The layout gives no height to its content, so the frame fills the body
    // below the top bar from here.
    <Box position="absolute" inset="0" display="flex">
      <AppFrame.Root>
        {/* Same column as AppFrame.LeftNav, but an `aside`: it filters the
            icons, it does not move to another page. */}
        <ScrollArea
          as="aside"
          aria-label="Icon categories"
          gridArea="nav"
          display={{ base: "none", lg: "block" }}
          borderRight="solid-25"
          borderColor="neutral.3"
          bg="bg"
          size="sm"
        >
          <Box py="400">
            <CategoryRail {...railProps} />
          </Box>
        </ScrollArea>

        <AppFrame.MainContent viewportRef={mainViewportRef}>
          <Flex align="center" gap="200" mb="600">
            <CategoryDrawer>
              {(close) => <CategoryRail {...railProps} onSelect={close} />}
            </CategoryDrawer>
            <Suspense fallback={null}>
              <BreadcrumbNav />
            </Suspense>
          </Flex>

          {meta && (
            <DocMetadata
              title={meta.title}
              description={meta.description}
              illustration={illustration}
            />
          )}

          <Box ref={resultsRef} pb="1200">
            <IconBrowse
              search={search}
              loading={loading}
              onPageChange={scrollToResults}
            />
          </Box>
        </AppFrame.MainContent>
      </AppFrame.Root>

      <IconDetailDialog entries={entries} metadata={metadata} />
    </Box>
  );
};

/**
 * The category list for narrow screens. Below `lg` the left column is hidden,
 * so a button next to the breadcrumb opens the list in a drawer, like the
 * site menu on other pages. Selecting a category closes the drawer.
 */
const CategoryDrawer = ({
  children,
}: {
  children: (close: () => void) => ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { iconName } = useIconRouteState();

  // Opening an icon closes the drawer.
  useEffect(() => {
    if (iconName) setIsOpen(false);
  }, [iconName]);

  return (
    <Box display={{ base: "block", lg: "none" }}>
      <Button size="xs" variant="outline" onPress={() => setIsOpen(true)}>
        <Icon as={FilterList} />
        Categories
      </Button>
      <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen} placement="left">
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Categories</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body>{children(() => setIsOpen(false))}</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Box>
  );
};
