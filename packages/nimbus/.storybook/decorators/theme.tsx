import React from "react";
import { type StoryContext } from "@storybook/react-vite";
import { DARK_MODE_EVENT_NAME } from "@vueless/storybook-dark-mode";
import { useEffect, useState } from "react";
import { addons } from "storybook/preview-api";
import { NimbusProvider } from "@commercetools/nimbus";
import type { NimbusRouterConfig } from "@commercetools/nimbus";

// get channel to listen to event emitter
const channel = addons.getChannel();

/**
 * A no-op router so React Aria link components (e.g. `Tabs` link tabs and
 * `TabNav` items, which render `<a>` elements) are intercepted by the router
 * instead of performing a real browser navigation inside the Storybook iframe.
 * Without it, clicking a link tab navigates the iframe (the "URL error") and
 * stateful click handlers never get to switch the active item.
 */
const noopRouter: NimbusRouterConfig = { navigate: () => {} };

/**
 * Theme decorator that synchronizes the Storybook UI theme with the
 * dark-mode toggle and provides locale context from Storybook globals.
 * This ensures that all component stories are rendered within the correct
 * theme and i18n context, providing a consistent visual experience across the
 * entire Storybook interface.
 *
 * The decorator listens for theme changes via the Storybook event channel
 * and wraps all stories with the NimbusProvider configured with the current
 * theme and locale. NimbusProvider provides both theme context (via
 * ChakraProvider) and i18n context (via NimbusI18nProvider → React Aria's
 * I18nProvider), which components access via useLocale() from react-aria-components.
 *
 * This approach ensures that components always render with the correct theme
 * and locale applied, even when toggled at runtime or persisted across
 * browser sessions.
 */
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
      localStorage.getItem("sb-addon-themes-3") || "{}"
    );

    setDark(current === "dark");

    channel.on(DARK_MODE_EVENT_NAME, (darkMode) => {
      setDark(darkMode);
    });

    return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <NimbusProvider locale={locale} defaultTheme={theme} router={noopRouter}>
      {children}
    </NimbusProvider>
  );
};
