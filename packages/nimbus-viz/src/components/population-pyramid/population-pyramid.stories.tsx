import type { Meta } from "@storybook/react-vite";
import { userEvent, fireEvent, expect, waitFor } from "storybook/test";
import { PopulationPyramid } from "./population-pyramid";
import type { StackRow } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/PopulationPyramid",
  render: () => <RegistryPreview base="PopulationPyramid" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const fixture: StackRow[] = [
  {
    category: "0–17",
    segments: [
      { key: "Male", value: 62 },
      { key: "Female", value: 58 },
    ],
  },
  {
    category: "18–34",
    segments: [
      { key: "Male", value: 88 },
      { key: "Female", value: 92 },
    ],
  },
];

/**
 * `showValues` draws each side's formatted value directly at its own outer
 * end -- the anchor flips by side, the same idea as `bar-chart.tsx`'s
 * horizontal branch. Proven the same way: the with-labels chart carries
 * exactly one extra `<text>` per bar (two sides per band) over the
 * without-labels chart.
 */
export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <PopulationPyramid
        width={320}
        height={280}
        data={fixture}
        ariaLabel="Population pyramid without value labels"
      />
      <PopulationPyramid
        width={320}
        height={280}
        data={fixture}
        showValues
        ariaLabel="Population pyramid with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (PopulationPyramid uses the
    // library default role="img" -- it has no keyboard-focusable marks).
    // Axis tick labels render their own nested <svg> (visx's positioning
    // trick), which would otherwise inflate this count too.
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    const sideCount = fixture.length * 2;
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + sideCount);
  },
};

/**
 * Hover/tooltip UX convergence: hovering a bar outlines that ONE bar
 * (`stroke`/`strokeWidth`) and never dims its siblings -- including the
 * opposite side of the same band -- replacing the "dim everyone else to a
 * fixed opacity" pattern this chart (and 30 others) used to hand-roll
 * independently. This chart's value axis runs along x, so the tooltip's
 * HORIZONTAL position tracks the live pointer while it stays inside the
 * hovered bar -- the category axis (`top`, on y) stays snapped to the
 * hovered band's own row position.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <PopulationPyramid width={480} height={280} data={fixture} />,
  play: async ({ canvasElement }) => {
    const rects = () =>
      Array.from(canvasElement.querySelectorAll<SVGRectElement>("rect"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipLeft = () => {
      const g = tooltipGroup();
      const match = g?.getAttribute("transform")?.match(/\(([\d.-]+),/);
      return match ? Number(match[1]) : null;
    };

    // DOM order per band: left rect (Male), right rect (Female).
    const [row0Left, row0Right] = rects();
    await userEvent.hover(row0Left);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every bar keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const rect of rects()) {
      expect(rect).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered bar gets a real outline; the
    // opposite side of the same band stays un-outlined.
    expect(row0Left).toHaveAttribute("stroke-width", "1.5");
    expect(row0Right).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer horizontally: two mousemoves at different
    // widths within the SAME bar move the tooltip to two different
    // horizontal positions.
    const rect = row0Left.getBoundingClientRect();
    const cy = rect.top + rect.height / 2;
    fireEvent.mouseMove(row0Left, {
      clientX: rect.left + rect.width * 0.25,
      clientY: cy,
    });
    const leftNearStart = await waitFor(() => {
      const l = tooltipLeft();
      expect(l).not.toBeNull();
      return l;
    });
    fireEvent.mouseMove(row0Left, {
      clientX: rect.left + rect.width * 0.75,
      clientY: cy,
    });
    await waitFor(() => expect(tooltipLeft()).not.toBe(leftNearStart));
  },
};

/**
 * BC-1 regression: `bandByIndex` positions each row's `y` band by row order,
 * not by the category label, so three bands sharing one label ("0-9" below,
 * after `duplicateLabels`) still render at three distinct heights instead of
 * collapsing onto a single band.
 */
const dupFixture: StackRow[] = duplicateLabels([
  {
    category: "0-9",
    segments: [
      { key: "Male", value: 50 },
      { key: "Female", value: 48 },
    ],
  },
  {
    category: "10-19",
    segments: [
      { key: "Male", value: 60 },
      { key: "Female", value: 58 },
    ],
  },
  {
    category: "20-29",
    segments: [
      { key: "Male", value: 55 },
      { key: "Female", value: 53 },
    ],
  },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <PopulationPyramid
      width={360}
      height={240}
      data={dupFixture}
      ariaLabel="Population pyramid with duplicate band labels"
    />
  ),
  play: async ({ canvasElement }) => {
    // Each band draws one left rect and one right rect.
    const rects = Array.from(canvasElement.querySelectorAll("rect"));
    expect(rects.length).toBe(dupFixture.length * 2);

    const leftYs = rects
      .filter((_, i) => i % 2 === 0)
      .map((r) => r.getAttribute("y"));
    expect(new Set(leftYs).size).toBe(dupFixture.length);
  },
};

/**
 * Bug class BC-2 (`docs/bug-classes.md`): a side's length can't encode a
 * negative magnitude. A negative segment value is drawn as a zero-width bar
 * (and logs a development warning) instead of extending past the gutter.
 */
const negFixture: StackRow[] = [
  {
    category: "0-9",
    segments: [
      { key: "Male", value: 50 },
      { key: "Female", value: 48 },
    ],
  },
  {
    category: "10-19",
    segments: [
      { key: "Male", value: -20 },
      { key: "Female", value: 58 },
    ],
  },
  {
    category: "20-29",
    segments: [
      { key: "Male", value: 55 },
      { key: "Female", value: 53 },
    ],
  },
];

export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <PopulationPyramid
      width={360}
      height={240}
      data={negFixture}
      ariaLabel="Population pyramid with a negative left-side value"
    />
  ),
  play: async ({ canvasElement }) => {
    const rects = Array.from(
      canvasElement.querySelectorAll<SVGRectElement>("rect")
    );
    expect(rects.length).toBe(negFixture.length * 2);
    // Left rects are the even-indexed ones (drawn first per band).
    const leftWidths = rects
      .filter((_, i) => i % 2 === 0)
      .map((r) => Number(r.getAttribute("width")));
    expect(leftWidths[1]).toBe(0); // the negative row's left bar
    expect(leftWidths[0]).toBeGreaterThan(0);
    expect(leftWidths[2]).toBeGreaterThan(0);
    for (const r of rects) {
      expect(r.getAttribute("width")).not.toMatch(/NaN/);
    }
  },
};

/**
 * `D2`: `texture` fills each side with a per-key SVG pattern (in addition to
 * color) so the two sides stay distinguishable without color. Proven
 * directly: every side's `fill` is a `url(#...)` pattern reference, and
 * `<defs>` has one `<pattern>` per side (always 2 here).
 */
export const Texture: BaseStory = {
  render: () => (
    <PopulationPyramid
      width={360}
      height={240}
      data={fixture}
      texture
      ariaLabel="Population pyramid with per-side textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(2);
    const marks = Array.from(
      canvasElement.querySelectorAll<SVGRectElement>("rect")
    ).filter((el) => el.getAttribute("fill")?.startsWith("url(#"));
    expect(marks.length).toBe(fixture.length * 2);
  },
};
