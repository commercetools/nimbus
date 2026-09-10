import type { StorybookConfig } from "@storybook/react-vite";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";

/**
 * Resolve the absolute path to a package. Needed inside a monorepo so Storybook
 * finds addons from the workspace root. Uses import.meta.resolve for ESM
 * (required by Storybook 10+).
 */
function getAbsolutePackagePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    getAbsolutePackagePath("@storybook/addon-a11y"),
    getAbsolutePackagePath("@vueless/storybook-dark-mode"),
    getAbsolutePackagePath("@storybook/addon-vitest"),
    getAbsolutePackagePath("@storybook/addon-docs"),
  ],
  framework: {
    name: getAbsolutePackagePath("@storybook/react-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  // Unlike packages/nimbus, viz needs no source-vs-dist barrel alias: stories
  // live inside the package and import sibling source directly, so there is no
  // `@commercetools/nimbus-viz` self-reference to switch. Tests run against
  // source. We keep only nimbus's rolldown lazy-barrel workaround, which the
  // `export *` barrel here would otherwise trip in the production build.
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      build: {
        rolldownOptions: { experimental: { lazyBarrel: false } },
      },
    }),
};

export default config;
