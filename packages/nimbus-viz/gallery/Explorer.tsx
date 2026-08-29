import { Component, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BoxPlot,
  BulletChart,
  chartRegistry,
  Gauge,
  GroupedBarChart,
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
  Flex,
  Heading,
  SearchInput,
  Text,
} from "@commercetools/nimbus";
import {
  arr,
  bubblePoints,
  bullets,
  calendarData,
  channels,
  channelTraffic,
  cohortPeriods,
  cohorts,
  composition,
  dumbbellData,
  flow,
  funnel,
  latencyByRegion,
  orderValues,
  parallelDimensions,
  parallelRows,
  radarAxes,
  radarData,
  revenueTree,
  rfmData,
  scatter,
  slopeData,
} from "./datasets";

// ── Representative data per concrete DataKind, so any catalog entry previews.
// series/category carry an options bag (target, range, errors) so overlay-
// bearing configs render their overlays; the multivariate/paired kinds pass
// the axis/label options their charts need.
const SAMPLE: Record<
  string,
  { data: unknown; options?: Record<string, unknown> }
> = {
  series: {
    data: channelTraffic,
    options: { target: 450, rangeLow: 380, rangeHigh: 560 },
  },
  category: {
    data: channels,
    options: {
      target: 3000,
      errors: [
        { x: 0, low: 3800, high: 4600 },
        { x: 1, low: 2800, high: 3400 },
        { x: 2, low: 1500, high: 2100 },
        { x: 3, low: 1000, high: 1400 },
        { x: 4, low: 500, high: 780 },
      ],
    },
  },
  "stack-row": { data: composition },
  scatter: { data: scatter },
  "heat-row": {
    data: cohorts,
    options: {
      columnLabels: cohortPeriods,
      periodLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
  },
  funnel: { data: funnel },
  "slope-row": {
    data: slopeData,
    options: { leftLabel: "Q1", rightLabel: "Q2" },
  },
  "dumbbell-row": {
    data: dumbbellData,
    options: { startLabel: "2023", endLabel: "2024" },
  },
  bubble: { data: bubblePoints },
  "radar-series": { data: radarData, options: { axes: radarAxes } },
  "parallel-row": {
    data: parallelRows,
    options: { dimensions: parallelDimensions },
  },
  calendar: { data: calendarData },
  rfm: { data: rfmData },
};

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
      configCount: new Set(
        entries.map((e) => e.metadata.configLabel ?? base)
      ).size,
      intents: [
        ...new Set(
          entries.flatMap((e) => e.metadata.intents.map((i) => i.intent))
        ),
      ],
      shapes: [
        ...new Set(entries.flatMap((e) => e.metadata.acceptedShapes)),
      ],
    }))
    .sort((a, b) => a.base.localeCompare(b.base));
}

const CATALOG_TYPES = buildCatalogTypes();

// ── Gap types: built components with no registry entry (a coverage gap). ─────
// Rendered directly (no presets / questions / selection metadata) so retiring
// the flat grid loses nothing and the gap stays visible.
interface GapType {
  base: string;
  label: string;
  height: number;
  render: (w: number, h: number) => ReactNode;
}

const GAP_TYPES: GapType[] = ([
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
    base: "GroupedBarChart",
    label: "Grouped bar",
    height: 260,
    render: (w: number, h: number) => <GroupedBarChart width={w} height={h} data={composition} />,
  },
  {
    base: "Histogram",
    label: "Histogram",
    height: 240,
    render: (w: number, h: number) => <Histogram width={w} height={h} values={orderValues} />,
  },
  {
    base: "BoxPlot",
    label: "Box plot",
    height: 240,
    render: (w: number, h: number) => <BoxPlot width={w} height={h} groups={latencyByRegion} />,
  },
  {
    base: "BulletChart",
    label: "Bullet",
    height: 200,
    render: (w: number, h: number) => <BulletChart width={w} height={h} data={bullets} />,
  },
  {
    base: "Gauge",
    label: "Gauge",
    height: 180,
    render: (w: number, h: number) => (
      <Gauge width={w} height={h} value={72} threshold={80} label="Capacity" />
    ),
  },
  {
    base: "WaterfallChart",
    label: "Waterfall",
    height: 240,
    render: (w: number, h: number) => <WaterfallChart width={w} height={h} data={arr} />,
  },
  {
    base: "SankeyDiagram",
    label: "Sankey",
    height: 280,
    render: (w: number, h: number) => <SankeyDiagram width={w} height={h} graph={flow} />,
  },
  {
    base: "Treemap",
    label: "Treemap",
    height: 260,
    render: (w: number, h: number) => <Treemap width={w} height={h} data={revenueTree} />,
  },
] as GapType[]).sort((a, b) => a.label.localeCompare(b.label));

function renderPreset(entry: ChartRegistryEntry, w: number, h: number) {
  const kind = entry.dataKinds[0] ?? "series";
  const sample = SAMPLE[kind];
  if (!sample) return null;
  const intent: Intent = entry.metadata.intents[0]?.intent ?? "TREND";
  return resolveByName(
    entry.metadata.name,
    { intent, data: sample.data, options: sample.options },
    { width: w, height: h }
  ).render({ width: w, height: h });
}

