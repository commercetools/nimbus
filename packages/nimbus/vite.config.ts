import { fileURLToPath } from "node:url";
import { glob } from "glob";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import type { LibraryFormats } from "vite";
import type { RollupLog, LoggingFunction } from "rollup";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import treeShakeable from "rollup-plugin-tree-shakeable";
import { analyzer } from "vite-bundle-analyzer";
import { LOCALE_BCP47_CODES } from "../i18n/scripts/locales";

// Turns every index file inside src/components, along with the main `src/index.ts` and `setup-jsdom-polyfills` entrypoints, into separate entry-points/files for better tree-shaking in consuming apps.
// Defining entrypoints and chunking files is recommended over using `output.preserveModules` - https://rollupjs.org/configuration-options/#input
//
// IMPORTANT: Because each component's index.ts becomes a separate chunk, cross-component imports
// within Nimbus MUST import directly from implementation files (e.g., button.tsx, button.types.ts)
// rather than barrel exports (index.ts) to avoid circular chunk dependencies.
// See docs/component-guidelines.md "Cross-Chunk Import Pattern" for details.
const createEntries = async () => {
  // Only index files are turned into entrypoints, as we don't want to include test files, storybook stories, etc.
  const entries = new Map<string, string>();
  // Build a glob containing each index.ts file in src/components or src/patterns
  const componentEntryPoints = await glob(
    "src/{components,patterns}/**/index.ts"
  );
  // Declare an entrypoint for each component's index file. This enables consuming applications to only bundle the components imported into their app, instead of requiring that consumers bundle all components if they use any component.
  for (const file of componentEntryPoints) {
    // Get the name of the folder containing the index file to maintain semi-unique file/entrypoint names
    const fileName = file.split("/").at(-2)?.split(".")[0];
    // Don't create an entrypoint if there is not a file name (should not happen)
    if (!fileName) {
      continue;
    }
    // Set the name of the entrypoint to the folder name, and set its path to the index file in that folder
    entries.set(`${fileName}`, fileURLToPath(new URL(file, import.meta.url)));
  }
  // Declare main entrypoints, which should be defined in the `exports` field in `package.json`
  // The 'index' entrypoint bundles all non-component code (theme, hooks, etc), insuring that all necessary code is published
  entries.set("index", fileURLToPath(new URL("src/index.ts", import.meta.url)));
  // Separate entrypoint for the jest polyfill insures that the cjs version of the polyfill is used
  entries.set(
    "setup-jsdom-polyfills",
    fileURLToPath(new URL("src/test/setup-jsdom-polyfills.ts", import.meta.url))
  );
  // Pass all entrypoints back to config
  return Object.fromEntries(entries);
};

// External dependencies that should not be bundled.
// NOTE: Anything listed in the external array also needs to be listed as a peerDependency & devDependency in its corresponding package.json (exception: "react/jsx-runtime").
const external = [
  // React core
  "react",
  "react-dom",
  "react/jsx-runtime",
  // UI frameworks & styling.
  new RegExp("@chakra-ui/react?[^.].*$"),
  // Slate dependencies for RichTextInput
  // These are externalized because immer (slate's dependency) uses internal singletons that break when bundled
  "slate",
  "slate-react",
  "slate-history",
  "slate-hyperscript",
  // React Aria dependencies
  // Externalized to prevent bundling issues and ensure consistent behavior across the app - ON HOLD
  // "react-aria",
  // "react-aria-components",
  // "react-stately",
  // "@react-aria/interactions",

  // Internal packages
  // TODO: Icons from @commercetools/nimbus-icons should be tree-shakeable, it might make more sense to just bundle the necessary icons with their components, and not care whether this package is installed in consuming apps.
  "@commercetools/nimbus-icons",
  // TODO: @commercetools/nimbus-tokens is really a dev dependency we use to build the theme for chakra's styled-system, which is where we consume tokens from in all components, and in any components that are a child of the NimbusProvider.
  //       We should evaluate whether it's necessary to specify @commercetools/nimbus-tokens as a peer dep, since the styled-system theme is created at build time and exported separately from this package.
  "@commercetools/nimbus-tokens",
];

