import type { Preview } from "@storybook/react-vite";
import addonPerformancePanel, {
  withPerformanceMonitor,
} from "@github-ui/storybook-addon-performance-panel";

import { APCACheck } from "./apca-check";
import { CustomDocsContainer } from "./docs-container";
import { ThemeDecorator } from "./decorators";

const apca = APCACheck("custom", (fontSize: string) => {
  const size = parseFloat(fontSize);
  switch (true) {
    case size >= 32:
      return 45;
    default:
      return 60;
  }
});

const preview: Preview = {
  parameters: {
    addons: [addonPerformancePanel()],
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
      // fail the test runner if a11y violations are found
      test: "error",
    },
    docs: {
      container: CustomDocsContainer,
    },
    options: {
      /* @see https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy#sorting-stories **/
      storySort: {
        order: ["Components", "Patterns", "Utils", "Hooks"],
      },
    },
  },
  tags: ["autodocs", "a11y-test"],
  decorators: [
    (Story, context) => {
      return (
        <ThemeDecorator context={context}>
          <Story />
        </ThemeDecorator>
      );
    },
    withPerformanceMonitor,
  ],
};

export default preview;

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "en",
    toolbar: {
      title: "Locale",
      icon: "globe",
      items: [
        { value: "en", right: "🇺🇸", title: "English (en)" },
        { value: "de", right: "🇩🇪", title: "German (de)" },
        { value: "es", right: "🇪🇸", title: "Spanish (es)" },
        { value: "fr-FR", right: "🇫🇷", title: "French (fr-FR)" },
        { value: "pt-BR", right: "🇧🇷", title: "Portuguese (pt-BR)" },
      ],
      dynamicTitle: true,
    },
  },
};
