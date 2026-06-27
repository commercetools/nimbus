import {
  Box,
  Flex,
  Text,
  TextInput,
  Stack,
  SimpleGrid,
  useCopyToClipboard,
  Tooltip,
  MakeElementFocusable,
  toast,
} from "@commercetools/nimbus";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";

import * as icons from "@commercetools/nimbus-icons";
import type { IconMeta } from "@commercetools/nimbus-icons/meta";

/** A searchable icon: its export name plus the metadata we match against. */
interface IconEntry {
  name: string;
  tags: string[];
  categories: string[];
  popularity: number;
}

const ALL_ICON_NAMES = Object.keys(icons);

/** Sentinel for the "no category filter" state. */
const ALL_CATEGORIES = "all";
/** Most-popular-first cap for the browse (empty-query) view. */
const MAX_BROWSE = 256;
/** Cap on rendered matches for a non-empty query. */
const MAX_RESULTS = 128;

/** "common actions" -> "Common Actions" */
const titleCase = (s: string) => s.replace(/\b\w/g, (ch) => ch.toUpperCase());

/**
 * IconSearch lets users search the icon set by name *and* by meaning (synonyms /
 * categories sourced from `@commercetools/nimbus-icons/meta`), filter by
 * category, and copy the import statement for any result.
 */
export const IconSearch = () => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [q, setQ] = useState<string>("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);

  // The metadata is ~900KB, so load it lazily (a separate chunk) only when this
  // component mounts — it stays out of the main docs bundle. Until it resolves,
  // search degrades gracefully to name-only matching with no category facets.
  const [metadata, setMetadata] = useState<Record<string, IconMeta> | null>(
    null
  );
  useEffect(() => {
    let cancelled = false;
    import("@commercetools/nimbus-icons/meta").then((mod) => {
      if (!cancelled) setMetadata(mod.iconMetadata);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const entries = useMemo<IconEntry[]>(
    () =>
      ALL_ICON_NAMES.map((name) => {
        const meta = metadata?.[name];
        return {
          name,
          tags: meta?.tags ?? [],
          categories: meta?.categories ?? [],
          popularity: meta?.popularity ?? 0,
        };
      }),
    [metadata]
  );

  // Category facets (name + count), most-populated first.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      for (const cat of entry.categories) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [entries]);

  // Icons in the active category (or all of them).
  const scoped = useMemo(
    () =>
      category === ALL_CATEGORIES
        ? entries
        : entries.filter((e) => e.categories.includes(category)),
    [entries, category]
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
  const onCopyRequest = (iconId: string) => {
    copyToClipboard(`import { ${iconId} } from '@commercetools/nimbus-icons';`);
    toast.success({
      title: "Copied import to clipboard",
      description: iconId,
    });
  };

  return (
    <Flex
      mt="800"
      mb="1600"
      gap="800"
      alignItems="flex-start"
      direction={{ base: "column", md: "row" }}
    >
      {/* Category filter rail */}
      <Stack
        as="nav"
        aria-label="Filter icons by category"
        flexShrink="0"
        width={{ base: "100%", md: "3600" }}
        gap="0"
        position={{ base: "static", md: "sticky" }}
        top="800"
      >
        <Text textStyle="sm" fontWeight="600" color="neutral.11" mb="200">
          Categories
        </Text>
        <CategoryItem
          label="All"
          count={entries.length}
          active={category === ALL_CATEGORIES}
          onSelect={() => setCategory(ALL_CATEGORIES)}
        />
        {categories.map(({ name, count }) => (
          <CategoryItem
            key={name}
            label={titleCase(name)}
            count={count}
            active={category === name}
            onSelect={() => setCategory(name)}
          />
        ))}
      </Stack>

      {/* Search + results */}
      <Stack flex="1" minW="0" gap="600">
        <TextInput
          placeholder={`Search through ${
            category === ALL_CATEGORIES ? ALL_ICON_NAMES.length : scoped.length
          } icons ...`}
          value={q}
          onChange={(value) => setQ(value)}
        />
        {results.length === 0 ? (
          <Text color="neutral.11">No icons match “{q}”.</Text>
        ) : (
          <SimpleGrid columns={[4, 5, 5, 6, 8]}>
            {results.map((iconId) => {
              const Component = icons[iconId as keyof typeof icons];
              return (
                <Tooltip.Root key={iconId}>
                  <MakeElementFocusable>
                    <Flex
                      p="400"
                      border="solid-25"
                      borderColor="neutral.5"
                      ml="-1px"
                      mb="-1px"
                      aspectRatio={1}
                      cursor="pointer"
                      _hover={{ bg: "neutral.2" }}
                      onClick={() => onCopyRequest(iconId)}
                    >
                      <Text m="auto" textStyle="3xl" color="neutral.12">
                        <Component />
                      </Text>
                    </Flex>
                  </MakeElementFocusable>
                  <Tooltip.Content>{iconId}</Tooltip.Content>
                </Tooltip.Root>
              );
            })}
          </SimpleGrid>
        )}
      </Stack>
    </Flex>
  );
};

/** A single selectable row in the category filter rail. */
const CategoryItem = ({
  label,
  count,
  active,
  onSelect,
}: {
  label: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) => (
  <Box
    as="button"
    onClick={onSelect}
    aria-pressed={active}
    display="flex"
    width="100%"
    justifyContent="space-between"
    alignItems="center"
    gap="200"
    px="300"
    py="200"
    borderRadius="200"
    cursor="pointer"
    textAlign="left"
    bg={active ? "primary.3" : "transparent"}
    color={active ? "primary.11" : "neutral.11"}
    fontWeight={active ? "600" : "400"}
    _hover={{ bg: active ? "primary.3" : "neutral.2" }}
  >
    <Text textStyle="sm" truncate>
      {label}
    </Text>
    <Text textStyle="xs" color="neutral.10">
      {count}
    </Text>
  </Box>
);
