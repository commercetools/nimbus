import { Component, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BoxPlot,
  BulletChart,
  chartRegistry,
  Gauge,
  Histogram,
  resolveByName,
  ResponsiveContainer,
  SankeyDiagram,
  StatCard,
  Treemap,
  WaterfallChart,
} from "../src";
import type { ChartRegistryEntry, Intent } from "../src";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Flex,
  Heading,
  SearchInput,
  SimpleGrid,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { fixtureFor } from "./fixtures";
import {
  arr,
  bullets,
  flow,
  latencyByRegion,
  orderValues,
  revenueTree,
} from "./datasets";

/** A local boundary so one throwing preview never blanks the whole explorer. */
class PreviewBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// ── Catalog types: derived from the registry, grouped by base component ──────
interface CatalogType {
  base: string;
  entries: ChartRegistryEntry[];
  presetCount: number;
  canonicalCount: number;
  configCount: number;
  intents: Intent[];
  shapes: string[];
}

function buildCatalogTypes(): CatalogType[] {
  const byBase = new Map<string, ChartRegistryEntry[]>();
  for (const e of chartRegistry.values()) {
    const b = e.metadata.baseComponent;
    const arr = byBase.get(b);
    if (arr) arr.push(e);
    else byBase.set(b, [e]);
  }
  return [...byBase.entries()]
    .map(([base, entries]) => ({
      base,
      entries,
      presetCount: entries.length,
      canonicalCount: entries.filter((e) => e.canonical !== false).length,
      configCount: new Set(entries.map((e) => e.metadata.configLabel ?? base))
        .size,
      intents: [
        ...new Set(
          entries.flatMap((e) => e.metadata.intents.map((i) => i.intent))
        ),
      ],
      shapes: [...new Set(entries.flatMap((e) => e.metadata.acceptedShapes))],
    }))
    .sort((a, b) => a.base.localeCompare(b.base));
}

const CATALOG_TYPES = buildCatalogTypes();

// The question-intent taxonomy, in doc order, restricted to intents actually
// present in the catalog — the axis the intent filter offers.
const INTENT_ORDER: Intent[] = [
  "TREND",
  "DELTA",
  "RANK",
  "PART-WHOLE",
  "COMPARE",
  "DIST",
  "TARGET",
  "RANGE",
  "REL",
  "COMP-TIME",
  "GEO",
  "FLOW",
  "BENCH",
  "RETAIN",
  "VALUE",
];
const PRESENT_INTENTS = new Set(CATALOG_TYPES.flatMap((t) => t.intents));
const ALL_INTENTS = INTENT_ORDER.filter((i) => PRESENT_INTENTS.has(i));

// ── Gap types: built components with no registry entry (a coverage gap). ─────
// Rendered directly (no presets / questions / selection metadata) so retiring
// the flat grid loses nothing and the gap stays visible.
interface GapType {
  base: string;
  label: string;
  height: number;
  render: (w: number, h: number) => ReactNode;
}

const GAP_TYPES: GapType[] = (
  [
    {
      base: "StatCard",
      label: "Stat card",
      height: 120,
      render: () => (
        <Flex gap="800">
          <StatCard label="Revenue (MTD)" value={482000} previous={430000} />
          <StatCard label="Orders" value={12840} previous={13120} />
        </Flex>
      ),
    },
    {
      base: "Histogram",
      label: "Histogram",
      height: 240,
      render: (w: number, h: number) => (
        <Histogram width={w} height={h} values={orderValues} />
      ),
    },
    {
      base: "BoxPlot",
      label: "Box plot",
      height: 240,
      render: (w: number, h: number) => (
        <BoxPlot width={w} height={h} groups={latencyByRegion} />
      ),
    },
    {
      base: "BulletChart",
      label: "Bullet",
      height: 200,
      render: (w: number, h: number) => (
        <BulletChart width={w} height={h} data={bullets} />
      ),
    },
    {
      base: "Gauge",
      label: "Gauge",
      height: 180,
      render: (w: number, h: number) => (
        <Gauge
          width={w}
          height={h}
          value={72}
          threshold={80}
          label="Capacity"
        />
      ),
    },
    {
      base: "WaterfallChart",
      label: "Waterfall",
      height: 240,
      render: (w: number, h: number) => (
        <WaterfallChart width={w} height={h} data={arr} />
      ),
    },
    {
      base: "SankeyDiagram",
      label: "Sankey",
      height: 280,
      render: (w: number, h: number) => (
        <SankeyDiagram width={w} height={h} graph={flow} />
      ),
    },
    {
      base: "Treemap",
      label: "Treemap",
      height: 260,
      render: (w: number, h: number) => (
        <Treemap width={w} height={h} data={revenueTree} />
      ),
    },
  ] as GapType[]
).sort((a, b) => a.label.localeCompare(b.label));

