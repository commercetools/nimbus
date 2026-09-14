import { Suspense, useMemo, useState, type FC, type ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
  SearchInput,
  useColorMode,
} from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";
import {
  ChartThemeProvider,
  ResponsiveContainer,
} from "@commercetools/nimbus-viz";
import Fuse from "fuse.js";

import { useManifest } from "@/contexts/manifest-context";
import {
  CHART_CATALOG,
  PURPOSES,
  type ChartCatalogEntry,
} from "./charts-catalog";
import { InView, ThumbBoundary } from "./chart-thumb";

/** The manifest fields this gallery reads (a subset of RouteInfo). */
type ChartRoute = {
  path: string;
  title: string;
  description: string;
  exportName?: string;
  menu: string[];
};

/** A catalog entry paired with the live doc route it links to. */
type GalleryItem = { entry: ChartCatalogEntry; route: ChartRoute };

const PurposeIcon: FC<{ name: string; fallback?: string }> = ({
  name,
  fallback = "Insights",
}) => {
  const Ic =
    (Icons[name as keyof typeof Icons] as FC | undefined) ??
    (Icons[fallback as keyof typeof Icons] as FC | undefined);
  return Ic ? <Ic /> : null;
};

/**
 * One gallery card: a live chart thumbnail over the chart's name and the
 * question it answers. The whole card links to that chart's doc page. The
 * thumbnail mounts lazily (InView) and is isolated by an error boundary so one
 * misbehaving preview can't blank the grid. A single ChartThemeProvider higher
 * up supplies the theme, so cards don't each create one.
 */
const ChartCard: FC<{ item: GalleryItem }> = ({ item: { entry, route } }) => {
  const preview: ReactNode = entry.selfSizing ? (
    <Flex justify="center" width="full">
      {entry.Thumb({ width: 0, height: 0 })}
    </Flex>
  ) : (
    <ResponsiveContainer height={entry.height}>
      {(width, height) => entry.Thumb({ width, height })}
    </ResponsiveContainer>
  );

  return (
    <Link href={route.path} textDecoration="none" width="full">
      <Card.Root
        variant="plain"
        width="full"
        height="full"
        _hover={{ bg: "colorPalette.2" }}
      >
        <Card.Body>
          <Stack gap="300">
            <Box
              bg="neutral.1"
              borderRadius="200"
              border="solid-25"
              borderColor="neutral.3"
              p="200"
              overflow="hidden"
            >
              <InView minHeight={entry.height}>
                <ThumbBoundary minHeight={entry.height}>
                  {preview}
                </ThumbBoundary>
              </InView>
            </Box>
            <Stack gap="50">
              <Heading size="sm" color="neutral.12" truncate>
                {route.title}
              </Heading>
              <Text textStyle="sm" color="neutral.11" lineClamp={2}>
                {entry.question}
              </Text>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Link>
  );
};

const GRID_COLUMNS = { base: 1, sm: 2, lg: 3, xl: 4 };

const ChartGrid: FC<{ items: GalleryItem[] }> = ({ items }) => (
  <SimpleGrid columns={GRID_COLUMNS} gap="400">
    {items.map((item) => (
      <ChartCard key={item.entry.exportName} item={item} />
    ))}
  </SimpleGrid>
);

