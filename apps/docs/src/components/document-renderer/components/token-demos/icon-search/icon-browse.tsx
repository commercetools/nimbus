import {
  Box,
  Flex,
  Text,
  TextInput,
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

import * as icons from "@commercetools/nimbus-icons";
import { ContentCopy } from "@commercetools/nimbus-icons";

import {
  ALL_CATEGORIES,
  ALL_ICON_NAMES,
  slugifyCategory,
  type IconEntry,
} from "./use-icon-data";

/**
 * Icons per page. Highly composite (÷ 2,3,4,5,6,8,10,12…) so a page stays full
 * across the range of auto-fill column counts the size slider produces.
 */
const PAGE_SIZE = 120;

/** Icon-size slider bounds (px). Default 48 = the fontSize "1200" token. */
const ICON_SIZE_MIN = 24;
const ICON_SIZE_MAX = 96;
const ICON_SIZE_STEP = 8;
const ICON_SIZE_DEFAULT = 48;
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
}: {
  iconId: string;
  onCopy: (iconId: string) => void;
}) {
  const [active, setActive] = useState(false);
  const Component = icons[iconId as keyof typeof icons];

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
      _hover={{ bg: "neutral.3" }}
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
              label. */}
          <Flex
            align="center"
            justify="center"
            color="neutral.12"
            css={{
              fontSize: "var(--icon-preview-size, 48px)",
              height: "var(--icon-preview-size, 48px)",
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

  // Rendered size (px) of the icon glyphs, driven by the header slider. Applied
  // as a CSS custom property on the grid container so all tiles resize together
  // via CSS — the memoized tiles never re-render — and the column count reflows
  // (auto-fill) as tiles grow/shrink. Default 48 = the fontSize "1200" token.
  const [iconSize, setIconSize] = useState(ICON_SIZE_DEFAULT);
  // Minimum card column width: glyph plus room for the name label. `auto-fill`
  // packs as many of these as fit, then `1fr` stretches them to fill the row
  // flush to both edges (no floating, center-detached block).
  const cardWidth = iconSize + CARD_LABEL_ROOM;

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
        <Flex align="center" gap="400" wrap="wrap">
          <Box flex="1 1 240px" minW="0">
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
          {/* Icon-size control: a plain range input, lightly styled (accent
              color + width). Resizes every previewed icon live via CSS. */}
          <Flex align="center" gap="300" flexShrink="0">
            <Text textStyle="sm" color="neutral.11" whiteSpace="nowrap">
              Size
            </Text>
            <Box
              asChild
              css={{
                width: "140px",
                cursor: "pointer",
                accentColor: "{colors.primary.9}",
              }}
            >
              <input
                type="range"
                min={ICON_SIZE_MIN}
                max={ICON_SIZE_MAX}
                step={ICON_SIZE_STEP}
                value={iconSize}
                aria-label="Icon preview size"
                onChange={(e) => setIconSize(Number(e.target.value))}
              />
            </Box>
            <Text
              textStyle="sm"
              color="neutral.10"
              textAlign="right"
              minW="1200"
              whiteSpace="nowrap"
              css={{ fontVariantNumeric: "tabular-nums" }}
            >
              {iconSize}px
            </Text>
          </Flex>
        </Flex>
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
        ) : full.length === 0 ? (
          <Text color="neutral.11">No icons match “{q}”.</Text>
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
                <IconTile key={iconId} iconId={iconId} onCopy={onCopyRequest} />
              ))}
            </GridList>
          </Box>
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
