import React from "react";
import type { Preview } from "@storybook/react";
import { UiKitProvider } from "../src";
import { useDarkMode } from "storybook-dark-mode";

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
  decorators: [
    (Story) => {
      const isDark = useDarkMode();
      const theme = isDark ? "dark" : "light";

      return (
        <UiKitProvider key={theme} defaultTheme={theme}>
          <Story />
        </UiKitProvider>
      );
    },
  ],
};

export default preview;
