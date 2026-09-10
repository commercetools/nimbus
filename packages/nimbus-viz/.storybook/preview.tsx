import type { Preview } from "@storybook/react-vite";
import { useDarkMode } from "@vueless/storybook-dark-mode";
import { ChartThemeProvider, ColorScaleProvider } from "../src";

// A stable entity→color domain so a series keeps the same hue across charts
// (carried over from the retired gallery). Charts read colors from
// ChartThemeProvider; series colors come from ColorScaleProvider.
const COLOR_DOMAIN = [
  "rev",
  "cost",
  "profit",
  "New",
  "Returning",
  "Wholesale",
  "EU",
  "US",
  "Web",
  "Mobile",
  "Marketplace",
  "POS",
  "Partner",
];

const preview: Preview = {
  parameters: {
    // ChartThemeProvider owns the preview's color mode; stop the addon from
    // also theming the iframe and fighting it. classTarget themes the chrome.
    darkMode: {
      stylePreview: false,
      classTarget: "html",
    },
    a11y: {
      // fail the test runner if a11y violations are found
      test: "error",
    },
    options: {
      storySort: { order: ["Charts"] },
    },
  },
  tags: ["a11y-test"],
  decorators: [
    (Story) => {
      const isDark = useDarkMode();
      return (
        <ChartThemeProvider mode={isDark ? "dark" : "light"}>
          <ColorScaleProvider domain={COLOR_DOMAIN}>
            <div style={{ padding: "1rem" }}>
              <Story />
            </div>
          </ColorScaleProvider>
        </ChartThemeProvider>
      );
    },
  ],
};

export default preview;
