import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Histogram } from "./histogram";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/Histogram",
  render: () => <RegistryPreview base="Histogram" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-3 (`docs/bug-classes.md`): a degenerate `[0, max]` count domain (every
 * bin holding the same count) maps the whole axis to the range midpoint
 * instead of a real span. All-identical samples fold into a single d3
 * `bin()`, so this is the input that would have hit that degenerate case --
 * the adversarial mutators (`negateEveryOther`, `allZero`) mutate a flat
 * `value` field and can't express a raw `values: number[]` sample set, so
 * the fixture is hand-built. `valueDomain()` keeps the resulting count axis,
 * and the single bar it draws, finite and correctly sized.
 */
export const EdgeCaseAllZeroSamples: BaseStory = {
  render: () => (
    <Histogram
      width={360}
      height={240}
      values={[0, 0, 0, 0, 0]}
      ariaLabel="Histogram of 5 identical samples"
    />
  ),
  play: async ({ canvasElement }) => {
    // BarRounded renders a <path>; the axis lines are <line> elements, so
    // this selector reaches only the bar marks.
    const bars = Array.from(
      canvasElement.querySelectorAll<SVGPathElement>("path")
    );
    expect(bars.length).toBeGreaterThan(0);

    for (const bar of bars) {
      expect(bar.getAttribute("d") ?? "").not.toContain("NaN");
      expect(bar.getBoundingClientRect().height).toBeGreaterThan(0);
    }
  },
};
