import { fileURLToPath } from "node:url";
import { glob } from "glob";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import type { LibraryFormats } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import treeShakeable from "rollup-plugin-tree-shakeable";
import { analyzer } from "vite-bundle-analyzer";

// Turns every index file inside src/components, along with the main `src/index.ts` and `setup-jsdom-polyfills` entrypoints, into separate entry-points/files for better tree-shaking in consuming apps.
// Defining entrypoints and chunking files is recommended over using `output.preserveModules` - https://rollupjs.org/configuration-options/#input
const createEntries = async () => {
  // Only index files are turned into entrypoints, as we don't want to include test files, storybook stories, etc.
  const entries = new Map<string, string>();
  // Build a glob containing each index.ts file in src/components
  const componentEntryPoints = await glob("src/components/**/index.ts");
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
  "react-intl",
  "react/jsx-runtime",

  // UI frameworks & styling.
  new RegExp("@chakra-ui/react?[^.].*$"),
  // TODO: evaluate whether it makes more sense for `react-aria` and related packages to be bundled w/the library as they are currently,
  //       or declared as peer deps to reduce unintentional code duplication if a consuming app already has react-aria related libraries installed (eg @internationalized/date or react-stately).

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
      // https://github.com/commercetools/merchant-center-application-kit/blob/main/packages/i18n/README.md#supported-locales
      // https://react-spectrum.adobe.com/react-aria/internationalization.html#vite
      optimizeLocales.vite({
        locales: ["en-US", "fr-FR", "pt-BR", "es-ES", "de-DE"],
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
        rollupTypes: true,
        include: ["src/**/*"],
        // Don't declare types for stories and tests in bundle.
        // This should not be necessary since we do not export these file types in our indexes,
        // and `rollupTypes: true` means types are built for the rollup output in `/dist`, not the files in `/src`, but it's good to have a safeguard.
        exclude: [
          "src/**/*.stories.*",
          "src/**/*.test.*",
          "src/**/*.spec.*",
          "src/test/**/*",
        ],
      })
    );
    // Run analyzer if the ANALYZE_BUNDLE env var is present
    if (isAnalyzeMode) {
      config.plugins.push(analyzer());
    }
  }
  return config;
});
