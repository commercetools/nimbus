import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { LollipopChart } from "./lollipop-chart";
import type { CategoryDatum } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/LollipopChart",
  render: () => <RegistryPreview base="LollipopChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-1 (`docs/bug-classes.md`): a band scale keyed by category TEXT collapses
 * rows that share a label onto one band, drawing them on top of each other
 * with no error. `LollipopChart` keys its y-band by row INDEX instead, so
 * three same-labeled rows still land on three distinct positions. Asserts the
 * fixed behavior directly: one `<circle>` per row, each at a distinct `cy`.
 */
const duplicateLabelFixture: CategoryDatum[] = duplicateLabels([
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <LollipopChart
      width={320}
      height={240}
      data={duplicateLabelFixture}
      ariaLabel="Lollipop chart of 3 categories sharing one label"
    />
  ),
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll("circle");
    expect(dots).toHaveLength(duplicateLabelFixture.length);
    const positions = Array.from(dots).map((c) => c.getAttribute("cy"));
    expect(new Set(positions).size).toBe(duplicateLabelFixture.length);
  },
};
