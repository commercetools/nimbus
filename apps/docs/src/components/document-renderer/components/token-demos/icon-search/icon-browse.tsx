import {
  Box,
  Button,
  Flex,
  IconButton,
  LoadingSpinner,
  Pagination,
  SearchInput,
  Stack,
  TagGroup,
  Text,
  toast,
  useCopyToClipboard,
} from "@commercetools/nimbus";
import { GridList, GridListItem } from "react-aria-components";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import * as icons from "@commercetools/nimbus-icons";
import { ContentCopy, SearchOff } from "@commercetools/nimbus-icons";

import { ALL_CATEGORIES, ALL_ICON_NAMES, titleCase } from "./use-icon-data";
import {
  IconDisplayControls,
  SURFACE_PAD,
  SURFACE_STYLE,
  type Surface,
} from "./icon-display-controls";
import { useIconRouteState } from "./use-icon-route-state";
import type { IconSearchState } from "./use-icon-search";
import { toWords, type IconMatch } from "./search-icons";

/**
 * Icons per page. Divisible by 2, 3, 4, 5, 6, 8, 10 and 12, so the last row of
 * a page is full for most column counts the size slider produces.
 */
const PAGE_SIZE = 120;

/**
 * Width (px) added to the icon size to get the smallest column width. The
 * name is shown below the glyph and needs room at small icon sizes.
 */
const CARD_LABEL_ROOM = 72;

const numberFormat = new Intl.NumberFormat("en-US");

/**
 * One icon card. Memoized, so typing in the search field does not render
 * every card again. The copy button is only mounted while the card is
 * hovered, so the grid does not hold a few hundred buttons.
 */
