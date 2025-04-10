import React, { useEffect, useState } from "react";
import type { Preview } from "@storybook/react";
import { NimbusProvider } from "../src";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { addons } from "@storybook/preview-api";

import APCACheck from "./apca-check";

const apca = APCACheck("custom", (fontSize: string) => {
  const size = parseFloat(fontSize);
  switch (true) {
    case size >= 32:
      return 45;
    default:
      return 60;
  }
});

// get channel to listen to event emitter
const channel = addons.getChannel();

const ThemeDecorator = ({ children }) => {
  const [isDark, setDark] = useState(false);
  const theme = isDark ? "dark" : "light";

  useEffect(() => {
    const { current } = JSON.parse(
      // TODO: find out if there is a more elegant solution
      localStorage.getItem("sb-addon-themes-3") || "{}"
    );

    setDark(current === "dark");

    channel.on(DARK_MODE_EVENT_NAME, (darkMode) => {
      setDark(darkMode);
    });

    return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
  }, [channel]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <NimbusProvider defaultTheme={theme}>{children}</NimbusProvider>;
};

const preview: Preview = {
  parameters: {
    darkMode: {
      stylePreview: true,
      classTarget: "html",
    },
    backgrounds: {
      disable: true,
    },
    a11y: {
      config: {
        checks: [...apca.checks],
        rules: [
          {
            // disabled, as radix is using APCA algorithm while Storybook uses WCAG
            // @see https://web.dev/articles/color-and-contrast-accessibility#apca)

            id: "color-contrast",
            enabled: false,
          },
          ...apca.rules,
        ],
      },
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
    },
  },
  tags: ["autodocs", "a11y-test"],
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
