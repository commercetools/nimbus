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
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </UiKitProvider>
    ),
  ],
};

export default preview;
