import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { SunburstChart } from "./sunburst-chart";
import type { TreemapNode } from "../treemap";

const meta: Meta = {
  title: "Charts/SunburstChart",
  render: () => <RegistryPreview base="SunburstChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const fixture: TreemapNode = {
  name: "Revenue",
  children: [
    {
      name: "Web",
      children: [
        { name: "New", value: 260 },
        { name: "Returning", value: 180 },
      ],
    },
    {
      name: "Mobile",
      children: [
        { name: "iOS", value: 150 },
        { name: "Android", value: 120 },
      ],
    },
    {
      name: "Retail",
      children: [
        { name: "Flagship", value: 90 },
        { name: "Outlet", value: 60 },
      ],
    },
  ],
};

/**
 * `D2`: `texture` fills each arc with a per-branch SVG pattern (in addition to
 * color) so branches stay distinguishable without color. Every node inherits
 * its top-level ancestor's texture, not one keyed to its own name, so the
 * pattern count matches the number of TOP-LEVEL branches (3), not the number
 * of arcs. Proven directly: every arc's `fill` is a `url(#...)` pattern
 * reference, and `<defs>` has one `<pattern>` per top-level branch.
 */
export const Texture: BaseStory = {
  render: () => (
    <SunburstChart
      width={360}
      height={360}
      data={fixture}
      texture
      ariaLabel="Sunburst with per-branch textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const branchCount = fixture.children!.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(branchCount);
    const arcCount = fixture.children!.reduce(
      (s, c) => s + c.children!.length + 1,
      0
    );
    const marks = Array.from(canvasElement.querySelectorAll("path")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    expect(marks.length).toBe(arcCount);
  },
};

/**
 * `showValues` draws a value label just outside the plot's outer edge, at
 * each OUTERMOST-ring leaf's midpoint angle only -- the top-level branches
 * (an inner ring) never get one, since a label there would float
 * disconnected beneath the deeper ring drawn on top of it. Every leaf in
 * this fixture clears both minimum-size gates, so the labeled chart gains
 * exactly one `<text>` per leaf (6, `root.leaves().length`) over the
 * unlabeled control.
 */
export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <SunburstChart
        width={360}
        height={360}
        data={fixture}
        ariaLabel="Sunburst without value labels"
      />
      <SunburstChart
        width={360}
        height={360}
        data={fixture}
        showValues
        ariaLabel="Sunburst with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (SunburstChart uses the
    // library default role="img"; there is no nested <svg> anywhere in this
    // chart -- no axes, no visx tick-label positioning trick).
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    const leafCount = fixture.children!.reduce(
      (s, c) => s + c.children!.length,
      0
    );
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + leafCount);
  },
};

/**
 * Hover/tooltip UX convergence: hovering an arc outlines that ONE arc
 * (`stroke`/`strokeWidth`) and never dims its siblings — replacing the "dim
 * everyone else to 0.4 opacity, multiplied into the same expression as the
 * depth fade" pattern this chart used to hand-roll. The depth-based fade
 * (`Math.max(0.55, 1 - (depth - 1) * 0.15)`) is unrelated to hover and is
 * kept exactly as-is — proven by asserting a sibling's opacity is
 * unchanged, not by asserting a bare "no opacity attribute" (every arc
 * always carries one, for the fade).
 *
 * Every arc also carries a baseline 1px `theme.surface` separator stroke,
 * unrelated to hover, that was always there (unlike `BarChart`'s
 * hover-only outline) — an untouched sibling keeps that baseline
 * `stroke-width` of `1`, not `0`; only the truly hovered arc gets the
 * emphasized `ACTIVE_STROKE_WIDTH` (`1.5`) outline.
 *
 * Pointer-follow tooltip is skipped, same reasoning as `RadialBarChart`:
 * the tooltip is pinned to a fixed `x`/`top` (top of the plot) regardless
 * of which arc or angle is hovered, and a polar "distance from center"
 * doesn't map cleanly onto that cartesian anchor for every angle.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <SunburstChart width={360} height={360} data={fixture} />,
  play: async ({ canvasElement }) => {
    const arcs = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));

    // The first two arcs in DOM order are both top-level branches (same
    // depth => same depth-fade opacity) -- one becomes the hovered mark,
    // the other an untouched sibling.
    const baseOpacity = arcs()[0].getAttribute("opacity");
    const sameDepth = arcs().filter(
      (p) => p.getAttribute("opacity") === baseOpacity
    );
    const [hoveredArc, siblingArc] = sameDepth;
    const siblingOpacityBefore = siblingArc.getAttribute("opacity");
    const siblingStrokeWidthBefore = siblingArc.getAttribute("stroke-width");

    await userEvent.hover(hoveredArc);
    await waitFor(() =>
      expect(hoveredArc).toHaveAttribute("stroke-width", "1.5")
    );

    // Depth-fade opacity is unrelated to hover and stays exactly as it
    // was -- proving the dimming factor (the old mechanism) is gone, not
    // just that this particular sibling's value happens to read 1.
    expect(siblingArc.getAttribute("opacity")).toBe(siblingOpacityBefore);
    expect(siblingArc.getAttribute("stroke-width")).toBe(
      siblingStrokeWidthBefore
    );

    // Emphasis instead: only the hovered arc gets the active outline; the
    // untouched sibling keeps its baseline separator stroke (1, not 0).
    expect(hoveredArc).toHaveAttribute("stroke-width", "1.5");
    expect(siblingArc).toHaveAttribute("stroke-width", "1");
  },
};
