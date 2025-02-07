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
    getAbsolutePackagePath("@storybook/addon-a11y"),
    getAbsolutePackagePath("storybook-dark-mode"),
    getAbsolutePackagePath("@storybook/experimental-addon-test"),
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
  typescript: {
    reactDocgen: "react-docgen-typescript",
    // Provide your own options if necessary.
    // See https://storybook.js.org/docs/configure/typescript for more information.
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },

      // Extend if needed...
      propFilter: (prop) => {
        // ... common props that every component may have
        const whitelistedProps = ["ref", "colorScheme", "asChild"];

        // ... props coming from the bleh-ui package
        const isOneOfOurTypes = !!prop.parent?.fileName.includes("bleh-ui/src");

        // ... props coming from the react-aria package
        const isReactAriaProp =
          !!prop.parent?.fileName.includes("@react-types");

        return (
          isOneOfOurTypes ||
          isReactAriaProp ||
          whitelistedProps.includes(prop.name)
        );
      },
    },
  },
};
export default config;