function renderPreset(entry: ChartRegistryEntry, w: number, h: number) {
  const fx = fixtureFor(entry);
  const intent: Intent = entry.metadata.intents[0]?.intent ?? "TREND";
  return resolveByName(
    entry.metadata.name,
    { intent, data: fx.data, options: fx.options },
    { width: w, height: h }
  ).render({ width: w, height: h });
}

function TypeRow({
  title,
  subtitle,
  active,
  onClick,
  badge,
  badgePalette,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
  badge: string;
  badgePalette: "primary" | "neutral";
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      width="full"
      textAlign="left"
      display="block"
      border="none"
      borderRadius="200"
      cursor="pointer"
      px="200"
      py="150"
      mb="50"
      bg={active ? "primary.9" : "transparent"}
      color={active ? "primary.contrast" : "neutral.12"}
      _hover={active ? undefined : { bg: "neutral.4" }}
    >
      <Flex align="center" justify="space-between" gap="200">
        <Text fontWeight="600" fontSize="350">
          {title}
        </Text>
        <Badge size="2xs" colorPalette={active ? "neutral" : badgePalette}>
          {badge}
        </Badge>
      </Flex>
      <Text
        fontSize="300"
        color={active ? "primary.contrast" : "fg.muted"}
        opacity={active ? 0.85 : 1}
      >
        {subtitle}
      </Text>
    </Box>
  );
}