const ChartsHomeContent: FC = () => {
  const { routeManifest } = useManifest();
  const { colorMode } = useColorMode();
  const mode = colorMode === "dark" ? "dark" : "light";

  const [query, setQuery] = useState("");
  const [activePurpose, setActivePurpose] = useState<string | null>(null);

  // Live chart component pages (menu === ["Charts", <title>]), keyed by the
  // export name that the catalog also keys on. The landing page and any
  // non-component pages are excluded (no exportName / not a leaf).
  const routeByExport = useMemo(() => {
    const map = new Map<string, ChartRoute>();
    // The docs manifest route type doesn't surface `exportName`, but the
    // generated JSON carries it (see nimbus-docs-build routeInfoSchema); read it
    // through the local ChartRoute shape.
    for (const route of routeManifest?.routes ?? []) {
      const r = route as ChartRoute;
      if (r.menu?.[0] === "Charts" && r.menu.length === 2 && r.exportName) {
        map.set(r.exportName, r);
      }
    }
    return map;
  }, [routeManifest]);

  // Catalog order is authored family-by-family, so items (and every derived
  // section) come out in a deliberate reading order.
  const items = useMemo<GalleryItem[]>(() => {
    const out: GalleryItem[] = [];
    for (const entry of CHART_CATALOG) {
      const route = routeByExport.get(entry.exportName);
      if (route) out.push({ entry, route });
    }
    return out;
  }, [routeByExport]);

  const countByPurpose = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { entry } of items) {
      counts.set(entry.purpose, (counts.get(entry.purpose) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        ignoreLocation: true,
        threshold: 0.35,
        keys: [
          { name: "route.title", weight: 4 },
          { name: "entry.question", weight: 2 },
          { name: "entry.keywords", weight: 2 },
          { name: "route.description", weight: 1 },
        ],
      }),
    [items]
  );

  const trimmedQuery = query.trim();

  // Filtered/searched view. A search term produces a flat, relevance-ranked
  // list; otherwise the active purpose (or "all") narrows the set, still in
  // catalog order.
  const visible = useMemo<GalleryItem[]>(() => {
    if (trimmedQuery) return fuse.search(trimmedQuery).map((r) => r.item);
    if (activePurpose)
      return items.filter((i) => i.entry.purpose === activePurpose);
    return items;
  }, [trimmedQuery, fuse, activePurpose, items]);

  // Group the (purpose-scoped or full) set for the sectioned browse view.
  const grouped = useMemo(() => {
    const map = new Map<string, GalleryItem[]>();
    for (const item of visible) {
      const list = map.get(item.entry.purpose);
      if (list) list.push(item);
      else map.set(item.entry.purpose, [item]);
    }
    return map;
  }, [visible]);

  const isSearching = trimmedQuery.length > 0;

  return (
    <Stack gap="600">
      <Stack gap="200" maxWidth="4xl">
        <Heading size="2xl" color="neutral.12">
          Charts
        </Heading>
        <Text color="neutral.11">
          A data-visualization library for Nimbus. Browse every chart by the
          question it answers, then open a chart for a live, editable example
          and its import. Every preview below follows the current{" "}
          {mode === "dark" ? "dark" : "light"} color mode.
        </Text>
        <Text textStyle="sm" color="neutral.10">
          Charts render inside a{" "}
          <Box as="code" textStyle="sm">
            &lt;ChartThemeProvider&gt;
          </Box>{" "}
          and size to their container with{" "}
          <Box as="code" textStyle="sm">
            &lt;ResponsiveContainer&gt;
          </Box>
          .
        </Text>
      </Stack>

      {/* Sticky controls: search over every chart + intent/purpose filter. */}
      <Box
        position="sticky"
        top="0"
        zIndex={1}
        py="300"
        bg="bg/85"
        backdropFilter="blur(8px)"
      >
        <Stack gap="300">
          <SearchInput
            width="full"
            aria-label="Search charts"
            placeholder={`Search ${items.length} charts by name, purpose, or keyword …`}
            value={query}
            onChange={setQuery}
          />
          <Flex gap="150" wrap="wrap">
            <Button
              size="xs"
              variant={activePurpose === null ? "solid" : "outline"}
              onPress={() => setActivePurpose(null)}
            >
              All {items.length}
            </Button>
            {PURPOSES.map((p) => {
              const count = countByPurpose.get(p.key) ?? 0;
              if (count === 0) return null;
              const selected = activePurpose === p.key;
              return (
                <Button
                  key={p.key}
                  size="xs"
                  variant={selected ? "solid" : "outline"}
                  onPress={() =>
                    setActivePurpose((cur) => (cur === p.key ? null : p.key))
                  }
                >
                  {p.label} {count}
                </Button>
              );
            })}
          </Flex>
        </Stack>
      </Box>

      <ChartThemeProvider mode={mode}>
        {visible.length === 0 ? (
          <Flex direction="column" align="center" gap="300" py="1200">
            <Box color="neutral.8" css={{ fontSize: "48px" }}>
              <PurposeIcon name="SearchOff" fallback="Insights" />
            </Box>
            <Text color="neutral.11">No charts match “{trimmedQuery}”.</Text>
            <Button size="xs" variant="outline" onPress={() => setQuery("")}>
              Clear search
            </Button>
          </Flex>
        ) : isSearching ? (
          // Search: one flat, relevance-ranked grid across every purpose.
          <ChartGrid items={visible} />
        ) : (
          // Browse: a titled section per purpose, each with its guiding
          // question, in catalog order.
          <Stack gap="800">
            {PURPOSES.map((p) => {
              const list = grouped.get(p.key);
              if (!list || list.length === 0) return null;
              return (
                <Stack key={p.key} gap="400">
                  <Flex align="center" gap="300">
                    <Box color="primary.11" textStyle="2xl">
                      <PurposeIcon name={p.icon} />
                    </Box>
                    <Box>
                      <Heading size="md" color="neutral.12">
                        {p.label}
                      </Heading>
                      <Text textStyle="sm" color="neutral.11">
                        {p.question}
                      </Text>
                    </Box>
                  </Flex>
                  <ChartGrid items={list} />
                </Stack>
              );
            })}
          </Stack>
        )}
      </ChartThemeProvider>
    </Stack>
  );
};

/**
 * The Charts landing page (`<ChartsHomePage />` in `charts.mdx`). A searchable,
 * intent-filterable gallery of live chart thumbnails — the charts analogue of
 * the Icons page's `<IconSearch />`. Each card links to that chart's own doc
 * page. Wrapped in Suspense because the route manifest loads on demand.
 */
export const ChartsHomePage: FC = () => (
  <Suspense fallback={<Box py="1200">Loading charts …</Box>}>
    <ChartsHomeContent />
  </Suspense>
);