function Meta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Flex gap="200" fontSize="350" lineHeight="1.6">
      <Text color="fg.muted" minW="7rem">
        {label}
      </Text>
      <Text>{value}</Text>
    </Flex>
  );
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
  const [selected, setSelected] = useState<string>(
    CATALOG_TYPES[0]?.base ?? ""
  );

  const q = query.trim().toLowerCase();

  const catalogMatches = useMemo(
    () =>
      CATALOG_TYPES.filter(
        (t) =>
          !q ||
          t.base.toLowerCase().includes(q) ||
          t.entries.some(
            (e) =>
              e.metadata.name.toLowerCase().includes(q) ||
              e.metadata.questionString.toLowerCase().includes(q) ||
              (e.metadata.persona ?? "").toLowerCase().includes(q)
          )
      ),
    [q]
  );
  const gapMatches = useMemo(
    () =>
      GAP_TYPES.filter(
        (g) => !q || g.base.toLowerCase().includes(q) || g.label.includes(q)
      ),
    [q]
  );

  const gap = GAP_TYPES.find((g) => g.base === selected);
  const cat = gap
    ? undefined
    : (CATALOG_TYPES.find((t) => t.base === selected) ?? CATALOG_TYPES[0]);

  return (
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
            {CATALOG_TYPES.length} in catalog · {GAP_TYPES.length} not yet · ★ =
            has canonical
          </Text>
        </Box>
        <Box overflowY="auto" p="200">
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
        </Box>
      </Box>

      {/* ── main panel ── */}
      <Box flexGrow="1">
        {gap ? <GapPanel gap={gap} /> : cat ? <CatalogPanel type={cat} /> : null}
      </Box>
    </Flex>
  );
}

function CatalogPanel({ type }: { type: CatalogType }) {
  // Group the type's entries by configuration signature.
  const configs = useMemo(() => {
    const m = new Map<string, ChartRegistryEntry[]>();
    for (const e of type.entries) {
      const key = e.metadata.configLabel ?? type.base;
      const list = m.get(key);
      if (list) list.push(e);
      else m.set(key, [e]);
    }
    return [...m.entries()].map(([label, members]) => ({ label, members }));
  }, [type]);

  return (
    <Box>
      <Heading size="md">{type.base}</Heading>
      <Text color="fg.muted" mb="300">
        {type.presetCount} preset{type.presetCount === 1 ? "" : "s"} ·{" "}
        {type.configCount} configuration{type.configCount === 1 ? "" : "s"} ·{" "}
        {type.canonicalCount} canonical
      </Text>
      <Meta label="Intents" value={type.intents.join(", ")} />
      <Meta label="Shapes" value={type.shapes.join(", ")} />

      <Flex direction="column" gap="400" mt="400">
        {configs.map((cfg) => {
          const rep = cfg.members[0];
          const hasCanonical = cfg.members.some((e) => e.canonical !== false);
          return (
            <Box
              key={cfg.label}
              borderWidth="1px"
              borderColor="neutral.6"
              borderRadius="300"
              bg="neutral.2"
              p="400"
            >
              <Flex align="center" gap="200" mb="200">
                <Text fontFamily="mono" fontWeight="600" fontSize="350">
                  {cfg.label}
                  {hasCanonical ? " ★" : ""}
                </Text>
                <Badge size="2xs" colorPalette="neutral">
                  {cfg.members.length} preset
                  {cfg.members.length === 1 ? "" : "s"}
                </Badge>
              </Flex>

              <Box
                borderWidth="1px"
                borderColor="neutral.6"
                borderRadius="200"
                bg="neutral.1"
                p="200"
                mb="300"
              >
                <PreviewBoundary
                  key={cfg.label}
                  fallback={
                    <Text p="600" color="fg.muted" fontSize="350">
                      This configuration could not render with the sample data.
                    </Text>
                  }
                >
                  <ResponsiveContainer height={300}>
                    {(w, h) => renderPreset(rep, w, h)}
                  </ResponsiveContainer>
                </PreviewBoundary>
              </Box>

              <Text
                fontSize="300"
                fontWeight="600"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="0.04em"
                mb="150"
              >
                Questions it answers
              </Text>
              <Flex direction="column" gap="100">
                {cfg.members.map((e) => (
                  <Text key={e.metadata.name} fontSize="350">
                    <Text as="span" fontFamily="mono" color="neutral.12">
                      {e.metadata.name}
                      {e.canonical !== false ? " ★" : ""}
                    </Text>
                    <Text as="span" color="fg.muted">
                      {" — "}
                      {e.metadata.persona ?? "canonical"}:{" "}
                      {e.metadata.questionString}
                    </Text>
                  </Text>
                ))}
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

function GapPanel({ gap }: { gap: GapType }) {
  return (
    <Box>
      <Heading size="md">{gap.base}</Heading>
      <Box
        borderWidth="1px"
        borderColor="warning.7"
        bg="warning.2"
        borderRadius="200"
        px="300"
        py="200"
        mt="200"
        mb="400"
      >
        <Text fontSize="350" color="warning.11">
          Built component — <strong>not yet in the selection catalog</strong>.
          No presets, questions, or selection metadata; rendered directly. A
          candidate to register (or intentionally excluded).
        </Text>
      </Box>
      <Box
        borderWidth="1px"
        borderColor="neutral.6"
        borderRadius="300"
        bg="neutral.2"
        p="400"
      >
        <ResponsiveContainer height={gap.height}>
          {(w, h) => gap.render(w, h)}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
