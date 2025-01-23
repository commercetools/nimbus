import React from "react";
import type { Preview } from "@storybook/react";
import { UiKitProvider } from "../src";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
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
