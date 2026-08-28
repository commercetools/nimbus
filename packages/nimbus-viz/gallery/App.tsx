import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart,
  ChartThemeProvider,
  ColorScaleProvider,
  DonutChart,
  FunnelChart,
  GroupedBarChart,
  Heatmap,
  LineChart,
  ResponsiveContainer,
  SankeyDiagram,
  ScatterPlot,
  StackedBarChart,
  StatCard,
  resolveRoles,
  useChartTheme,
  type ColorMode,
} from "../src";
import {
  channels,
  cohortPeriods,
  cohorts,
  composition,
  flow,
  funnel,
  multiSeries,
  revenueSeries,
  scatter,
} from "./datasets";

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
  const [mode, setMode] = useState<ColorMode>("light");
  const roles = resolveRoles(mode);

  return (
    <ChartThemeProvider mode={mode}>
      <div
        style={{
          minHeight: "100vh",
          background: roles.surfacePage,
          color: roles.ink,
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>nimbus-viz gallery</h1>
            <p
              style={{ margin: "4px 0 0", color: roles.mutedInk, fontSize: 13 }}
            >
              Prototype charts · visx + Nimbus tokens
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
            style={{
              border: `1px solid ${roles.grid}`,
              background: roles.surface,
              color: roles.ink,
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {mode === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </header>

        <ColorScaleProvider domain={COLOR_DOMAIN}>
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
                {(w, h) => <DonutChart width={w} height={h} data={channels} />}
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
                {(w, h) => <SankeyDiagram width={w} height={h} graph={flow} />}
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
          </div>
        </ColorScaleProvider>
      </div>
    </ChartThemeProvider>
  );
}
