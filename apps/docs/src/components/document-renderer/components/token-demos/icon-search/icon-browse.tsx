import {
  Box,
  Flex,
  Text,
  TextInput,
  SimpleGrid,
  useCopyToClipboard,
  Tooltip,
  MakeElementFocusable,
  IconButton,
  LoadingSpinner,
  toast,
} from "@commercetools/nimbus";
import { memo, useCallback, useMemo, useState } from "react";
import Fuse from "fuse.js";

import * as icons from "@commercetools/nimbus-icons";
import { ContentCopy } from "@commercetools/nimbus-icons";

import {
  ALL_CATEGORIES,
  ALL_ICON_NAMES,
  MAX_BROWSE,
  MAX_RESULTS,
  slugifyCategory,
  type IconEntry,
} from "./use-icon-data";

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
  onOpen,
}: {
  iconId: string;
  onCopy: (iconId: string) => void;
  onOpen: (iconId: string) => void;
}) {
  const [active, setActive] = useState(false);
  const Component = icons[iconId as keyof typeof icons];

  // The grid cell owns hover state, the border, and the negative margins that
  // collapse adjacent borders. Hover is tracked here (not on the inner trigger)
  // so moving the pointer onto the copy button — a sibling that overlaps the
  // cell — doesn't toggle `active` and flicker the button.
  return (
    <Box
      position="relative"
      border="solid-25"
      borderColor="neutral.5"
      ml="-1px"
      mb="-1px"
      aspectRatio={1}
      cursor="pointer"
      _hover={{ bg: "neutral.2" }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* Tooltip trigger = the icon surface only. The copy button is kept OUT
          of the trigger subtree: a focusable descendant makes React Aria
          anchor the tooltip to the button (not the cell) on its warm-open
          path, so the tooltip would jump to the button's top-right corner. */}
      <Tooltip.Root>
        <MakeElementFocusable>
          <Flex
            position="absolute"
            inset="0"
            alignItems="center"
            justifyContent="center"
            onClick={() => onOpen(iconId)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
          >
            <Text textStyle="3xl" color="neutral.12">
              <Component />
            </Text>
          </Flex>
        </MakeElementFocusable>
        <Tooltip.Content>{iconId}</Tooltip.Content>
      </Tooltip.Root>

      {active && (
        <Box position="absolute" top="50" right="50">
          <IconButton
            aria-label={`Copy import for ${iconId}`}
            size="xs"
            variant="ghost"
            onClick={() => onCopy(iconId)}
          >
            <ContentCopy />
          </IconButton>
        </Box>
      )}
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
}: {
  entries: IconEntry[];
  categorySlug: string;
  onSelectIcon: (iconId: string) => void;
  /**
   * True until the icon metadata chunk resolves. Until then every entry has
   * `popularity: 0`, so the empty-query browse would render the first
   * `MAX_BROWSE` icons in export order and then visibly re-sort to the
   * most-popular set once metadata lands. We render a spinner instead to avoid
   * that flash.
   */
  loading: boolean;
}) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [q, setQ] = useState<string>("");

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

  const results = useMemo<string[]>(() => {
    if (!q.trim()) {
      return [...scoped]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, MAX_BROWSE)
        .map((e) => e.name);
    }
    return fuse
      .search(q)
      .slice(0, MAX_RESULTS)
      .map((r) => r.item.name);
  }, [q, scoped, fuse]);

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
      <Box px="400" pb="400">
        {loading ? (
          <Flex justify="center" py="800">
            <LoadingSpinner />
          </Flex>
        ) : results.length === 0 ? (
          <Text color="neutral.11">No icons match “{q}”.</Text>
        ) : (
          <SimpleGrid columns={[4, 5, 5, 6, 8]}>
            {results.map((iconId) => (
              <IconTile
                key={iconId}
                iconId={iconId}
                onCopy={onCopyRequest}
                onOpen={onSelectIcon}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};
