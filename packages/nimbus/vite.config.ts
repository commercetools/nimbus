import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import type { LibraryFormats } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Turns every file inside the lib folder into an entry point for tree-shaking.
// This is the recommended way, instead of using `output.preserveModules` - https://rollupjs.org/configuration-options/#input
// We have to be careful with the files we include here, as we don't want to include test files, storybook stories and files that contain only types.
const createEntries = async () => {
  const entries = new Map<string, string>();
  const componentEntryPoints = await glob("src/components/**/index.ts");
  for (const file of componentEntryPoints) {
    const fileName = file.split("/").at(-2)?.split(".")[0];

    if (!fileName) {
      continue;
    }
    entries.set(`${fileName}`, fileURLToPath(new URL(file, import.meta.url)));
  }
  entries.set("index", fileURLToPath(new URL("src/index.ts", import.meta.url)));
  entries.set(
    "setup-jsdom-polyfills",
    fileURLToPath(new URL("src/test/setup-jsdom-polyfills.ts", import.meta.url))
  );

  const res = Object.fromEntries(entries);

  return res;
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

// Remove createBaseConfig as we're inlining everything

export default defineConfig(async () => {
  const isWatchMode = process.argv.includes("--watch");

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
        external,
        output: {
          // Organize chunk files into chunks subfolder
          chunkFileNames: (chunkInfo: { name?: string }) => {
            return `chunks/[name]-[hash].js`;
          },
        },
        // Performance optimizations
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
        logLevel: "silent",
        // Only generate types for the main index file
        include: ["src/**/*"],
        exclude: [
          "src/**/*.stories.*",
          "src/**/*.test.*",
          "src/**/*.spec.*",
          "src/test/**/*",
        ],
      })
    );
  }

  return config;
});
