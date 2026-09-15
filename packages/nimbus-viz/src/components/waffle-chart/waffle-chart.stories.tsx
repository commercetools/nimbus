import type { Meta } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor } from "storybook/test";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { WaffleChart } from "./waffle-chart";
import type { CategoryDatum } from "../../chart/types";

const meta: Meta = {
  title: "Charts/WaffleChart",
  render: () => <RegistryPreview base="WaffleChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const fixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
  { category: "Partner", value: 1800 },
  { category: "Email", value: 1200 },
];

/**
 * `D2`: `texture` fills each owned cell with a per-category SVG pattern (in
 * addition to color) so categories stay distinguishable without color.
 * Proven directly: every owned cell's `fill` is a `url(#...)` pattern
 * reference, and `<defs>` has one `<pattern>` per category — cell count
 * itself is unaffected (owner-less cells, if any, stay unfilled).
 */
export const Texture: BaseStory = {
  render: () => (
    <WaffleChart
      width={280}
      height={280}
      data={fixture}
      texture
      ariaLabel="Waffle chart with per-category textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const categoryCount = fixture.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(categoryCount);
    // Every cell is owned (allocateCells sums exactly to cells * cells), so
    // every rendered <rect> should carry a textured fill.
    const marks = Array.from(canvasElement.querySelectorAll("rect")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    expect(marks.length).toBe(100);
  },
};

/**
 * Hover/tooltip UX convergence: hovering a cell outlines every cell of that
 * SAME category (`stroke`/`strokeWidth`) -- `hover` is keyed by category,
 * not by cell, so the whole category's block is the "active mark" -- and
 * never dims the other categories' cells. Replaces the "dim everyone else
 * to 0.3 opacity" pattern this chart used to hand-roll. The tooltip's
 * position now tracks the live pointer while it stays inside the grid,
 * rather than being pinned to the horizontal center.
 */
const hoverFixture: CategoryDatum[] = [
  { category: "A", value: 75 },
  { category: "B", value: 25 },
];

export const HoverEmphasis: BaseStory = {
  render: () => (
    <WaffleChart width={280} height={280} data={hoverFixture} cells={4} />
  ),
  play: async ({ canvasElement }) => {
    // Grid cells only -- excludes `SvgTooltip`'s own background `<rect>`
    // (it has a `fill` too, once a hover shows it, but lives inside the
    // tooltip's `pointer-events: none` group, not among the grid cells).
    const owned = () =>
      Array.from(canvasElement.querySelectorAll<SVGRectElement>("rect"))
        .filter((r) => r.hasAttribute("fill"))
        .filter((r) => !r.closest('g[pointer-events="none"]'));
    const fills = Array.from(
      new Set(owned().map((r) => r.getAttribute("fill")))
    );
    expect(fills).toHaveLength(2);
    const groups = fills.map((f) =>
      owned().filter((r) => r.getAttribute("fill") === f)
    );
    // "A" (value 75) claims 12 of the 16 (4x4) cells; "B" (value 25) claims
    // the other 4 -- an exact, rounding-free split.
    const hoveredGroup = groups[0].length === 12 ? groups[0] : groups[1];
    const siblingGroup = hoveredGroup === groups[0] ? groups[1] : groups[0];
    expect(hoveredGroup).toHaveLength(12);
    expect(siblingGroup).toHaveLength(4);

    const hoveredCell = hoveredGroup[0];
    const siblingCell = siblingGroup[0];

    await userEvent.hover(hoveredCell);
    await waitFor(() =>
      expect(hoveredCell).toHaveAttribute("stroke-width", "1.5")
    );

    // No dimming: every owned cell keeps fill-opacity 1, hovered category
    // or not -- the old mechanism (crushing to 0.3) this replaces.
    for (const cell of owned()) {
      expect(cell).toHaveAttribute("fill-opacity", "1");
    }
    // Emphasis instead: EVERY cell of the hovered category is outlined; a
    // sibling category's cell stays untouched at stroke-width 0.
    for (const cell of hoveredGroup) {
      expect(cell).toHaveAttribute("stroke-width", "1.5");
    }
    expect(siblingCell).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer: two mousemoves at different positions
    // within the SAME cell move the tooltip to two different positions.
    const tooltipPos = () => {
      const g = canvasElement.querySelector<SVGGElement>(
        'g[pointer-events="none"]'
      );
      const match = g
        ?.getAttribute("transform")
        ?.match(/translate\(([\d.-]+),\s*([\d.-]+)\)/);
      return match ? `${match[1]},${match[2]}` : null;
    };
    const rect = hoveredCell.getBoundingClientRect();
    fireEvent.mouseMove(hoveredCell, {
      clientX: rect.left + rect.width * 0.2,
      clientY: rect.top + rect.height * 0.2,
    });
    const posNearCorner = await waitFor(() => {
      const p = tooltipPos();
      expect(p).not.toBeNull();
      return p;
    });
    fireEvent.mouseMove(hoveredCell, {
      clientX: rect.left + rect.width * 0.8,
      clientY: rect.top + rect.height * 0.8,
    });
    await waitFor(() => expect(tooltipPos()).not.toBe(posNearCorner));
  },
};
