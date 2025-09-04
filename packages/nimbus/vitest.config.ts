/// <reference types="@vitest/browser/providers/playwright" />
import {
  coverageConfigDefaults,
  defineConfig,
  mergeConfig,
} from "vitest/config";
import createBaseConfig from "./vite.config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import path from "path";

export default defineConfig(async () => {
  const baseConfig = await createBaseConfig({
    command: "build",
    mode: "production",
  });

  return mergeConfig(
    baseConfig,
    defineConfig({
      // cache directory for better performance
      cacheDir: ".vitest-cache",
      // Fix for CI dependency optimization issues
      optimizeDeps: {
        include: [
          "@chakra-ui/react",
          "@chakra-ui/react/kbd",
          "@storybook/react-vite",
          "storybook/test",
          /*           "@mdx-js/react",
          "markdown-to-jsx", */
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
        setupFiles: ["./.storybook/vitest.setup.ts"],
        // make vitest fn's available globally (no need to import them)
        globals: true,
        // Increase timeouts for browser stability
        testTimeout: 30000,
        hookTimeout: 30000,
        // config for running tests in one or multiple *real* browsers
        browser: {
          enabled: true,
          // ... use playwright to run tests
          provider: "playwright",
          // ... only in chromium
          instances: [
            {
              browser: "chromium",
              context: {
                locale: "en-US",
              },
            },
          ],
          // ... do not open the browser-ui
          headless: true,
          // ... do not capture screenshots on failure
          screenshotFailures: false,
          // This 'helps with resource usage' according to claude
          isolate: false,
          api: {
            // Port from failing test error output
            // https://github.com/commercetools/nimbus/actions/runs/15910355075/job/44875855480#step:8:92
            port: 63315,
          },
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
    })
  );
});
