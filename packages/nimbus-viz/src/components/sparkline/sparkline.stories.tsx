import type { Meta } from "@storybook/react-vite";
import { ResponsiveContainer, Sparkline } from "../../";
import type { BaseStory } from "../../stories/base-story";

// Base smoke story. Sparkline has no selection-registry preset, so it renders
// directly with a small inline dataset. Confirms Storybook + the browser test
// project are wired up for this component. A focused story can replace it later.
const data = [12, 15, 13, 18, 22, 19, 24, 21, 27, 30].map((y, x) => ({ x, y }));

const meta: Meta = {
  title: "Charts/Sparkline",
  render: () => (
    <ResponsiveContainer height={80}>
      {(width, height) => (
        <Sparkline width={width} height={height} data={data} showEndDot />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
