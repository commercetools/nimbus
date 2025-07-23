import React from "react";
import { type StoryContext } from "@storybook/react-vite";
import { DARK_MODE_EVENT_NAME } from "@vueless/storybook-dark-mode";
import { useEffect, useState } from "react";
import { addons } from "storybook/preview-api";
import { NimbusProvider } from "../../src";

// get channel to listen to event emitter
const channel = addons.getChannel();

export const ThemeDecorator = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context: StoryContext;
}) => {
  const [isDark, setDark] = useState(false);
  const theme = isDark ? "dark" : "light";
  const { locale } = context.globals;

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

  return (
    <NimbusProvider locale={locale} defaultTheme={theme}>
      {children}
    </NimbusProvider>
  );
};
