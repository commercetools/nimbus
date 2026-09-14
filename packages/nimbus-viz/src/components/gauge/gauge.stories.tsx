import type { Meta } from "@storybook/react-vite";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/Gauge",
  render: () => <RegistryPreview base="Gauge" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
