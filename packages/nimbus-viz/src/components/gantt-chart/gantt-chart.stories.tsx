import type { Meta } from "@storybook/react-vite";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/GanttChart",
  render: () => <RegistryPreview base="GanttChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
