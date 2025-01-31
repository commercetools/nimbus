import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
} from "vitest/config";
import { baseConfig } from "./vite.config";
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";
import path from "path";

export default mergeConfig(
  baseConfig,
  defineConfig({
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
      setupFiles: ["./.storybook/vitest.setup.ts"],
      // make vitest fn's available globally (no need to import them)
      globals: true,
      // config for running tests in one or multiple *real* browsers
      browser: {
        enabled: true,
        // ... use playwright to run tests
        provider: "playwright",
        // ... only in chromium
        instances: [{ browser: "chromium" }],
        // ... do not open the browser-ui
        headless: true,
        // ... do not capture screenshots on failure
        screenshotFailures: false,
      },
      coverage: {
        exclude: [
          ...coverageConfigDefaults.exclude,
          "**/.storybook/**",
          // 👇 This pattern must align with the `stories` property of your `.storybook/main.ts` config
          "**/*.stories.*",
          // 👇 This pattern must align with the output directory of `storybook build`
          "**/storybook-static/**",
        ],
      },
    },
  })
);
