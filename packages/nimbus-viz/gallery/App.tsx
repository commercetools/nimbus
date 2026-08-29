import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart,
  BenchmarkSeries,
  BoxPlot,
  BulletChart,
  ChartThemeProvider,
  chartRegistry,
  ColorScaleProvider,
  ConfidenceBand,
  DonutChart,
  FunnelChart,
  Gauge,
  GroupedBarChart,
  Heatmap,
  Histogram,
  LineChart,
  ReferenceLine,
  ResolvedChart,
  resolveByName,
  ResponsiveContainer,
  SankeyDiagram,
  ScatterPlot,
  StackedBarChart,
  StatCard,
  TargetMarker,
  ThresholdBand,
  Treemap,
  TrendLine,
  StackedAreaChart,
  Streamgraph,
  SlopeChart,
  DumbbellChart,
  BumpChart,
  BubbleChart,
  Sparkline,
  RadarChart,
  ParallelCoordinates,
  CalendarHeatmap,
  RfmGrid,
  CohortTriangle,
  ControlChart,
  ParetoChart,
  WaterfallChart,
  useChartTheme,
  type ColorMode,
} from "../src";
import {
  NimbusProvider,
  useColorMode,
  Box,
  Flex,
  Heading,
  Text,
  Button,
} from "@commercetools/nimbus";
import {
  arr,
  bullets,
  channels,
  cohortPeriods,
  cohorts,
  compareRequest,
  composition,
  flow,
  funnel,
  geoRequest,
  latencyByRegion,
  multiSeries,
  orderValues,
  plan,
  revenueForecast,
  revenueSeries,
  revenueTree,
  scatter,
  channelTraffic,
  slopeData,
  dumbbellData,
  bumpSeries,
  bubblePoints,
  sparkData,
  radarAxes,
  radarData,
  parallelDimensions,
  parallelRows,
  calendarData,
  rfmData,
  controlSeries,
  paretoData,
} from "./datasets";
import { CatalogBrowser } from "./CatalogBrowser";

// A dashboard-wide entity→color domain so a series keeps its color across
// charts (e.g. "Returning" is the same hue in the stacked and grouped bars).
const COLOR_DOMAIN = [
  // line series are keyed by id, not label
  "rev",
  "cost",
  "profit",
  "New",
  "Returning",
  "Wholesale",
  "EU",
  "US",
  "Web",
  "Mobile",
  "Marketplace",
  "POS",
  "Partner",
];