const IconTile = memo(function IconTile({
  iconId,
  matchedTag,
  showMatchLine,
  onCopy,
  surface,
}: {
  iconId: string;
  /** The keyword that made the icon match, shown below the name. */
  matchedTag: string | null;
  /**
   * Keeps a second line on every card while a search is active, so all cards
   * have the same height, also those that match by name.
   */
  showMatchLine: boolean;
  onCopy: (iconId: string) => void;
  surface: Surface;
}) {
  const [active, setActive] = useState(false);
  const Component = icons[iconId as keyof typeof icons];
  const surfaceStyle = SURFACE_STYLE[surface];
  const hasSurface = surface !== "none";

  // The card is the focusable GridListItem: arrow keys move between cards,
  // Enter or a click opens the detail dialog (the GridList's `onAction`). The
  // native `title` shows the full name when the label is cut off.
  return (
    <Box
      asChild
      position="relative"
      borderRadius="300"
      cursor="pointer"
      outline="none"
      title={matchedTag ? `${iconId} (keyword: ${matchedTag})` : iconId}
      // With a surface, the shape behind the glyph is neutral.3, so the hover
      // color is one step lighter to keep the shape visible.
      _hover={{ bg: hasSurface ? "neutral.2" : "neutral.3" }}
      css={{ "&[data-focus-visible]": { layerStyle: "focusRing" } }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <GridListItem
        id={iconId}
        textValue={matchedTag ? `${iconId}, keyword ${matchedTag}` : iconId}
      >
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
          {/* Icons are 1em SVGs, so the font size sets their size. It comes
              from --icon-preview-size on the grid, so the slider resizes every
              glyph through CSS. The box is always glyph + SURFACE_PAD, also
              without a surface, so switching the surface never moves a card. */}
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
          <Stack gap="0" width="full" minW="0" align="center">
            {/* The export name, which is what you import. */}
            <Text
              textStyle="xs"
              color="neutral.11"
              width="full"
              textAlign="center"
              truncate
            >
              {iconId}
            </Text>
            {showMatchLine && (
              <Text
                textStyle="xs"
                color="neutral.10"
                width="full"
                textAlign="center"
                truncate
                aria-hidden={matchedTag ? undefined : true}
              >
                {matchedTag ? `“${matchedTag}”` : " "}
              </Text>
            )}
          </Stack>
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

/** One active filter, shown as a removable tag above the grid. */
type ActiveFilter = { id: string; label: string; remove: () => void };

/**
 * The search and results of the Icons page, in the content column below the
 * page header: a sticky search row with the display controls, keywords that
 * narrow the results, a result line with the active filters, the grid, and
 * the pages.
 */
export const IconBrowse = ({
  search,
  loading,
  onPageChange,
}: {
  search: IconSearchState;
  /**
   * True until the icon metadata has loaded. Until then the icons have no
   * popularity, so the grid would show them in export order and then sort
   * again. A spinner is shown instead.
   */
  loading: boolean;
  /** Called after the page changes, to scroll the results into view. */
  onPageChange?: () => void;
}) => {
  const {
    category,
    tag,
    size,
    surface,
    setTag,
    openIcon,
    goToCategory,
    clearFilters,
  } = useIconRouteState();
  const { query, setQuery, isStale, appliedQuery, results, keywords, isFuzzy } =
    search;

  const [, copyToClipboard] = useCopyToClipboard();
  // A stable callback, so the memoized cards do not render again when
  // `useCopyToClipboard` returns a new function.
  const copyRef = useRef(copyToClipboard);
  copyRef.current = copyToClipboard;

  const onCopyRequest = useCallback((iconId: string) => {
    copyRef.current(`import { ${iconId} } from '@commercetools/nimbus-icons';`);
    toast.success({
      title: "Copied import to clipboard",
      description: iconId,
    });
  }, []);

  // Back to the first page when the results change.
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [appliedQuery, category, tag]);

  const pageItems = useMemo<IconMatch[]>(
    () => results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [results, page]
  );

  const hasQuery = appliedQuery.trim() !== "";

  // The keyword is only worth showing when it differs from the query: for
  // "trash" every keyword match is "trash", but for "shop" the card shows
  // "shopping", and for "arrow left" it shows "left".
  const queryPhrase = toWords(appliedQuery).join(" ");
  const shownTag = useCallback(
    (match: IconMatch) =>
      match.matchedTag && match.matchedTag.toLowerCase() !== queryPhrase
        ? match.matchedTag
        : null,
    [queryPhrase]
  );
  const showMatchLine = hasQuery && results.some((match) => shownTag(match));

  const activeFilters: ActiveFilter[] = [
    ...(hasQuery
      ? [
          {
            id: "search",
            label: `Search: ${appliedQuery.trim()}`,
            remove: () => setQuery(""),
          },
        ]
      : []),
    ...(category !== ALL_CATEGORIES
      ? [
          {
            id: "category",
            label: `Category: ${titleCase(category.replace(/-/g, " "))}`,
            remove: () => goToCategory(ALL_CATEGORIES),
          },
        ]
      : []),
    ...(tag
      ? [{ id: "tag", label: `Keyword: ${tag}`, remove: () => setTag(null) }]
      : []),
  ];

  const clearAll = () => {
    setQuery("");
    clearFilters();
  };

  // Both custom properties come from the size. The grid reads the column
  // width and every card reads the glyph size.
  const cardWidth = size + CARD_LABEL_ROOM + SURFACE_PAD * 2;

  // While the slider moves, the properties are set on the element directly.
  // React does not render the grid for these steps; it only writes the style
  // again when the size in the URL changes after the slider is released.
  const previewRef = useRef<HTMLDivElement>(null);
  const setPreviewSize = useCallback((px: number) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.setProperty("--icon-preview-size", `${px}px`);
    el.style.setProperty(
      "--card-w",
      `${px + CARD_LABEL_ROOM + SURFACE_PAD * 2}px`
    );
  }, []);

  return (
    <Box minW="0">
      {/* Search row. Sticky at the top of the scroll area, like the page tabs
          on other pages, so the search stays in reach while scrolling. */}
      <Flex
        position="sticky"
        top="0"
        zIndex={2}
        bg="bg"
        py="300"
        gap="400"
        align="center"
        wrap="wrap"
        // The divider reaches the edges of the scroll area while the row keeps
        // its width. The shadow spreads the line sideways and the clip keeps
        // it one line high. A shadow adds no scrollable overflow, so there is
        // no horizontal scrollbar.
        _after={{
          content: '""',
          position: "absolute",
          insetInline: "0",
          bottom: "0",
          height: "1px",
          bg: "neutral.3",
          boxShadow: "0 0 0 100vmax {colors.neutral.3}",
          clipPath: "inset(0 -100vmax)",
          pointerEvents: "none",
        }}
      >
        <Box flex="1" minW="240px">
          <SearchInput
            width="full"
            aria-label="Search icons"
            placeholder={`Search ${numberFormat.format(
              ALL_ICON_NAMES.length
            )} icons by name or keyword`}
            value={query}
            onChange={setQuery}
          />
        </Box>
        <IconDisplayControls onPreviewSize={setPreviewSize} />
      </Flex>

      {/* Keywords that narrow the current results. */}
      {!loading && keywords.length > 0 && (
        <Flex mt="400" gap="300" align="baseline">
          <Text
            id="icon-keywords-label"
            textStyle="sm"
            color="neutral.11"
            flexShrink={0}
          >
            Keywords
          </Text>
          <TagGroup.Root
            size="sm"
            aria-labelledby="icon-keywords-label"
            selectionMode="single"
            selectedKeys={tag ? [tag] : []}
            onSelectionChange={(keys) => {
              const next = keys === "all" ? null : [...keys][0];
              setTag(next == null ? null : String(next));
            }}
          >
            <TagGroup.TagList items={keywords}>
              {(item) => (
                <TagGroup.Tag
                  id={item.tag}
                  textValue={`${item.tag}, ${item.count} icons`}
                  cursor="pointer"
                >
                  {item.tag}
                  <Box as="span" color="neutral.10" ms="100">
                    {item.count}
                  </Box>
                </TagGroup.Tag>
              )}
            </TagGroup.TagList>
          </TagGroup.Root>
        </Flex>
      )}

      {/* Result line: how many icons, and which filters are active. */}
      {!loading && (
        <Flex mt="400" mb="200" gap="300" align="center" wrap="wrap">
          <Text textStyle="sm" fontWeight="600" aria-live="polite">
            {numberFormat.format(results.length)}{" "}
            {results.length === 1 ? "icon" : "icons"}
          </Text>
          {activeFilters.length > 0 && (
            <>
              <TagGroup.Root
                size="sm"
                aria-label="Active filters"
                onRemove={(keys) => {
                  for (const key of keys) {
                    activeFilters.find((f) => f.id === key)?.remove();
                  }
                }}
              >
                <TagGroup.TagList items={activeFilters}>
                  {(filter) => (
                    <TagGroup.Tag id={filter.id} textValue={filter.label}>
                      {filter.label}
                    </TagGroup.Tag>
                  )}
                </TagGroup.TagList>
              </TagGroup.Root>
              {activeFilters.length > 1 && (
                <Button size="2xs" variant="ghost" onPress={clearAll}>
                  Clear all
                </Button>
              )}
            </>
          )}
        </Flex>
      )}

      {!loading && isFuzzy && (
        <Text textStyle="sm" color="neutral.11" mb="200">
          No icon name or keyword matches “{appliedQuery.trim()}”. These icons
          have a similar spelling.
        </Text>
      )}

      <Box
        ref={previewRef}
        // Dim the results while a newer query is being applied.
        opacity={isStale ? 0.6 : 1}
        transition="opacity 120ms ease"
        style={
          {
            "--icon-preview-size": `${size}px`,
            "--card-w": `${cardWidth}px`,
          } as CSSProperties
        }
      >
        {loading ? (
          <Flex justify="center" py="800">
            <LoadingSpinner />
          </Flex>
        ) : results.length === 0 ? (
          // The filters are combined, so too many of them can leave nothing.
          // Offer to remove each one.
          <Flex
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            gap="400"
            py="800"
            px="400"
          >
            <Box color="neutral.8" css={{ fontSize: "48px" }}>
              <SearchOff />
            </Box>
            <Stack gap="100" maxWidth="30rem">
              <Text textStyle="lg" fontWeight="600" color="neutral.12">
                No icons match all your filters
              </Text>
              <Text textStyle="sm" color="neutral.11">
                An icon has to match the search, the category and the keyword.
                Remove a filter to see more icons.
              </Text>
            </Stack>
            <Flex gap="200" wrap="wrap" justify="center">
              {activeFilters.map((filter) => (
                <Button
                  key={filter.id}
                  size="xs"
                  variant="outline"
                  onPress={filter.remove}
                >
                  Remove {filter.label.toLowerCase()}
                </Button>
              ))}
            </Flex>
          </Flex>
        ) : (
          // Columns fill the row at the --card-w minimum and stretch to the
          // edges. GridList reads the layout for arrow-key navigation in two
          // directions and calls `onAction` with the icon id.
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
              onAction={(key) => openIcon(String(key))}
            >
              {pageItems.map((match) => (
                <IconTile
                  key={match.name}
                  iconId={match.name}
                  matchedTag={shownTag(match)}
                  showMatchLine={showMatchLine}
                  onCopy={onCopyRequest}
                  surface={surface}
                />
              ))}
            </GridList>
          </Box>
        )}
      </Box>

      {!loading && results.length > PAGE_SIZE && (
        <Flex justify="center" mt="600">
          <Pagination
            totalItems={results.length}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onPageChange={(next) => {
              setPage(next);
              onPageChange?.();
            }}
            enablePageSizeSelector={false}
            aria-label="Icon pages"
          />
        </Flex>
      )}
    </Box>
  );
};
