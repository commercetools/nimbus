import type { Meta } from "@storybook/react-vite";
import { userEvent, expect, waitFor } from "storybook/test";
import { CumulativeCurve } from "./cumulative-curve";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/CumulativeCurve",
  render: () => <RegistryPreview base="CumulativeCurve" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const hoverFixture: number[] = [10, 18, 24, 30, 42, 55, 68, 80];

/**
 * Hover/tooltip UX convergence: hovering a sample dot grows that ONE dot
 * (`r`) and never dims its siblings — replacing the "dim everyone else to a
 * fixed 0.4 opacity" pattern this chart used to hand-roll. Only the discrete
 * per-sample dots (shown at 60 samples or fewer) are interactive at all —
 * the curve's own line has no hover behavior — and each dot is a single
 * tiny coordinate rather than an extended shape, so there's no meaningful
 * "position within the mark" for a tooltip to track as the pointer moves.
 * This chart has no pointer-follow behavior to test, and none was added.
 */
export const HoverEmphasis: BaseStory = {
  render: () => (
    <CumulativeCurve width={480} height={280} values={hoverFixture} />
  ),
  play: async ({ canvasElement }) => {
    const dots = () =>
      Array.from(canvasElement.querySelectorAll<SVGCircleElement>("circle"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');

    const firstDot = dots()[0];
    const siblingRBefore = Number(dots()[1].getAttribute("r"));

    await userEvent.hover(firstDot);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every dot keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const dot of dots()) {
      expect(dot).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered dot grows; its untouched sibling
    // stays exactly the size it was.
    const hoveredR = Number(dots()[0].getAttribute("r"));
    const siblingRAfter = Number(dots()[1].getAttribute("r"));
    expect(hoveredR).toBeGreaterThan(siblingRAfter);
    expect(siblingRAfter).toBe(siblingRBefore);
  },
};
