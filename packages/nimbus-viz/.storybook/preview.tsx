import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useDarkMode } from "@vueless/storybook-dark-mode";
import { ChartThemeProvider, useChartTheme } from "../src";

// Paints the story canvas from the chart theme so the background follows the
// dark-mode toggle.
function ChartCanvas({ children }: { children: ReactNode }) {
  const roles = useChartTheme();
  return (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "1rem",
        background: roles.surfacePage,
        color: roles.ink,
      }}
    >
      {children}
    </div>
  );
}

const preview: Preview = {
  parameters: {
    darkMode: { stylePreview: false, classTarget: "html" },
    a11y: { test: "error" },
    options: { storySort: { order: ["Charts"] } },
  },
  tags: ["a11y-test"],
  decorators: [
    (Story) => {
      const isDark = useDarkMode();
      return (
        <ChartThemeProvider mode={isDark ? "dark" : "light"}>
          <ChartCanvas>
            <Story />
          </ChartCanvas>
        </ChartThemeProvider>
      );
    },
  ],
};

export default preview;