// Define the config
export default defineConfig(async () => {
  const isWatchMode = process.argv.includes("--watch");
  const isAnalyzeMode = !!process.env.ANALYZE_BUNDLE;

  // Create entries
  const entries = await createEntries();

  const config = {
    plugins: [
      viteTsconfigPaths(),
      react(),
      // Only package locale strings for locales we internationalize in our products
      // Locales are defined in packages/i18n/scripts/locales.ts (single source of truth)
      // https://github.com/commercetools/merchant-center-application-kit/blob/main/packages/i18n/README.md#supported-locales
      // https://react-spectrum.adobe.com/react-aria/internationalization.html#vite
      optimizeLocales.vite({
        locales: LOCALE_BCP47_CODES,
      }),
    ],
    build: {
      // sourcemaps are built into separate files and should therefore be tree-shakeable
      // TODO: confirm that sourcemaps aren't being bundled into prod builds of consuming applications
      sourcemap: true,
      lib: {
        entry: entries,
        name: "nimbus",
        fileName: (format: string, entryName: string) => {
          // `cjs` files need to end in `.cjs` when `type: module` is set in package.json,
          // otherwise you get an error when you `require` them
          const extension = format === "cjs" ? `${format}` : `${format}.js`;
          // Keep main entrypoints at root, put everything else in subfolders
          if (["index", "setup-jsdom-polyfills"].includes(entryName)) {
            return `${entryName}.${extension}`;
          }
          // Put component entries in a components folder
          return `components/${entryName}.${extension}`;
        },
        formats: ["es", "cjs"] satisfies LibraryFormats[],
      },
      rollupOptions: {
        // `treeShakeable` naively adds an @__PURE__ annotation to each top-level module in our `dist`
        // https://github.com/TomerAberbach/rollup-plugin-tree-shakeable?tab=readme-ov-file#why
        plugins: [treeShakeable()],
        external,
        output: {
          // Organize chunk files into chunks subfolder
          chunkFileNames: () => {
            return `chunks/[name]-[hash].[format].js`;
          },
        },
        // Suppress barrel export reexport warnings for compound components
        // These warnings occur due to Nimbus's architectural pattern where compound
        // components (Menu, Accordion, etc.) import from their own ./components/index.ts barrel.
        // Example: accordion.tsx imports from ./components/index.ts, which re-exports accordion.header.tsx
        // This is intentional and safe - it's the documented pattern for compound components.
        // See docs/file-type-guidelines/compound-components.md for details.
        onwarn(warning: RollupLog, warn: LoggingFunction) {
          if (
            warning.message?.includes("reexported through module") &&
            warning.message?.includes("/components/index.ts")
          ) {
            // Suppress warnings specifically for:
            // 1. Compound component internal barrels: src/components/{component}/components/index.ts
            // 2. Main components barrel: src/components/index.ts
            // Both are intentional architectural patterns in Nimbus.
            return;
          }
          // Pass all other warnings through
          warn(warning);
        },
        // Shake that tree, rollup
        treeshake: true,
        // Reduce memory usage during build
        maxParallelFileOps: 5,
      },
    },
    // Ensure CommonJS and ES modules are handled properly
    target: "esnext",
    assetsInclude: ["/sb-preview/runtime.js"],
  };

  if (!isWatchMode) {
    config.plugins.push(
      dts({
        rollupTypes: false,
        include: ["src/**/*"],
        // Don't declare types for stories and tests in bundle.
        exclude: ["src/**/*.stories.*", "src/**/*.spec.*", "src/test/**/*"],
        // Add triple-slash reference to ROOT index.d.ts only for Chakra augmentation
        beforeWriteFile: (filePath, content) => {
          // Only add reference to the root dist/index.d.ts (not nested component/pattern index files)
          // Match paths like "dist/index.d.ts" or "/some/path/dist/index.d.ts"
          if (filePath.match(/\/dist\/index\.d\.ts$/)) {
            return {
              filePath,
              content: `/// <reference path="./types/chakra-augmentation.d.ts" />\n\n${content}`,
            };
          }
        },
      })
    );
    // Run analyzer if the ANALYZE_BUNDLE env var is present
    if (isAnalyzeMode) {
      config.plugins.push(analyzer());
    }
  }
  return config;
});
