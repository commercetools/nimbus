import type { Meta } from "@storybook/react-vite";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/CumulativeCurve",
  render: () => <RegistryPreview base="CumulativeCurve" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
