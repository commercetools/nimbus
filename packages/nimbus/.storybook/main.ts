import type { StorybookConfig } from "@storybook/react-vite";
import { join, dirname, resolve } from "path";
import { mergeConfig } from "vite";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePackagePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
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
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    // Causes vite 'CJS build deprecated' warning
    // https://github.com/storybookjs/storybook/issues/26291#issuecomment-2246961443
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

        // ... props coming from the nimbus package
        const isOneOfOurTypes = !!prop.parent?.fileName.includes("nimbus/src");

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
  async viteFinal(config, { configType }) {
    // Only use source alias during development (pnpm start:storybook)
    // This enables HMR while ensuring tests use the built bundle
    // Check both configType and VITEST environment to ensure tests use built bundle
    // Vitest automatically sets VITEST_WORKER_ID when running tests
    const isTest =
      !!process.env.VITEST_WORKER_ID || process.env.VITEST === "true";
    const isDevelopment = configType === "DEVELOPMENT" && !isTest;

    // Type safety: validate configType
    if (configType !== "DEVELOPMENT" && configType !== "PRODUCTION") {
      console.warn(
        `[Storybook] Unexpected configType: "${configType}". Expected "DEVELOPMENT" or "PRODUCTION".`
      );
    }

    // Developer visibility: log which mode is active
    const mode = isDevelopment
      ? "DEVELOPMENT (HMR enabled, using source files)"
      : "PRODUCTION/TEST (using built bundle)";
    console.log(`[Storybook] Running in ${mode}`);

    return mergeConfig(config, {
      resolve: {
        alias: isDevelopment
          ? {
              "@commercetools/nimbus": resolve(__dirname, "../src"),
            }
          : {},
      },
    });
  },
};
export default config;
