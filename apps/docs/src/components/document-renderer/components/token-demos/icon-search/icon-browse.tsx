import {
  Box,
  Flex,
  Text,
  SearchInput,
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
  type CSSProperties,
} from "react";
import Fuse from "fuse.js";
import { useAtomValue } from "jotai";

import { semanticEnabledAtom } from "@/atoms/semantic-search";
import { useSemanticSearch } from "@/semantic-search/use-semantic-search";

import * as icons from "@commercetools/nimbus-icons";
import { ContentCopy } from "@commercetools/nimbus-icons";

import {
  ALL_CATEGORIES,
  ALL_ICON_NAMES,
  slugifyCategory,
  type IconEntry,
} from "./use-icon-data";
import { TagBar } from "./tag-bar";
import {
  SURFACE_PAD,
  SURFACE_STYLE,
  type Surface,
} from "./icon-display-controls";

/**
 * Icons per page. Highly composite (÷ 2,3,4,5,6,8,10,12…) so a page stays full
 * across the range of auto-fill column counts the size slider produces.
 */
const PAGE_SIZE = 120;

/**
 * Max keyword chips shown in the TagBar. Each chip is a React Aria collection
 * item (roving focus + selection), so an uncapped list (the "all" set has many
 * hundreds of distinct keywords) makes every filter click a multi-hundred-item
 * synchronous re-render that blocks the page. Cap to the most frequent few; the
 * bar scrolls, so this is still plenty to browse.
 */
const MAX_TAG_FACETS = 40;

/**
 * Extra width (px) added to the icon size to get a card's minimum column width.
 * The name label lives under the glyph, so a card needs room beyond the glyph
 * itself; this keeps the label legible at small icon sizes and lets bigger
 * icons claim proportionally wider columns (fewer per row) as the slider moves.
 */
