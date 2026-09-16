import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
  type ViteUserConfig,
} from "vitest/config";
import createBaseConfig from "./vite.config.ts";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM compatibility: define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async () => {
  const baseConfig = await createBaseConfig({
    command: "build",
    mode: "production",
  });

  // Typed explicitly (instead of wrapping in `defineConfig(...)`) so
  // `mergeConfig`'s overload resolution isn't fed the ambiguous
  // union/function-inclusive return type `defineConfig()` produces here —
  // see https://github.com/vuejs/create-vue/issues/328 for the same
  // TS2345 "not assignable to parameter of type 'never'" pattern.
  const overrides: ViteUserConfig = {
    // cache directory for better performance
    cacheDir: ".vitest-cache",
    // Fix for CI dependency optimization issues
    optimizeDeps: {
      include: [
        "@chakra-ui/react",
        "@chakra-ui/react/kbd",
        "@storybook/react-vite",
        "storybook/test",
      ],
    },
    plugins: [
      storybookTest({
        // The location of your Storybook config, main.js|ts
        configDir: path.join(__dirname, ".storybook"),
        // This should match your package.json script to run Storybook
        // The --ci flag will skip prompts and not open a browser
        storybookScript: "pnpm storybook --ci",
      }),
    ],
    test: {
      name: "storybook",
      setupFiles: ["./.storybook/vitest.setup.ts"],
      // make vitest fn's available globally (no need to import them)
      globals: true,
      // Increase timeouts for browser stability and complex stories in CI
      testTimeout: 60000, // 60 seconds for slow stories (LocalizedField, DateRangePicker)
      hookTimeout: 60000,
      // Retry once for flaky browser tests (e.g. Slate/Tiptap init races)
      retry: 1,
      // This 'helps with resource usage' according to claude
      // (moved out of `browser` for Vitest 5: `BrowserConfigOptions` no
      // longer has its own `isolate` — it's the top-level test option)
      isolate: false,
      // Port from failing test error output
      // https://github.com/commercetools/nimbus/actions/runs/15910355075/job/44875855480#step:8:92
      // (moved out of `browser` for Vitest 5: the browser server now shares
      // the top-level `api` option instead of its own nested one)
      api: {
        port: 63315,
      },
      // config for running tests in one or multiple *real* browsers
      browser: {
        enabled: true,
        // ... use playwright to run tests with locale set via contextOptions
        provider: playwright({
          contextOptions: {
            locale: "en-US",
          },
        }),
        // ... only in chromium
        instances: [{ browser: "chromium" }],
        // ... do not open the browser-ui
        headless: true,
        // ... do not capture screenshots on failure
        screenshotFailures: false,
        // Pin an explicit desktop viewport. Left unset, Vitest falls back to
        // its own default of a mobile 414x896 (see `resolved.browser.viewport`
        // in vitest's config resolution) — confirmed by a controlled
        // before/after comparison that under the pre-bump stack
        // (vitest@4.1.11 / @vitest/browser@4.1.10) these `isolate:false`
        // browser-mode tests actually ran at an undocumented ~1200x900,
        // while the identical config under vitest@5 measures
        // window.innerWidth === 414. 414px is below Nimbus's `md` (768px)
        // breakpoint, which collapses PageContent's 2-column grid to 1
        // column (breaking StickySidebar's layout assertions) and leaves
        // less width than RichTextInput's toolbar needs (breaking
        // LocalizedField CustomWidth's "full width is wider" comparison).
        // 1280x720 (Playwright's own default context viewport) restores a
        // desktop-sized surface for these stories, standard rather than
        // replicating the old accidental 1200x900.
        viewport: { width: 1280, height: 720 },
      },
      coverage: {
        exclude: [
          ...coverageConfigDefaults.exclude,
          "**/.storybook/**",
          // 👇 This pattern must align with the `stories` property of your `.storybook/main.ts` config
          "./src/**/*.stories.*",
          // 👇 This pattern must align with the output directory of `storybook build`
          "**/storybook-static/**",
        ],
      },
    },
  };

  return mergeConfig(baseConfig, overrides);
});
