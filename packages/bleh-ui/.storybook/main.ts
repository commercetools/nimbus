import type { StorybookConfig } from "@storybook/react-vite";

import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePackagePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    getAbsolutePackagePath("@storybook/addon-essentials"),
    getAbsolutePackagePath("@storybook/addon-interactions"),
    getAbsolutePackagePath("storybook-dark-mode"),
  ],
  framework: {
    name: getAbsolutePackagePath("@storybook/react-vite"),
    options: {},
  },
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
  core: {
    disableTelemetry: true,
  },
};
export default config;
