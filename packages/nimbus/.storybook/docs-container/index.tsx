import React from "react";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { DARK_MODE_EVENT_NAME } from "@vueless/storybook-dark-mode";
import { useEffect, useState } from "react";
import { addons } from "storybook/preview-api";
import { themes } from "storybook/theming";

// get channel to listen to event emitter
const channel = addons.getChannel();

/**
 * Custom Docs container that synchronizes the Storybook Docs theme with the
 * dark-mode toggle. This ensures that documentation pages automatically
 * switch between light and dark themes based on the user's selected mode in
 * Storybook, providing a consistent visual experience.
 *
 * The container listens for theme changes via the Storybook event channel
 * and updates the DocsContainer theme accordingly. This approach ensures
 * that the docs UI always matches the current theme, even when toggled at
 * runtime or persisted across reloads.
 */
export const CustomDocsContainer = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context: any;
}) => {
  const [isDark, setDark] = useState(false);

  useEffect(() => {
    // initialize with persisted value if present
    const { current } = JSON.parse(
      localStorage.getItem("sb-addon-themes-3") || "{}"
    );
    setDark(current === "dark");

    const handler = (dark: boolean) => setDark(dark);
    channel.on(DARK_MODE_EVENT_NAME, handler);
    return () => channel.off(DARK_MODE_EVENT_NAME, handler);
  }, []);

  return (
    <DocsContainer
      context={context}
      theme={isDark ? themes.dark : themes.light}
    >
      {children}
    </DocsContainer>
  );
};
