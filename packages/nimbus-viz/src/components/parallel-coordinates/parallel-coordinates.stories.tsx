import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ParallelCoordinates, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const dimensions = [
  { key: "price", label: "Price" },
  { key: "mpg", label: "MPG" },
  { key: "hp", label: "Horsepower" },
];

const data = [
  { id: "car-1", group: "Sedan", values: { price: 22000, mpg: 34, hp: 150 } },
  { id: "car-2", group: "Sedan", values: { price: 26000, mpg: 30, hp: 180 } },
  { id: "car-3", group: "SUV", values: { price: 35000, mpg: 24, hp: 240 } },
  { id: "car-4", group: "SUV", values: { price: 40000, mpg: 21, hp: 280 } },
  { id: "car-5", group: "Truck", values: { price: 45000, mpg: 18, hp: 320 } },
];

const meta: Meta = {
  title: "Charts/ParallelCoordinates",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <ParallelCoordinates
          width={width}
          height={height}
          dimensions={dimensions}
          data={data}
        />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * `D2/D3-rest`: `texture` distinguishes groups by `strokeDasharray` rhythm
 * (in addition to color) -- the stroked-mark reference for this rollout, same
 * reasoning as `LineChart`'s own `Texture` story: a polyline has no fill area
 * to texture, so the dash rhythm on the stroke is the one non-color channel.
 * Keyed by GROUP (like the color itself), not by row: `car-1`/`car-2` (both
 * `Sedan`) keep the same solid stroke, `car-3`/`car-4` (both `SUV`) get the
 * exact same dash pattern as each other -- proving dash tracks the group a
 * row shares its color with, not an arbitrary per-row cycle.
 */
export const Texture: BaseStory = {
  render: () => (
    <ParallelCoordinates
      width={420}
      height={300}
      dimensions={dimensions}
      data={data}
      texture
      ariaLabel="Parallel coordinates with per-group dash rhythm"
    />
  ),
  play: async ({ canvasElement }) => {
    // Scope to the chart's own <svg role="img">, matching the convention
    // used elsewhere for stroked-mark charts (no visx <Axis> here, so there
    // is no nested-<svg> gotcha, but the outer element is still the frame).
    const chart = canvasElement.querySelector<SVGElement>('svg[role="img"]');
    expect(chart).toBeTruthy();
    const lines = Array.from(
      chart!.querySelectorAll<SVGPathElement>("path.visx-linepath")
    );
    expect(lines).toHaveLength(data.length);

    // Sedan rows (first group, index 0): unchanged solid stroke.
    expect(lines[0]).not.toHaveAttribute("stroke-dasharray");
    expect(lines[1]).not.toHaveAttribute("stroke-dasharray");

    // SUV rows (second group, index 1): dash-encoded, and both rows share
    // the exact same pattern as each other.
    expect(lines[2]).toHaveAttribute("stroke-dasharray");
    expect(lines[3]).toHaveAttribute("stroke-dasharray");
    expect(lines[2].getAttribute("stroke-dasharray")).not.toBe("");
    expect(lines[2].getAttribute("stroke-dasharray")).toBe(
      lines[3].getAttribute("stroke-dasharray")
    );

    // Truck (third group, index 2): its own distinct dash pattern.
    expect(lines[4]).toHaveAttribute("stroke-dasharray");
    expect(lines[4].getAttribute("stroke-dasharray")).not.toBe(
      lines[2].getAttribute("stroke-dasharray")
    );
  },
};
