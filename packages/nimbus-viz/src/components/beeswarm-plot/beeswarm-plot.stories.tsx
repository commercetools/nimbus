import type { Meta } from "@storybook/react-vite";
import { userEvent, expect, waitFor } from "storybook/test";
import { BeeswarmPlot } from "./beeswarm-plot";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/BeeswarmPlot",
  render: () => <RegistryPreview base="BeeswarmPlot" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const hoverFixture: number[] = [10, 14, 18, 22, 26, 30, 34];

/**
 * Hover/tooltip UX convergence: hovering a dot grows that ONE dot (`r`) and
 * never dims its siblings — replacing the "dim everyone else to a fixed 0.3
 * opacity" pattern this chart used to hand-roll. A beeswarm dot is a single
 * tiny coordinate rather than an extended shape, so there's no meaningful
 * "position within the mark" for a tooltip to track as the pointer moves —
 * this chart has no pointer-follow behavior to test, and none was added.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <BeeswarmPlot width={480} height={200} values={hoverFixture} />,
  play: async ({ canvasElement }) => {
    const dots = () =>
      Array.from(canvasElement.querySelectorAll<SVGCircleElement>("circle"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');

    const firstDot = dots()[0];
    const siblingRBefore = Number(dots()[1].getAttribute("r"));

    await userEvent.hover(firstDot);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every dot keeps the exact same opacity regardless of
    // which one is hovered (the old mechanism this replaces varied it
    // between 0.3 and 0.85; it's now a real constant).
    for (const dot of dots()) {
      expect(dot).toHaveAttribute("opacity", "0.85");
    }
    // Emphasis instead: only the hovered dot grows; its untouched sibling
    // stays exactly the size it was.
    const hoveredR = Number(dots()[0].getAttribute("r"));
    const siblingRAfter = Number(dots()[1].getAttribute("r"));
    expect(hoveredR).toBeGreaterThan(siblingRAfter);
    expect(siblingRAfter).toBe(siblingRBefore);
  },
};
