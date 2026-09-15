import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { ChordDiagram } from "./chord-diagram";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/ChordDiagram",
  render: () => <RegistryPreview base="ChordDiagram" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const textureFixture = {
  labels: ["Search", "Social", "Email"],
  matrix: [
    [0, 18, 9],
    [14, 0, 12],
    [7, 15, 0],
  ],
};

/**
 * `D2`: `texture` fills every ribbon and arc with a per-entity SVG pattern (in
 * addition to color) so entities stay distinguishable without color. Proven
 * directly: every ribbon/arc's `fill` is a `url(#...)` pattern reference, and
 * `<defs>` has one `<pattern>` per entity.
 */
export const Texture: BaseStory = {
  render: () => (
    <ChordDiagram
      width={360}
      height={320}
      data={textureFixture}
      texture
      ariaLabel="Chord diagram with per-entity textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const entityCount = textureFixture.labels.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(entityCount);
    const marks = Array.from(canvasElement.querySelectorAll("path")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    // One arc per entity (3) plus one ribbon per pair exchanging volume in
    // either direction — every one of the 3 possible pairs here (Search↔
    // Social, Search↔Email, Social↔Email) has flow, so 3 ribbons + 3 arcs.
    expect(marks.length).toBe(entityCount + 3);
  },
};

const hoverFixture = {
  labels: ["Search", "Social", "Email"],
  matrix: [
    [0, 18, 9],
    [14, 0, 12],
    [7, 15, 0],
  ],
};

/**
 * Hover/tooltip UX convergence: hovering a ribbon or an arc outlines the
 * truly active ribbon(s) (`stroke`/`strokeWidth`) instead of the old
 * `ribbonOpacity` helper's "crush every non-active ribbon to 0.1" spread.
 * Every ribbon keeps its real 0.45 baseline opacity regardless of hover —
 * proven by asserting it never CHANGES, since (like `SunburstChart`'s
 * depth-fade) the attribute is always present, just no longer hover-driven.
 * Arc marks never had this dimming to begin with — they carry no `opacity`
 * attribute at all, hovered or not — asserted directly.
 *
 * Pointer-follow tooltip is skipped here, same reasoning as
 * `RadialBarChart` and `SunburstChart`: the tooltip is pinned to a fixed
 * `x`/`top` regardless of which arc or ribbon is hovered, and this polar
 * layout has no single cartesian axis a pointer position within a
 * ribbon/arc maps cleanly onto.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <ChordDiagram width={360} height={320} data={hoverFixture} />,
  play: async ({ canvasElement, step }) => {
    const paths = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));
    // Ribbons always carry an `opacity` attribute (the real 0.45 baseline);
    // arcs never carry one at all.
    const ribbons = () => paths().filter((p) => p.hasAttribute("opacity"));
    const arcs = () => paths().filter((p) => !p.hasAttribute("opacity"));

    await step("Arcs never carry an opacity attribute", async () => {
      expect(arcs()).toHaveLength(3);
      for (const arc of arcs()) {
        expect(arc).not.toHaveAttribute("opacity");
      }
    });

    await step(
      "Hovering a ribbon outlines only that ribbon, leaving every ribbon's opacity untouched",
      async () => {
        const [ribbonA, ribbonB, ribbonC] = ribbons();
        const opacityBefore = [ribbonA, ribbonB, ribbonC].map((r) =>
          r.getAttribute("opacity")
        );

        await userEvent.hover(ribbonA);
        await waitFor(() =>
          expect(ribbonA).toHaveAttribute("stroke-width", "1.5")
        );

        // No dimming: every ribbon's opacity is exactly what it was before
        // -- the old mechanism (crushing to 0.1) this replaces.
        expect(ribbonA.getAttribute("opacity")).toBe(opacityBefore[0]);
        expect(ribbonB.getAttribute("opacity")).toBe(opacityBefore[1]);
        expect(ribbonC.getAttribute("opacity")).toBe(opacityBefore[2]);

        // Emphasis instead: only the hovered ribbon gets a real outline.
        expect(ribbonA).toHaveAttribute("stroke-width", "1.5");
        expect(ribbonB).toHaveAttribute("stroke-width", "0");
        expect(ribbonC).toHaveAttribute("stroke-width", "0");

        await userEvent.unhover(ribbonA);
      }
    );

    await step(
      "Hovering an arc outlines every ribbon touching that entity, not the unrelated one",
      async () => {
        // "Search" (index 0) touches the Search↔Social and Search↔Email
        // ribbons but not Social↔Email.
        const searchArc = arcs()[0];
        await userEvent.hover(searchArc);

        const touching = () =>
          ribbons().filter((r) => r.getAttribute("stroke-width") === "1.5");
        await waitFor(() => expect(touching()).toHaveLength(2));

        const untouched = ribbons().find(
          (r) => r.getAttribute("stroke-width") === "0"
        );
        expect(untouched).toBeDefined();
        // Still not dimmed.
        expect(untouched).toHaveAttribute("opacity", "0.45");
      }
    );
  },
};
