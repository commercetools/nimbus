import type { Meta } from "@storybook/react-vite";
import { userEvent, expect, waitFor } from "storybook/test";
import { ConnectedScatterplot } from "./connected-scatterplot";
import type { ScatterPoint } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/ConnectedScatterplot",
  render: () => <RegistryPreview base="ConnectedScatterplot" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const hoverFixture: ScatterPoint[] = [
  { x: 20, y: 24, label: "Jan" },
  { x: 26, y: 30 },
  { x: 24, y: 38 },
  { x: 33, y: 42 },
  { x: 41, y: 40 },
  { x: 58, y: 61, label: "Jun" },
];

/**
 * Hover/tooltip UX convergence: hovering a point grows that ONE point (`r`)
 * and never dims its siblings — replacing the "dim everyone else to a fixed
 * 0.4 opacity" pattern this chart used to hand-roll. Unlike `BarChart`, a
 * point mark here is a single, tiny coordinate rather than an extended
 * shape, so there's no meaningful "position within the mark" for a tooltip
 * to track as the pointer moves — this chart has no pointer-follow behavior
 * to test, and none was added.
 */
export const HoverEmphasis: BaseStory = {
  render: () => (
    <ConnectedScatterplot width={480} height={280} points={hoverFixture} />
  ),
  play: async ({ canvasElement }) => {
    // Filter to the actual point marks -- endpoints (index 0 and the last
    // index) are drawn permanently larger/filled regardless of hover, so
    // pick two MIDDLE points (indices 2 and 3) to keep the "differs from an
    // unhovered sibling" comparison unambiguous.
    const circles = () =>
      Array.from(canvasElement.querySelectorAll<SVGCircleElement>("circle"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');

    const hoveredPoint = circles()[2];
    const siblingPoint = circles()[3];
    const siblingRBefore = Number(siblingPoint.getAttribute("r"));

    await userEvent.hover(hoveredPoint);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every point keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const circle of circles()) {
      expect(circle).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered point grows; its untouched sibling
    // stays exactly the size it was.
    const hoveredR = Number(circles()[2].getAttribute("r"));
    const siblingRAfter = Number(circles()[3].getAttribute("r"));
    expect(hoveredR).toBeGreaterThan(siblingRAfter);
    expect(siblingRAfter).toBe(siblingRBefore);
  },
};
