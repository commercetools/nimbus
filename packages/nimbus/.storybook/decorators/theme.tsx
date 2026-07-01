import React from "react";
import { type StoryContext } from "@storybook/react-vite";
import { DARK_MODE_EVENT_NAME } from "@vueless/storybook-dark-mode";
import { useEffect, useState } from "react";
import { addons } from "storybook/preview-api";
import { NimbusProvider, useColorMode } from "@commercetools/nimbus";

// get channel to listen to event emitter
const channel = addons.getChannel();

// Initial theme from the addon's persisted preference, to avoid a load flash.
const readInitialDark = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("sb-addon-themes-3") || "{}").current ===
      "dark"
    );
  } catch {
    return false;
  }
};

/**
 * Drives next-themes from the toolbar toggle so it is the sole owner of the
 * color-mode class + `color-scheme` on <html> (as in a real app).
 *
 * Also clears the addon's stray <body> class: its preview-side entry stamps
 * `light`/`dark` onto <body> once on load and never updates it. Since Chakra's
 * `_light`/`_dark` conditionals match any ancestor, a stale `body.light` under
 * `html.dark` wins for tokens like `neutral.1` and renders inputs light on a
 * dark page. See PR #1684.
 */
const ColorModeSync = ({ isDark }: { isDark: boolean }) => {
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode(isDark ? "dark" : "light");
    document.body.classList.remove("light", "dark");
  }, [isDark, setColorMode]);
  return null;
};

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
  const [isDark, setDark] = useState(readInitialDark);
  const theme = isDark ? "dark" : "light";
  const { locale } = context.globals;

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark);
    return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
  }, []);

  return (
    <NimbusProvider locale={locale} defaultTheme={theme}>
      <ColorModeSync isDark={isDark} />
      {children}
    </NimbusProvider>
  );
};
