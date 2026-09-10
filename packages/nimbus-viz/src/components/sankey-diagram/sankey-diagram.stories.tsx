import type { Meta } from "@storybook/react-vite";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/SankeyDiagram",
  render: () => <RegistryPreview base="SankeyDiagram" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
