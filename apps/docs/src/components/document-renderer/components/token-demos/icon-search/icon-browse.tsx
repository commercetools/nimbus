import {
  Box,
  Flex,
  Text,
  TextInput,
  SimpleGrid,
  Pagination,
  useCopyToClipboard,
  IconButton,
  LoadingSpinner,
  toast,
} from "@commercetools/nimbus";
import { GridList, GridListItem } from "react-aria-components";
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import Fuse from "fuse.js";

import * as icons from "@commercetools/nimbus-icons";
import { ContentCopy } from "@commercetools/nimbus-icons";

import {
  ALL_CATEGORIES,
  ALL_ICON_NAMES,
  slugifyCategory,
  type IconEntry,
} from "./use-icon-data";

/** Icons per page. Divisible by every column count (4/5/6/8) so rows stay full. */
const PAGE_SIZE = 120;

/**
 * One icon cell. Memoized so typing in the search box (which re-renders the
 * parent and rebuilds the results array) doesn't re-render every tile — only
 * tiles whose `iconId`/`onCopy` actually change. The copy button is mounted
 * lazily, only while the tile is hovered or focused, so the idle grid isn't
 * carrying a few hundred always-mounted buttons.
 */
const IconTile = memo(function IconTile({
  iconId,
  onCopy,
}: {
  iconId: string;
  onCopy: (iconId: string) => void;
}) {
  const [active, setActive] = useState(false);
  const Component = icons[iconId as keyof typeof icons];

  // The cell IS the focusable React Aria GridListItem: arrow keys move between
  // cells, Enter/click fires the GridList's `onAction` (opens the detail). The
  // icon name is shown via the native `title` (no React Aria Tooltip — those
  // can't wrap a collection item, and a focusable child inside one re-triggers
  // the warm-open anchoring bug). The copy button mounts lazily on hover; it's
  // a child of the cell, so hovering it keeps the cell hovered (no flicker).
  return (
    <Box
      asChild
      position="relative"
      border="solid-25"
      borderColor="neutral.5"
      ml="-1px"
      mb="-1px"
      aspectRatio={1}
      cursor="pointer"
      outline="none"
      _hover={{ bg: "neutral.2" }}
      css={{ "&[data-focus-visible]": { layerStyle: "focusRing" } }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <GridListItem id={iconId} textValue={iconId}>
        <Flex
          position="absolute"
          inset="0"
          alignItems="center"
          justifyContent="center"
          title={iconId}
        >
          {/* Icons are 1em SVGs, so font-size drives their box: the "1200"
              token = 48px. */}
          <Text fontSize="1200" color="neutral.12">
            <Component />
          </Text>
        </Flex>

        {active && (
          <Box position="absolute" top="50" right="50">
            <IconButton
              aria-label={`Copy import for ${iconId}`}
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(iconId);
              }}
            >
              <ContentCopy />
            </IconButton>
          </Box>
        )}
      </GridListItem>
    </Box>
  );
});

/**
 * The search + grid surface, rendered inside the Splitter's main pane. It is
 * the same content for the `/icons` root and every `/icons/category/:slug`
 * page — the active category is driven entirely by `categorySlug` (from the
 * URL). Clicking an icon navigates to its detail page (which keeps the rail and
 * splitter mounted); a hover-only button still copies the import inline.
 */
