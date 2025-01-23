import React from "react";
import type { Preview } from "@storybook/react";
import { UiKitProvider } from "../src";

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
    darkMode: {
      classTarget: "html",
      stylePreview: true,
    },
  },
  decorators: [
    (Story) => (
      <UiKitProvider>
        <Story />
      </UiKitProvider>
    ),
  ],
};

export default preview;
