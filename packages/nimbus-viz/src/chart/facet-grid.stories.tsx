import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { max } from "d3-array";
import { scaleBand, scaleLinear } from "@visx/scale";
import { FacetGrid } from "./facet-grid";
import type { Facet } from "./facet-grid";
import { useChartTheme, useEntityColors } from "../theme";
import type { BaseStory } from "../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.

interface RegionRow {
  region: string;
  quarters: { key: string; value: number }[];
}

const REGIONS: RegionRow[] = [
  {
    region: "EMEA",
    quarters: [
      { key: "Q1", value: 42 },
      { key: "Q2", value: 55 },
      { key: "Q3", value: 61 },
      { key: "Q4", value: 58 },
    ],
  },
  {
    region: "NA",
    quarters: [
      { key: "Q1", value: 120 },
      { key: "Q2", value: 128 },
      { key: "Q3", value: 118 },
      { key: "Q4", value: 141 },
    ],
  },
  {
    region: "APAC",
    quarters: [
      { key: "Q1", value: 30 },
      { key: "Q2", value: 33 },
      { key: "Q3", value: 39 },
      { key: "Q4", value: 44 },
    ],
  },
  {
    region: "LATAM",
    quarters: [
      { key: "Q1", value: 12 },
      { key: "Q2", value: 15 },
      { key: "Q3", value: 14 },
      { key: "Q4", value: 19 },
    ],
  },
];

const facets: Facet<RegionRow>[] = REGIONS.map((r) => ({
  key: r.region,
  label: r.region,
  data: r,
}));

/** A minimal bar mini-chart -- FacetGrid itself has no chart opinion; the
 * caller draws marks per cell. `domain` is passed in so every cell can share
 * one scale (see `renderCell`'s doc comment on `FacetGridProps`). */
function MiniBars({
  data,
  size,
  domain,
  color,
}: {
  data: RegionRow;
  size: { width: number; height: number };
  domain: [number, number];
  color: string;
}) {
  const x = scaleBand({
    domain: data.quarters.map((q) => q.key),
    range: [0, size.width],
    padding: 0.25,
  });
  const y = scaleLinear({ domain, range: [size.height, 0] });
  return (
    <svg
      width={size.width}
      height={size.height}
      role="img"
      aria-label={`${data.region} by quarter`}
    >
      {data.quarters.map((q) => {
        const bw = x.bandwidth();
        const bx = x(q.key) ?? 0;
        const by = y(q.value);
        return (
          <rect
            key={q.key}
            className="facet-bar"
            x={bx}
            y={by}
            width={bw}
            height={Math.max(0, size.height - by)}
            fill={color}
          />
        );
      })}
    </svg>
  );
}

const meta: Meta = {
  title: "Primitives/FacetGrid",
  parameters: { layout: "fullscreen" },
};
export default meta;

/**
 * Small multiples with domains unified across facets, computed once outside
 * the grid — every cell's bars are readable against the same scale, so
 * NA's bars (the largest region) don't make EMEA's look artificially short.
 * `FacetGrid` itself never touches domains; it only lays out cells and one
 * shared legend.
 */
export const SharedDomain: BaseStory = {
  render: () => {
    function Demo() {
      const theme = useChartTheme();
      const color = useEntityColors(REGIONS.map((r) => r.region));
      const sharedMax =
        max(REGIONS.flatMap((r) => r.quarters.map((q) => q.value))) ?? 1;
      return (
        <FacetGrid<RegionRow>
          facets={facets}
          width={480}
          height={320}
          columns={2}
          renderCell={(facet, size) => (
            <MiniBars
              data={facet.data}
              size={size}
              domain={[0, sharedMax]}
              color={theme.accent}
            />
          )}
          legendSlot={
            <div style={{ fontSize: 11, color: theme.mutedInk }}>
              {REGIONS.map((r) => (
                <span key={r.region} style={{ marginRight: 12 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: color(r.region),
                      marginRight: 4,
                    }}
                  />
                  {r.region}
                </span>
              ))}
            </div>
          }
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const cells = canvasElement.querySelectorAll('svg[role="img"]');
    expect(cells.length).toBe(4);
    // Every cell's y-axis is built from the same [0, sharedMax] domain, so
    // NA's tallest bar (value 141, the dataset's max) reaches the very top
    // of its cell (y ~ 0) while EMEA's tallest (61) does not -- proving the
    // scale is shared, not independently fit per facet.
    const naBars = cells[1].querySelectorAll<SVGRectElement>(".facet-bar");
    const emeaBars = cells[0].querySelectorAll<SVGRectElement>(".facet-bar");
    const naTopY = Math.min(
      ...Array.from(naBars).map((b) => Number(b.getAttribute("y")))
    );
    const emeaTopY = Math.min(
      ...Array.from(emeaBars).map((b) => Number(b.getAttribute("y")))
    );
    expect(naTopY).toBeLessThan(emeaTopY);
    expect(naTopY).toBeCloseTo(0, 0);
  },
};

/**
 * Small multiples with each facet's own free-fit domain — every cell fills
 * its own height regardless of the region's absolute size, which is the
 * right choice when the shape of each series matters more than comparing
 * absolute magnitudes across facets.
 */
export const FreeDomain: BaseStory = {
  render: () => {
    function Demo() {
      const color = useEntityColors(REGIONS.map((r) => r.region));
      return (
        <FacetGrid<RegionRow>
          facets={facets}
          width={480}
          height={280}
          columns={2}
          renderCell={(facet, size) => {
            const ownMax = max(facet.data.quarters.map((q) => q.value)) ?? 1;
            return (
              <MiniBars
                data={facet.data}
                size={size}
                domain={[0, ownMax]}
                color={color(facet.data.region)}
              />
            );
          }}
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const cells = canvasElement.querySelectorAll('svg[role="img"]');
    expect(cells.length).toBe(4);
    // Each facet's own max quarter reaches the top of ITS cell (y ~ 0),
    // regardless of the region's absolute size -- unlike SharedDomain above.
    for (const cell of Array.from(cells)) {
      const bars = cell.querySelectorAll<SVGRectElement>(".facet-bar");
      const topY = Math.min(
        ...Array.from(bars).map((b) => Number(b.getAttribute("y")))
      );
      expect(topY).toBeCloseTo(0, 0);
    }
  },
};
