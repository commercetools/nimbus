import React, { useEffect, useState } from "react";
import type { Preview } from "@storybook/react";
import { UiKitProvider } from "../src";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { addons } from "@storybook/preview-api";

// get channel to listen to event emitter
const channel = addons.getChannel();

const ThemeDecorator = ({ children }) => {
  const [isDark, setDark] = useState(false);
  const theme = isDark ? "dark" : "light";

  useEffect(() => {
    // listen to DARK_MODE event
    channel.on(DARK_MODE_EVENT_NAME, setDark);
    return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
  }, [channel, setDark]);

  return (
    <UiKitProvider key={theme} defaultTheme={theme}>
      {children}
    </UiKitProvider>
  );
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
  decorators: [
    (Story) => {
      return (
        <ThemeDecorator>
          <Story />
        </ThemeDecorator>
      );
    },
  ],
};

export default preview;
