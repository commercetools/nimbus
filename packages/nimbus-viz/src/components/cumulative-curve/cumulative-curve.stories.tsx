import type { Meta } from "@storybook/react-vite";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// Base smoke story: renders one representative preset for CumulativeCurve via the
// selection registry. Confirms Storybook + the browser test project are wired
// up for this component. A focused, hand-authored story can replace it later.
const meta: Meta = {
  title: "Charts/CumulativeCurve",
  render: () => <RegistryPreview base="CumulativeCurve" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
