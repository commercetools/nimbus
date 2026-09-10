import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
} from "vitest/config";
import createBaseConfig from "./vite.config.ts";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Browser-mode story tests, mirroring packages/nimbus/vitest.storybook.config.ts.
// Every *.stories.tsx runs as a portable story in headless Chromium via
// Playwright. Unlike nimbus these run against SOURCE (no dist barrel alias) —
// stories import sibling source directly, so there is nothing to pin to dist.
export default defineConfig(async () => {
  const baseConfig = await createBaseConfig({
    command: "build",
    mode: "production",
  });

  return mergeConfig(
    baseConfig,
    defineConfig({
      cacheDir: ".vitest-cache",
      plugins: [
        storybookTest({
          configDir: path.join(__dirname, ".storybook"),
          storybookScript: "pnpm storybook --ci",
        }),
      ],
      test: {
        name: "nimbus-viz-storybook",
        setupFiles: ["./.storybook/vitest.setup.ts"],
        globals: true,
        testTimeout: 60000,
        hookTimeout: 60000,
        retry: 1,
        browser: {
          enabled: true,
          provider: playwright({ contextOptions: { locale: "en-US" } }),
          instances: [{ browser: "chromium" }],
          headless: true,
          screenshotFailures: false,
          isolate: false,
          // Distinct from nimbus's 63315 so both can run in one CI invocation.
          api: { port: 63317 },
        },
        coverage: {
          exclude: [
            ...coverageConfigDefaults.exclude,
            "**/.storybook/**",
            "./src/**/*.stories.*",
            "**/storybook-static/**",
          ],
        },
      },
    })
  );
});
