import type { Meta } from "@storybook/react-vite";
import { userEvent, expect, waitFor } from "storybook/test";
import { CandlestickChart } from "./candlestick-chart";
import type { OhlcBar } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/CandlestickChart",
  render: () => <RegistryPreview base="CandlestickChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const hoverFixture: OhlcBar[] = [
  { date: new Date("2024-01-01"), open: 100, high: 108, low: 96, close: 104 },
  { date: new Date("2024-01-02"), open: 104, high: 110, low: 101, close: 107 },
  { date: new Date("2024-01-03"), open: 107, high: 112, low: 103, close: 105 },
  { date: new Date("2024-01-04"), open: 105, high: 109, low: 99, close: 101 },
];

/**
 * Hover/tooltip UX convergence: hovering a candle outlines that ONE candle's
 * BODY (`stroke`/`strokeWidth` on the open→close `<rect>`) and never dims its
 * siblings — replacing the "dim everyone else to a fixed 0.4 opacity" pattern
 * this chart used to hand-roll on the whole per-candle group. The thin wick
 * is a fixed-size shape with no useful interior to track a pointer within,
 * so this chart has no pointer-follow behavior to test, and none was added.
 */
export const HoverEmphasis: BaseStory = {
  render: () => (
    <CandlestickChart width={480} height={280} data={hoverFixture} />
  ),
  play: async ({ canvasElement }) => {
    // One `<rect>` per candle body (in data order), one `<line>` per wick.
    const bodies = () =>
      Array.from(canvasElement.querySelectorAll<SVGRectElement>("rect"));
    const wicks = () =>
      Array.from(canvasElement.querySelectorAll<SVGLineElement>("line"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');

    const firstBody = bodies()[0];
    await userEvent.hover(firstBody);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: neither the bodies nor the wicks carry an `opacity`
    // attribute at all (the old mechanism this replaces, previously set on
    // the whole per-candle group).
    for (const body of bodies()) {
      expect(body).not.toHaveAttribute("opacity");
    }
    for (const wick of wicks()) {
      expect(wick).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered candle's body gets a real outline.
    expect(firstBody).toHaveAttribute("stroke-width", "1.5");
    expect(bodies()[1]).toHaveAttribute("stroke-width", "0");
  },
};
