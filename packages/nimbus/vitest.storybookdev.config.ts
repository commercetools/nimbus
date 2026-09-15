/**
 * Storybook test config for local development — runs tests against source files
 * instead of the built bundle. This skips the need to `pnpm build` before testing.
 *
 * Use `pnpm test:storybook:dev` to run.
 * The standard `pnpm test:storybook` still uses the built bundle for CI/verification.
 */
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
import type { Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Signal to .storybook/main.ts to suppress the "PRODUCTION/TEST" log.
// Safe to set here because this config is loaded from a separate root
// (vitest.dev.config.mts) that never includes the production storybook project.
process.env.VITEST_USE_SOURCE = "true";

/**
 * Vite plugin that forces @commercetools/nimbus to resolve to source files.
 * This runs as a plugin config hook, ensuring it takes effect after
 * storybook's viteFinal (which leaves the alias empty in test mode).
 */
function sourceAliasPlugin(): Plugin {
  return {
    name: "nimbus-source-alias",
    config() {
      console.log(
        "[Storybook] Running in DEV TEST (using source files, no build required)"
      );
      return {
        resolve: {
          alias: {
            "@commercetools/nimbus": path.resolve(__dirname, "src"),
          },
        },
      };
    },
  };
}

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
    cacheDir: ".vitest-cache-dev",
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
        configDir: path.join(__dirname, ".storybook"),
        storybookScript: "pnpm storybook --ci",
      }),
      // Must come after storybookTest so the alias wins
      sourceAliasPlugin(),
    ],
    test: {
      name: "storybook-dev",
      setupFiles: ["./.storybook/vitest.setup.ts"],
      globals: true,
      testTimeout: 60000,
      hookTimeout: 60000,
      // Retry once for flaky browser tests (e.g. Slate/Tiptap init races)
      retry: 1,
      // (moved out of `browser` for Vitest 5: `BrowserConfigOptions` no
      // longer has its own `isolate` — it's the top-level test option)
      isolate: false,
      // (moved out of `browser` for Vitest 5: the browser server now
      // shares the top-level `api` option instead of its own nested one)
      api: {
        port: 63316,
      },
      browser: {
        enabled: true,
        provider: playwright({
          contextOptions: {
            locale: "en-US",
          },
        }),
        instances: [{ browser: "chromium" }],
        headless: true,
        screenshotFailures: false,
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
  };

  return mergeConfig(baseConfig, overrides);
});