export function Explorer() {
  const [query, setQuery] = useState("");
  const [selectedIntents, setSelectedIntents] = useState<Set<string>>(
    () => new Set()
  );
  const [selected, setSelected] = useState<string>(
    CATALOG_TYPES[0]?.base ?? ""
  );

  const q = query.trim().toLowerCase();
  const intentActive = selectedIntents.size > 0;

  const catalogMatches = useMemo(
    () =>
      CATALOG_TYPES.filter((t) => {
        const textOk =
          !q ||
          t.base.toLowerCase().includes(q) ||
          t.entries.some(
            (e) =>
              e.metadata.name.toLowerCase().includes(q) ||
              e.metadata.questionString.toLowerCase().includes(q) ||
              (e.metadata.persona ?? "").toLowerCase().includes(q)
          );
        const intentOk =
          !intentActive ||
          t.entries.some((e) =>
            e.metadata.intents.some((i) => selectedIntents.has(i.intent))
          );
        return textOk && intentOk;
      }),
    [q, intentActive, selectedIntents]
  );
  // Gap types carry no catalog metadata, so an active intent filter hides them.
  const gapMatches = useMemo(
    () =>
      intentActive
        ? []
        : GAP_TYPES.filter(
            (g) => !q || g.base.toLowerCase().includes(q) || g.label.includes(q)
          ),
    [q, intentActive]
  );

  const selectedGap = GAP_TYPES.find((g) => g.base === selected);
  const gap =
    selectedGap && gapMatches.includes(selectedGap) ? selectedGap : undefined;
  const cat = gap
    ? undefined
    : (catalogMatches.find((t) => t.base === selected) ?? catalogMatches[0]);

  const toggleIntent = (i: string) =>
    setSelectedIntents((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Stack gap="400">
      {/* ── intent filter ── */}
      <Box
        borderWidth="1px"
        borderColor="neutral.6"
        borderRadius="300"
        bg="neutral.2"
        p="300"
      >
        <Flex gap="100" wrap="wrap" align="center">
          <Text
            textStyle="xs"
            color="fg.muted"
            textTransform="uppercase"
            letterSpacing="0.06em"
            mr="100"
          >
            Filter by intent
          </Text>
          {ALL_INTENTS.map((i) => {
            const active = selectedIntents.has(i);
            return (
              <Button
                key={i}
                size="2xs"
                variant={active ? "solid" : "outline"}
                colorPalette={active ? "primary" : "neutral"}
                onPress={() => toggleIntent(i)}
              >
                {i}
              </Button>
            );
          })}
          {intentActive && (
            <Button
              size="2xs"
              variant="ghost"
              colorPalette="neutral"
              onPress={() => setSelectedIntents(new Set())}
            >
              Clear
            </Button>
          )}
        </Flex>
      </Box>

      <Flex gap="400" align="start">
        {/* ── sidebar ── */}
        <Box
          width="20rem"
          flexShrink="0"
          borderWidth="1px"
          borderColor="neutral.6"
          borderRadius="300"
          bg="neutral.2"
          maxH="82vh"
          display="flex"
          flexDirection="column"
        >
          <Box p="300" borderBottomWidth="1px" borderColor="neutral.6">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Filter chart types…"
              aria-label="Filter chart types"
            />
            <Text fontSize="300" color="fg.muted" mt="200">
              {catalogMatches.length}{" "}
              {intentActive ? "match the filter" : "in catalog"} ·{" "}
              {gapMatches.length} not yet · ★ = has canonical
            </Text>
          </Box>
          <Box overflowY="auto" p="200">
            {catalogMatches.length > 0 && (
              <Text
                fontSize="300"
                fontWeight="600"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="0.04em"
                px="200"
                py="150"
              >
                In catalog
              </Text>
            )}
            {catalogMatches.map((t) => (
              <TypeRow
                key={t.base}
                title={`${t.base}${t.canonicalCount > 0 ? " ★" : ""}`}
                subtitle={`${t.presetCount} preset${
                  t.presetCount === 1 ? "" : "s"
                } · ${t.configCount} config${t.configCount === 1 ? "" : "s"}`}
                active={!gap && cat?.base === t.base}
                onClick={() => setSelected(t.base)}
                badge={String(t.presetCount)}
                badgePalette="primary"
              />
            ))}

            {gapMatches.length > 0 && (
              <>
                <Text
                  fontSize="300"
                  fontWeight="600"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="0.04em"
                  px="200"
                  py="150"
                  mt="200"
                >
                  Not in catalog yet
                </Text>
                {gapMatches.map((g) => (
                  <TypeRow
                    key={g.base}
                    title={g.base}
                    subtitle="built · no presets"
                    active={gap?.base === g.base}
                    onClick={() => setSelected(g.base)}
                    badge="gap"
                    badgePalette="neutral"
                  />
                ))}
              </>
            )}
          </Box>
        </Box>

        {/* ── main panel ── */}
        <Box flexGrow="1">
          {gap ? (
            <GapPanel gap={gap} />
          ) : cat ? (
            <CatalogPanel type={cat} selectedIntents={selectedIntents} />
          ) : (
            <Text color="fg.muted">No chart types match this filter.</Text>
          )}
        </Box>
      </Flex>
    </Stack>
  );
}

function CatalogPanel({
  type,
  selectedIntents,
}: {
  type: CatalogType;
  selectedIntents: Set<string>;
}) {
  const intentActive = selectedIntents.size > 0;
  // One card per question — filtered by intent, canonical answers first.
  const presets = useMemo(() => {
    const list = intentActive
      ? type.entries.filter((e) =>
          e.metadata.intents.some((i) => selectedIntents.has(i.intent))
        )
      : type.entries;
    return [...list].sort((a, b) => {
      const ca = a.canonical !== false ? 0 : 1;
      const cb = b.canonical !== false ? 0 : 1;
      return ca - cb || a.metadata.name.localeCompare(b.metadata.name);
    });
  }, [type, selectedIntents, intentActive]);

  return (
    <Stack gap="600">
      <Box>
        <Flex align="center" gap="200" mb="100">
          <Heading>{type.base}</Heading>
          {type.canonicalCount > 0 && (
            <Badge size="xs" colorPalette="primary">
              canonical
            </Badge>
          )}
        </Flex>
        <Text color="fg.muted" textStyle="sm">
          {intentActive
            ? `${presets.length} of ${type.presetCount} question${
                type.presetCount === 1 ? "" : "s"
              } match`
            : `${type.presetCount} question${
                type.presetCount === 1 ? "" : "s"
              }`}{" "}
          · {type.configCount} configuration
          {type.configCount === 1 ? "" : "s"} · {type.shapes.join(", ")}
        </Text>
        <Flex gap="100" mt="200" wrap="wrap">
          {type.intents.map((i) => {
            const on = selectedIntents.has(i);
            return (
              <Badge
                key={i}
                size="2xs"
                colorPalette={on ? "primary" : "neutral"}
              >
                {i}
              </Badge>
            );
          })}
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="400">
        {presets.map((e) => (
          <QuestionCard key={e.metadata.name} entry={e} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

/** A single question framed as a card: the question, answered by its chart. */
function QuestionCard({ entry }: { entry: ChartRegistryEntry }) {
  const canonical = entry.canonical !== false;
  const intents = entry.metadata.intents.map((i) => i.intent);
  return (
    <Card.Root variant="outlined" size="md">
      <Card.Header>
        <Stack gap="150">
          <Flex align="center" justify="space-between" gap="200">
            <Text
              textStyle="xs"
              color="fg.muted"
              textTransform="uppercase"
              letterSpacing="0.06em"
            >
              {entry.metadata.persona ?? "Canonical answer"}
            </Text>
            {canonical && (
              <Badge size="2xs" colorPalette="primary">
                canonical
              </Badge>
            )}
          </Flex>
          <Text textStyle="lg" fontWeight="600" color="neutral.12">
            {entry.metadata.questionString}
          </Text>
          <Code>{entry.metadata.name}</Code>
        </Stack>
      </Card.Header>
      <Card.Body>
        <PreviewBoundary
          key={entry.metadata.name}
          fallback={
            <Text color="fg.muted" textStyle="sm">
              Could not render with the sample data.
            </Text>
          }
        >
          <ResponsiveContainer
            aspectRatio={1.7}
            minHeight={200}
            maxHeight={320}
          >
            {(w, h) => renderPreset(entry, w, h)}
          </ResponsiveContainer>
        </PreviewBoundary>
      </Card.Body>
      <Card.Footer>
        <Flex gap="100" wrap="wrap" align="center">
          {intents.map((i) => (
            <Badge key={i} size="2xs" colorPalette="neutral">
              {i}
            </Badge>
          ))}
          {entry.metadata.overlays?.length ? (
            <Text textStyle="xs" color="fg.muted">
              + {entry.metadata.overlays.join(", ")}
            </Text>
          ) : null}
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
}

function GapPanel({ gap }: { gap: GapType }) {
  return (
    <Stack gap="400">
      <Heading>{gap.base}</Heading>
      <Box
        borderWidth="1px"
        borderColor="warning.7"
        bg="warning.2"
        borderRadius="200"
        px="400"
        py="300"
      >
        <Text textStyle="sm" color="warning.11">
          Built component — <strong>not yet in the selection catalog</strong>.
          No presets, questions, or selection metadata; rendered directly. A
          candidate to register (or intentionally excluded).
        </Text>
      </Box>
      <Card.Root variant="outlined" size="md">
        <Card.Body>
          <ResponsiveContainer height={gap.height}>
            {(w, h) => gap.render(w, h)}
          </ResponsiveContainer>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