function Card({ title, children }: { title: string; children: ReactNode }) {
  const t = useChartTheme();
  return (
    <section
      style={{
        background: t.surface,
        border: `1px solid ${t.grid}`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <h2
        style={{
          margin: "0 0 12px",
          fontSize: 13,
          fontWeight: 600,
          color: t.mutedInk,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function App() {
  return (
    <NimbusProvider defaultTheme="light">
      <GalleryShell />
    </NimbusProvider>
  );
}

function GalleryShell() {
  const { colorMode, toggleColorMode } = useColorMode();
  const mode: ColorMode = colorMode === "dark" ? "dark" : "light";

  const [view, setView] = useState<"charts" | "catalog">("charts");
  const registryEntries = [...chartRegistry.values()];
  const presetCount = registryEntries.filter(
    (e) => e.canonical === false
  ).length;
  const canonicalCount = registryEntries.length - presetCount;

  return (
    <ChartThemeProvider mode={mode}>
      <Box minH="100vh" bg="neutral.1" color="neutral.12" p="600">
        <Flex as="header" align="center" justify="space-between" mb="600">
          <Box>
            <Heading>nimbus-viz gallery</Heading>
            <Text color="fg.muted" mt="100">
              Prototype charts · visx + Nimbus tokens
            </Text>
          </Box>
          <Flex gap="200">
            <Flex gap="100">
              {(["charts", "catalog"] as const).map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant={view === v ? "solid" : "outline"}
                  colorPalette="primary"
                  onPress={() => setView(v)}
                >
                  {v === "charts" ? "Charts" : "Catalog"}
                </Button>
              ))}
            </Flex>
            <Button
              size="sm"
              variant="outline"
              colorPalette="neutral"
              onPress={toggleColorMode}
            >
              {mode === "light" ? "🌙 Dark" : "☀️ Light"}
            </Button>
          </Flex>
        </Flex>

        <ColorScaleProvider domain={COLOR_DOMAIN}>
          {view === "catalog" ? (
            <CatalogBrowser />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 16,
                alignItems: "start",
              }}
            >
              <Card title="KPI stat cards">
                <div style={{ display: "flex", gap: 32 }}>
                  <StatCard
                    label="Revenue (MTD)"
                    value={482000}
                    previous={430000}
                  />
                  <StatCard label="Orders" value={12840} previous={13120} />
                </div>
              </Card>

              <Card title="Revenue — area">
                <ResponsiveContainer height={220}>
                  {(w, h) => (
                    <LineChart
                      width={w}
                      height={h}
                      series={revenueSeries}
                      variant="area"
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Revenue / Cost / Profit — lines (with a gap)">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <LineChart width={w} height={h} series={multiSeries} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Sales by channel — bars">
                <ResponsiveContainer height={240}>
                  {(w, h) => <BarChart width={w} height={h} data={channels} />}
                </ResponsiveContainer>
              </Card>

              <Card title="Sales by channel — ranked">
                <ResponsiveContainer height={220}>
                  {(w, h) => (
                    <BarChart
                      width={w}
                      height={h}
                      data={channels}
                      orientation="horizontal"
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Revenue mix — donut">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <DonutChart width={w} height={h} data={channels} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Customers by quarter — stacked">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <StackedBarChart width={w} height={h} data={composition} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Customers by quarter — grouped">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <GroupedBarChart width={w} height={h} data={composition} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="AOV vs. orders — scatter">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <ScatterPlot width={w} height={h} points={scatter} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Checkout funnel">
                <ResponsiveContainer height={240}>
                  {(w, h) => <FunnelChart width={w} height={h} data={funnel} />}
                </ResponsiveContainer>
              </Card>

              <Card title="Traffic → purchase — Sankey">
                <ResponsiveContainer height={280}>
                  {(w, h) => (
                    <SankeyDiagram width={w} height={h} graph={flow} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Retention — cohort heatmap">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <Heatmap
                      width={w}
                      height={h}
                      rows={cohorts}
                      columnLabels={cohortPeriods}
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Retention — cohort triangle (calendar-aligned)">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <CohortTriangle
                      width={w}
                      height={h}
                      rows={cohorts}
                      periodLabels={cohorts.map((c) => c.label)}
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="ARR bridge — waterfall">
                <ResponsiveContainer height={240}>
                  {(w, h) => <WaterfallChart width={w} height={h} data={arr} />}
                </ResponsiveContainer>
              </Card>

              <Card title="KPIs vs. target — bullet">
                <ResponsiveContainer height={200}>
                  {(w, h) => (
                    <BulletChart width={w} height={h} data={bullets} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Capacity — gauge">
                <ResponsiveContainer height={180}>
                  {(w, h) => (
                    <Gauge
                      width={w}
                      height={h}
                      value={72}
                      threshold={80}
                      label="Capacity"
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Order value — histogram">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <Histogram width={w} height={h} values={orderValues} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Latency by region — box plot">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <BoxPlot width={w} height={h} groups={latencyByRegion} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Revenue tree — treemap">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <Treemap width={w} height={h} data={revenueTree} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Traffic by channel — stacked area">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <StackedAreaChart
                      width={w}
                      height={h}
                      series={channelTraffic}
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Traffic by channel — streamgraph">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <Streamgraph width={w} height={h} series={channelTraffic} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Regional rank over time — bump">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <BumpChart width={w} height={h} series={bumpSeries} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Q1 → Q2 by market — slope">
                <ResponsiveContainer height={300}>
                  {(w, h) => (
                    <SlopeChart
                      width={w}
                      height={h}
                      data={slopeData}
                      leftLabel="Q1"
                      rightLabel="Q2"
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Before / after by area — dumbbell">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <DumbbellChart
                      width={w}
                      height={h}
                      data={dumbbellData}
                      startLabel="2023"
                      endLabel="2024"
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Accounts — bubble (x, y, size)">
                <ResponsiveContainer height={300}>
                  {(w, h) => (
                    <BubbleChart width={w} height={h} points={bubblePoints} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Sessions — sparkline (inline)">
                <ResponsiveContainer height={48}>
                  {(w, h) => (
                    <Sparkline width={w} height={h} data={sparkData} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Model profiles — radar">
                <ResponsiveContainer height={320}>
                  {(w, h) => (
                    <RadarChart
                      width={w}
                      height={h}
                      axes={radarAxes}
                      data={radarData}
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Vehicles — parallel coordinates">
                <ResponsiveContainer height={300}>
                  {(w, h) => (
                    <ParallelCoordinates
                      width={w}
                      height={h}
                      dimensions={parallelDimensions}
                      data={parallelRows}
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Daily activity — calendar heatmap">
                <ResponsiveContainer height={180}>
                  {(w, h) => (
                    <CalendarHeatmap width={w} height={h} data={calendarData} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Segments — RFM grid">
                <ResponsiveContainer height={360}>
                  {(w, h) => <RfmGrid width={w} height={h} data={rfmData} />}
                </ResponsiveContainer>
              </Card>

              <Card title="Fill weight — control chart (SPC)">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <ControlChart
                      width={w}
                      height={h}
                      series={controlSeries}
                      center={250}
                      ucl={258}
                      lcl={242}
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Defect causes — Pareto">
                <ResponsiveContainer height={280}>
                  {(w, h) => (
                    <ParetoChart width={w} height={h} data={paretoData} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Revenue vs. plan — area + band + target + benchmark">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <LineChart
                      width={w}
                      height={h}
                      series={revenueSeries}
                      variant="area"
                    >
                      <ThresholdBand
                        from={200}
                        to={260}
                        variant="positive"
                        label="Healthy"
                      />
                      <ReferenceLine value={240} label="Target" />
                      <BenchmarkSeries points={plan} label="Plan" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Forecast envelope — line + confidence band">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <LineChart width={w} height={h} series={revenueSeries}>
                      <ConfidenceBand points={revenueForecast} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="AOV vs. orders — scatter + trend line">
                <ResponsiveContainer height={260}>
                  {(w, h) => (
                    <ScatterPlot width={w} height={h} points={scatter}>
                      <TrendLine points={scatter} />
                    </ScatterPlot>
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="Sales vs. target — bars + target marker">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <BarChart width={w} height={h} data={channels}>
                      <ReferenceLine value={3000} label="Avg" />
                      <TargetMarker value={4000} label="Goal" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="🧠 Agent asks: COMPARE by channel">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <ResolvedChart
                      request={compareRequest}
                      width={w}
                      height={h}
                    />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card title="🧠 Agent asks: GEO → table fallback">
                <ResponsiveContainer height={240}>
                  {(w, h) => (
                    <ResolvedChart request={geoRequest} width={w} height={h} />
                  )}
                </ResponsiveContainer>
              </Card>

              <Card
                title={`🗂️ Catalog: ${canonicalCount} canonical + ${presetCount} presets`}
              >
                <Text color="fg.muted">
                  Every preset is pure config — a base chart + overlays +
                  defaults + selection metadata, registered under a name and
                  tagged with the persona question it answers. The agent picks a
                  preset by name (<code>resolveByName</code>); the two cards
                  below render one each.
                </Text>
              </Card>

              <Card title="🗂️ resolveByName: sla-compliance-over-time">
                <ResponsiveContainer height={240}>
                  {(w, h) =>
                    resolveByName(
                      "sla-compliance-over-time",
                      {
                        intent: "RANGE",
                        data: revenueSeries,
                        options: {
                          variant: "area",
                          rangeLow: 160,
                          rangeHigh: 210,
                          target: 200,
                        },
                      },
                      { width: w, height: h }
                    ).render({ width: w, height: h })
                  }
                </ResponsiveContainer>
              </Card>

              <Card title="🗂️ resolveByName: roas-by-channel">
                <ResponsiveContainer height={240}>
                  {(w, h) =>
                    resolveByName(
                      "roas-by-channel",
                      { intent: "COMPARE", data: channels },
                      { width: w, height: h }
                    ).render({ width: w, height: h })
                  }
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </ColorScaleProvider>
      </Box>
    </ChartThemeProvider>
  );
}
