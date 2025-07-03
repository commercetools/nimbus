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

// Turns every index file inside the src folder into an entry point for tree-shaking.
// This is the recommended way, instead of using `output.preserveModules` - https://rollupjs.org/configuration-options/#input
// Only index files are turned into entrypoints, as we don't want to include test files, storybook stories, etc.
const createEntries = async () => {
  const entries = new Map<string, string>();
  // Build a glob containing each index.ts file in src/components
  const componentEntryPoints = await glob("src/components/**/index.ts");
  // Declare an entrypoint for each component's index file
  for (const file of componentEntryPoints) {
    // Get the name of the folder containing the index file to maintain semi-unique file/entrypooint names
    const fileName = file.split("/").at(-2)?.split(".")[0];
    // Don't create an entrypoint if there is not a file name (should not happen)
    if (!fileName) {
      continue;
    }
    // Set the name of the entrypoint to the folder name, and set its path to the index file in that folder
    entries.set(`${fileName}`, fileURLToPath(new URL(file, import.meta.url)));
  }
  // Declare main entrypoints, which should be defined in the `exports` field in `package.json`
  entries.set("index", fileURLToPath(new URL("src/index.ts", import.meta.url)));
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
  "@chakra-ui/react",
  // "react-aria",
  // "react-aria-components",
  // "react-stately",
  // "@emotion/is-prop-valid",

  // Utility libraries
  // "react-use",
  // "next-themes",

  // Internal packages
  "@commercetools/nimbus-icons",
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
      // https://react-spectrum.adobe.com/react-aria/internationalization.html#vite
      optimizeLocales.vite({
        locales: ["en-US", "fr-FR", "pt-BR", "es-ES", "de-DE"],
      }),
    ],
    build: {
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
  // Add DTS plugin conditionally with optimizations
  if (!isWatchMode) {
    config.plugins.push(
      dts({
        rollupTypes: true,
        include: ["src/**/*"],
        // Don't declare types for stories and tests in bundle
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