const CARD_LABEL_ROOM = 72;

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
  surface,
}: {
  iconId: string;
  onCopy: (iconId: string) => void;
  surface: Surface;
}) {
  const [active, setActive] = useState(false);
  const Component = icons[iconId as keyof typeof icons];
  const surfaceStyle = SURFACE_STYLE[surface];
  const hasSurface = surface !== "none";

  // The card IS the focusable React Aria GridListItem: arrow keys move between
  // cards, Enter/click fires the GridList's `onAction` (opens the detail). The
  // full export name is always readable as the label below the glyph, and the
  // native `title` surfaces it in full on hover when the label is truncated (no
  // React Aria Tooltip — those can't wrap a collection item, and a focusable
  // child inside one re-triggers the warm-open anchoring bug). Borderless with
  // a soft rounded hover tint — a gallery card, not a spreadsheet cell. The copy
  // button mounts lazily on hover; it's a child of the card, so hovering it
  // keeps the card hovered (no flicker).
  return (
    <Box
      asChild
      position="relative"
      borderRadius="300"
      cursor="pointer"
      outline="none"
      title={iconId}
      // With a surface active, the chip behind the glyph is neutral.3 — so the
      // hover tint drops to neutral.2 to stay one step lighter and keep the chip
      // legible. Bare glyphs keep the original neutral.3 hover.
      _hover={{ bg: hasSurface ? "neutral.2" : "neutral.3" }}
      css={{ "&[data-focus-visible]": { layerStyle: "focusRing" } }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <GridListItem id={iconId} textValue={iconId}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="200"
          px="200"
          py="400"
          width="full"
          minW="0"
        >
          {/* Icons are 1em SVGs, so font-size drives their box. The size lives
              in the --icon-preview-size custom property (set on the grid
              container, default 48px = the "1200" token) so every glyph resizes
              via CSS when the slider moves — no per-card re-render. The size +
              color sit on this centering flex (not a <Text>) so no line-height
              inflates the box and the glyph stays dead-centered above its
              label. The flex is ALWAYS a fixed square of glyph + SURFACE_PAD (a
              constant, even for "none") so toggling the surface only paints a
              fill/radius inside this reserved box — the card and glyph never
              resize (no layout shift). Fill/radius mirror the detail dialog's
              SIZE_SURFACES treatment. */}
          <Flex
            align="center"
            justify="center"
            color="neutral.12"
            bg={surfaceStyle.bg}
            borderRadius={surfaceStyle.radius}
            css={{
              fontSize: "var(--icon-preview-size, 48px)",
              boxSize: `calc(var(--icon-preview-size, 48px) + ${
                SURFACE_PAD * 2
              }px)`,
            }}
          >
            <Component />
          </Flex>
          {/* The export name — what you actually import — shown verbatim and
              truncated to one line so every card stays the same height. */}
          <Text
            textStyle="xs"
            color="neutral.10"
            width="full"
            maxWidth="full"
            textAlign="center"
            truncate
          >
            {iconId}
          </Text>
        </Flex>

        {active && (
          <Box position="absolute" top="100" right="100">
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
  iconSize,
  surface,
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
  /**
   * Rendered size (px) of the previewed glyphs, owned by `IconSearch` and driven
   * by the sidebar size slider. Applied as the `--icon-preview-size` custom
   * property on the grid container so all tiles resize together via CSS — the
   * memoized tiles never re-render — and the column count reflows (auto-fill) as
   * tiles grow/shrink.
   */
  iconSize: number;
  /** The optional shape drawn behind each glyph, from the sidebar selector. */
  surface: Surface;
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

  // The active keyword facet from the TagBar, or null. Refines the current
  // (category + search) result set to icons carrying this exact tag.
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // --- Semantic search -------------------------------------------------------
  // When the global "Semantic search (beta)" toggle is on (the same switch the
  // nav-bar search uses), rank icons by embedding similarity so a conceptual
  // query ("delete", "shopping", "happy") finds icons whose *meaning* matches,
  // not just their spelling. When it's off, still warming up, or errored, the
  // Fuse index below takes over — a silent, seamless fallback (no status UI).
  const semanticEnabled = useAtomValue(semanticEnabledAtom);

  // Only build the (heavy, ~2,100-icon) semantic index once the user actually
  // searches — visitors who just browse never pay to index it. Latches true on
  // the first non-empty query and never resets, so clearing the box doesn't tear
  // the worker down and force a re-index.
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    if (deferredQ.trim()) setHasSearched(true);
  }, [deferredQ]);

  // The semantic corpus is EVERY icon (not the category-scoped subset) so the
  // index and its cache key stay stable as you switch categories — category
  // filtering is applied to the results afterward. Built only once the metadata
  // (tags + categories) has loaded, so we don't embed a name-only corpus and
  // then re-embed when the richer text arrives. Each item is an EmbeddableDoc.
  const iconDocs = useMemo(
    () =>
      loading
        ? []
        : entries.map((e) => ({
            id: e.name,
            title: e.name,
            tags: [...e.tags, ...e.categories],
          })),
    [entries, loading]
  );

  // Shares the nav search's embedding engine; the "icons" namespace keeps this
  // index in its own IndexedDB database so it and the docs index don't evict
  // each other.
  const semantic = useSemanticSearch(
    semanticEnabled && hasSearched,
    iconDocs,
    deferredQ,
    "icons"
  );

  // Minimum card column width: glyph, the name-label room, and the surface
  // chip's reserved padding (both sides) — the padding is always included, the
  // same in every surface state, so switching surfaces never reflows the grid.
  // `auto-fill` packs as many of these as fit, then `1fr` stretches them to fill
  // the row flush to both edges (no floating, center-detached block).
  const cardWidth = iconSize + CARD_LABEL_ROOM + SURFACE_PAD * 2;

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

  // Name -> entry lookup, so the ranked result names (from Fuse / browse sort)
  // can be mapped back to their tags for facet building and tag filtering.
  const entryByName = useMemo(() => {
    const map = new Map<string, IconEntry>();
    for (const e of entries) map.set(e.name, e);
    return map;
  }, [entries]);

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

  // Strict, name-only matcher for the "lexical rescue" in semantic mode: exact
  // or prefix name typing (e.g. "delete" → DeleteForever) should always surface
  // the obvious icon first, even when the embedding model ranks a synonym above
  // it. Mirrors the nav search's nameFuse (use-search.ts).
  const nameFuse = useMemo(
    () =>
      new Fuse(scoped, {
        isCaseSensitive: false,
        ignoreLocation: true,
        threshold: 0.3,
        minMatchCharLength: 2,
        keys: [{ name: "name", weight: 1 }],
      }),
    [scoped]
  );

  // Names in the active category, used to restrict full-corpus semantic hits to
  // the current category filter after ranking.
  const scopedNames = useMemo(
    () => new Set(scoped.map((e) => e.name)),
    [scoped]
  );

  // Rank by semantic similarity only when it's on, the index is ready, and
  // there's a query; otherwise the fuzzy path below runs (silent fallback).
  const useSemantic =
    semanticEnabled &&
    semantic.status === "ready" &&
    deferredQ.trim().length > 0;

  // The full ranked result set (no cap). Browse (empty query) is
  // popularity-sorted. A query is either semantically ranked (hybrid: strict
  // name matches first, then embedding hits in similarity order, both scoped to
  // the active category and deduped by name) or, in the fallback path,
  // Fuse-ranked. Pagination then slices this into pages.
  const full = useMemo<string[]>(() => {
    if (!deferredQ.trim()) {
      return [...scoped]
        .sort((a, b) => b.popularity - a.popularity)
        .map((e) => e.name);
    }
    if (useSemantic) {
      const ordered = [
        ...nameFuse.search(deferredQ).map((r) => r.item.name),
        ...semantic.results
          .map((d) => d.id)
          .filter((name) => scopedNames.has(name)),
      ];
      return [...new Set(ordered)];
    }
    return fuse.search(deferredQ).map((r) => r.item.name);
  }, [
    deferredQ,
    scoped,
    fuse,
    nameFuse,
    useSemantic,
    semantic.results,
    scopedNames,
  ]);

  // Distinct keyword tags across the current (category + search) result set,
  // ordered by frequency. Built from `full` — i.e. *before* the tag filter —
  // so sibling tags stay visible and selectable while one is active.
  const tagFacets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const name of full) {
      const entry = entryByName.get(name);
      if (!entry) continue;
      for (const tag of entry.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TAG_FACETS)
      .map(([tag]) => tag);
  }, [full, entryByName]);

  // The TagBar highlight tracks `selectedTag` immediately (snappy click), but
  // the expensive grid re-filter reads a deferred copy so a click never blocks.
  const deferredTag = useDeferredValue(selectedTag);

  // Apply the active keyword facet (if any) on top of the ranked result set.
  const filtered = useMemo(() => {
    if (!deferredTag) return full;
    return full.filter((name) =>
      entryByName.get(name)?.tags.includes(deferredTag)
    );
  }, [full, deferredTag, entryByName]);

  // 1-based current page. Reset to the first page whenever the result set
  // changes (new query or category) so you're never stranded on an empty page.
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [deferredQ, categorySlug, selectedTag]);

  // A stale keyword can't survive a new result set — clear it whenever the
  // category or search changes.
  useEffect(() => {
    setSelectedTag(null);
  }, [deferredQ, categorySlug]);

  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
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
        {/* Just the search field now — the size + surface controls live in the
            sidebar (IconDisplayControls). */}
        <SearchInput
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

        {/* Keyword facet filter — always shown (once keywords are available),
            refining whatever the current result set is. */}
        {tagFacets.length > 0 && (
          <Box mt="300">
            <TagBar
              aria-label="Filter by keyword"
              items={tagFacets}
              selectedKey={selectedTag}
              onSelectionChange={setSelectedTag}
            />
          </Box>
        )}
      </Box>
      <Box
        px="400"
        pb="400"
        // Dim the results while a newer query is still being applied, so the
        // stale grid reads as "updating" rather than as the final result.
        opacity={isStale ? 0.6 : 1}
        transition="opacity 120ms ease"
        // The size slider writes both custom properties here; they cascade to
        // the grid (minimum card column width) and every card (glyph font-size).
        style={
          {
            "--icon-preview-size": `${iconSize}px`,
            "--card-w": `${cardWidth}px`,
          } as CSSProperties
        }
      >
        {loading ? (
          <Flex justify="center" py="800">
            <LoadingSpinner />
          </Flex>
        ) : filtered.length === 0 ? (
          <Text color="neutral.11">No icons match your current filters.</Text>
        ) : (
          // A Box (asChild) supplies `display:grid`. Columns auto-fill at the
          // --card-w minimum then stretch (`1fr`) to fill the row, so the block
          // spans the full content column flush to both edges (no detached,
          // centered island) and reflows as cards grow/shrink with the slider.
          // GridList reads that geometry for 2D arrow-key navigation and fires
          // `onAction` (click/Enter) with the focused icon's id.
          <Box
            asChild
            display="grid"
            gap="200"
            css={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(var(--card-w, 120px), 1fr))",
            }}
          >
            <GridList
              aria-label="Icons"
              layout="grid"
              selectionMode="none"
              onAction={(key) => onSelectIcon(String(key))}
            >
              {pageItems.map((iconId) => (
                <IconTile
                  key={iconId}
                  iconId={iconId}
                  onCopy={onCopyRequest}
                  surface={surface}
                />
              ))}
            </GridList>
          </Box>
        )}
      </Box>

      {/* Sticky paginator, mirroring the frosted header. Hidden when everything
          fits on one page. */}
      {!loading && filtered.length > PAGE_SIZE && (
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
            totalItems={filtered.length}
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
