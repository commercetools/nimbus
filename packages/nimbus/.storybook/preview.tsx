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
      // ThemeDecorator owns the preview's color mode via next-themes.
      // stylePreview: false stops the addon from also theming the preview iframe
      // and fighting it; classTarget applies to the Storybook chrome. See PR #1684.
      stylePreview: false,
      classTarget: "html",
    },
    chromatic: { disableSnapshot: true },
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
  // Chromatic snapshots at the end of the play function, so a focus-visible ring
  // left on the last-interacted element bleeds into the diff. Blur it unless the
  // story opts in via the `preserveFocusRing` parameter (i.e. it is testing focus
  // or its final state legitimately keeps focus).
  async afterEach(context) {
    if (context.parameters?.preserveFocusRing) return;
    const active = context.canvasElement.ownerDocument.activeElement;
    if (active instanceof HTMLElement) active.blur();
  },
  tags: ["autodocs", "a11y-test"],
  decorators: [
    (Story, context) => {
      // Outline doesn't affect layout, so Chromatic's #storybook-root crop clips it;
      // This wrapper adds space inside that boundary where body/padded-layout padding can't reach.
      const needsSnapshotPadding = context.parameters?.preserveFocusRing;
      return (
        <ThemeDecorator context={context}>
          {needsSnapshotPadding ? (
            <div style={{ padding: "1rem", width: "fit-content" }}>
              {/* room for outline in Chromatic crop */}
              <Story />
            </div>
          ) : (
            <Story />
          )}
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
