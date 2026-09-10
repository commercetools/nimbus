import type { Meta } from "@storybook/react-vite";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/StackedBarChart",
  render: () => <RegistryPreview base="StackedBarChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