export const IconBrowse = ({
  entries,
  categorySlug,
  onSelectIcon,
  loading,
  scrollToTop,
}: {
  entries: IconEntry[];
  categorySlug: string;
  onSelectIcon: (iconId: string) => void;
  /**
   * True until the icon metadata chunk resolves. Until then every entry has
   * `popularity: 0`, so the empty-query browse would render the first page in
   * export order and then visibly re-sort to the most-popular set once metadata
   * lands. We render a spinner instead to avoid that flash.
   */
  loading: boolean;
  /**
   * Scrolls the surrounding scroll pane back to the top. Called on a pagination
   * page change so the new page starts at its first icons instead of leaving
   * you parked next to the (bottom) paginator.
   */
  scrollToTop?: () => void;
}) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [q, setQ] = useState<string>("");
  // The input updates `q` on every keystroke (so typing stays snappy), but the
  // expensive Fuse search + grid render read this deferred copy. React keeps the
  // previous results painted and does the heavy work at a lower, interruptible
  // priority, so the field never stutters mid-type. Better than a fixed debounce:
  // no artificial latency, and fast typers still get one search at the end.
  const deferredQ = useDeferredValue(q);
  // True while the grid is still reflecting an older query than what's typed.
  const isStale = q !== deferredQ;

  // Icons in the active category (or all of them). Compared by slug so a
  // category whose name contains spaces ("common actions") still matches.
  const scoped = useMemo(
    () =>
      categorySlug === ALL_CATEGORIES
        ? entries
        : entries.filter((e) =>
            e.categories.some((c) => slugifyCategory(c) === categorySlug)
          ),
    [entries, categorySlug]
  );

  const fuse = useMemo(
    () =>
      new Fuse(scoped, {
        isCaseSensitive: false,
        ignoreLocation: true,
        ignoreFieldNorm: true,
        shouldSort: true,
        minMatchCharLength: 1,
        threshold: 0.3,
        keys: [
          { name: "name", weight: 4 },
          { name: "tags", weight: 2 },
          { name: "categories", weight: 1 },
        ],
      }),
    [scoped]
  );

  // The full ranked result set (no cap) — browse is popularity-sorted, a query
  // is Fuse-ranked. Pagination then slices this into pages.
  const full = useMemo<string[]>(() => {
    if (!deferredQ.trim()) {
      return [...scoped]
        .sort((a, b) => b.popularity - a.popularity)
        .map((e) => e.name);
    }
    return fuse.search(deferredQ).map((r) => r.item.name);
  }, [deferredQ, scoped, fuse]);

  // 1-based current page. Reset to the first page whenever the result set
  // changes (new query or category) so you're never stranded on an empty page.
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [deferredQ, categorySlug]);

  const pageItems = useMemo(
    () => full.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [full, page]
  );

  /** Copies the import statement for an icon and confirms via a toast. */
  const onCopyRequest = useCallback(
    (iconId: string) => {
      copyToClipboard(
        `import { ${iconId} } from '@commercetools/nimbus-icons';`
      );
      toast.success({
        title: "Copied import to clipboard",
        description: iconId,
      });
    },
    [copyToClipboard]
  );

  return (
    <Box minW="0">
      {/* Sticky search header. The translucent background + backdrop blur let
          the grid stay visible-but-frosted as it scrolls underneath. */}
      <Box
        position="sticky"
        top="0"
        zIndex={1}
        px="400"
        py="400"
        bg="bg/75"
        backdropFilter="blur(8px)"
      >
        <TextInput
          width="full"
          aria-label="Search icons"
          placeholder={`Search through ${
            categorySlug === ALL_CATEGORIES
              ? ALL_ICON_NAMES.length
              : scoped.length
          } icons ...`}
          value={q}
          onChange={(value) => setQ(value)}
        />
      </Box>
      <Box
        px="400"
        pb="400"
        // Dim the results while a newer query is still being applied, so the
        // stale grid reads as "updating" rather than as the final result.
        opacity={isStale ? 0.6 : 1}
        transition="opacity 120ms ease"
      >
        {loading ? (
          <Flex justify="center" py="800">
            <LoadingSpinner />
          </Flex>
        ) : full.length === 0 ? (
          <Text color="neutral.11">No icons match “{q}”.</Text>
        ) : (
          // SimpleGrid (asChild) supplies the responsive `display:grid` +
          // columns; GridList reads that geometry for 2D arrow-key navigation
          // and fires `onAction` (click or Enter) with the focused icon's id.
          <SimpleGrid asChild columns={[4, 5, 5, 6, 8]}>
            <GridList
              aria-label="Icons"
              layout="grid"
              selectionMode="none"
              onAction={(key) => onSelectIcon(String(key))}
            >
              {pageItems.map((iconId) => (
                <IconTile key={iconId} iconId={iconId} onCopy={onCopyRequest} />
              ))}
            </GridList>
          </SimpleGrid>
        )}
      </Box>

      {/* Sticky paginator, mirroring the frosted header. Hidden when everything
          fits on one page. */}
      {!loading && full.length > PAGE_SIZE && (
        <Flex
          position="sticky"
          bottom="0"
          zIndex={1}
          justify="center"
          px="400"
          py="300"
          bg="bg/75"
          backdropFilter="blur(8px)"
        >
          <Pagination
            totalItems={full.length}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onPageChange={(next) => {
              setPage(next);
              scrollToTop?.();
            }}
            enablePageSizeSelector={false}
            aria-label="Icon pages"
          />
        </Flex>
      )}
    </Box>
  );
};
