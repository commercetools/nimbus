import { fileURLToPath } from "node:url";
import { glob } from "glob";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import type { LibraryFormats, PluginOption, Rollup } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { analyzer } from "vite-bundle-analyzer";
import { LOCALE_BCP47_CODES } from "../i18n/scripts/locales.mts";

/**
 * Builds the entry map for the library build.
 *
 * Each component's `index.ts` (under `src/components` or `src/patterns`)
 * becomes its own entry, plus `src/index.ts` and the jsdom polyfill.
 * Per-component splitting lets consumers tree-shake to only what they use.
 * Recommended over `output.preserveModules` —
 * https://rollupjs.org/configuration-options/#input
 *
 * **Important:** because each component's index becomes its own chunk,
 * cross-component imports inside Nimbus must target implementation files
 * (`button.tsx`), not barrel exports (`index.ts`), to avoid circular
 * chunk dependencies. See `docs/component-guidelines.md` →
 * "Cross-Chunk Import Pattern".
 */
const createEntries = async () => {
  const entries = new Map<string, string>();
  const componentEntryPoints = await glob(
    "src/{components,patterns}/**/index.ts"
  );
  for (const file of componentEntryPoints) {
    // Use the containing folder name as the entry name (semi-unique).
    const fileName = file.split("/").at(-2)?.split(".")[0];
    if (!fileName) {
      continue;
    }
    entries.set(`${fileName}`, fileURLToPath(new URL(file, import.meta.url)));
  }
  // Main entries — must match the `exports` field in `package.json`.
  // `index` bundles all non-component code (theme, hooks, etc).
  entries.set("index", fileURLToPath(new URL("src/index.ts", import.meta.url)));
  // Theme-only entry (tokens/recipes/config — no React components, no DOM
  // side effects). Consumers' `chakra typegen` postinstall hook targets this
  // instead of `index`, since bundling the full component library (React,
  // markdown, icons, etc.) for typegen crashes: it forces `chakra-cli` to
  // fully evaluate browser-only code (e.g. `document.createElement` at
  // module scope) in a headless Node sandbox with no DOM.
  //
  // The `postinstall` script in package.json still ends in `|| true`: theme
  // typegen is a nice-to-have (better editor autocomplete for theme tokens),
  // not something a consumer's install may ever fail on. If this entry ever
  // regresses back to crashing, `|| true` intentionally keeps that failure
  // silent rather than breaking `pnpm install` for every consumer — the cost
  // is no error trail, so if theme typegen stops working, this comment (and
  // the entry above) is where to look first.
  entries.set(
    "theme",
    fileURLToPath(new URL("src/theme/index.ts", import.meta.url))
  );
  // Separate entry so the jest polyfill ships as CJS.
  entries.set(
    "setup-jsdom-polyfills",
    fileURLToPath(new URL("src/test/setup-jsdom-polyfills.ts", import.meta.url))
  );
  // Bundler plugins for optional-dependency resolution (build-time only,
  // no Nimbus runtime pulled in).
  entries.set(
    "plugins/webpack",
    fileURLToPath(new URL("src/plugins/webpack.ts", import.meta.url))
  );
  entries.set(
    "plugins/vite",
    fileURLToPath(new URL("src/plugins/vite.ts", import.meta.url))
  );
  entries.set(
    "plugins/stub",
    fileURLToPath(new URL("src/plugins/stub.ts", import.meta.url))
  );
  return Object.fromEntries(entries);
};

/**
 * External (peer) dependencies — not bundled into the nimbus dist.
 *
 * Anything externalized must also be a peerDependency & devDependency in this
 * package's `package.json`.
 */
const external = [
  // Node built-ins — the plugin entries use `node:module` (createRequire) and
  // must not be browser-externalized by Vite, otherwise the built output
  // replaces them with an empty shim and `isNimbusResolvable` always fails.
  /^node:/,
  // React, including subpaths such as `react/jsx-runtime` and `react-dom/client`.
  /^react(-dom)?(\/.+)?$/,
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
];

// Define the config
export default defineConfig(async () => {
  const isWatchMode = process.argv.includes("--watch");
  const isAnalyzeMode = !!process.env.ANALYZE_BUNDLE;

  // Create entries
  const entries = await createEntries();

  const config = {
    // Typed as `PluginOption[]` so we can `.push(...)` later (dts/analyzer)
    // without TS narrowing the element type to the first plugin's literal shape.
    plugins: [
      react(),
      // Only package locale strings for locales we internationalize in our products
      // Locales are defined in packages/i18n/scripts/locales.mts (single source of truth)
      // https://github.com/commercetools/merchant-center-application-kit/blob/main/packages/i18n/README.md#supported-locales
      // https://react-spectrum.adobe.com/react-aria/internationalization.html#vite
      optimizeLocales.vite({
        locales: LOCALE_BCP47_CODES,
      }),
    ] as PluginOption[],
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
          if (["index", "theme", "setup-jsdom-polyfills"].includes(entryName)) {
            return `${entryName}.${extension}`;
          }
          // Plugin entries keep their plugins/ prefix
          if (entryName.startsWith("plugins/")) {
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
          // Keep chunks out of dist/ root so entry points are easier to find.
          // `[format]` renders as `es`/`cjs` in this lib build, so chunks end
          // in `.es.js`/`.cjs.js`. `scripts/check-bundler-compat.mjs` scans
          // the ESM chunks and fails if it finds none, so a naming change
          // shows up there. Entry-point filenames come from `lib.fileName`.
          chunkFileNames: "chunks/[name]-[hash].[format].js",
        },
        /**
         * Suppress reexport warnings for our compound-component pattern.
         *
         * Compound components (Menu, Accordion, etc.) import from their own
         * `./components/index.ts` barrel — e.g. `accordion.tsx` imports from
         * `./components/index.ts` which re-exports `accordion.header.tsx`.
         * This is intentional and documented in
         * `docs/file-type-guidelines/compound-components.md`.
         */
        onwarn(warning: Rollup.RollupLog, warn: Rollup.LoggingFunction) {
          if (
            warning.message?.includes("reexported through module") &&
            warning.message?.includes("/components/index.ts")
          ) {
            return;
          }
          warn(warning);
        },
        treeshake: true,
        // Reduce memory usage during build
        maxParallelFileOps: 5,
      },
    },
    target: "esnext",
    assetsInclude: ["/sb-preview/runtime.js"],
    resolve: {
      tsconfigPaths: true,
      alias: [
        /**
         * react-aria, react-aria-components and react-stately import
         * `useSyncExternalStore` from `use-sync-external-store/shim`, a CJS
         * polyfill for React < 18 that returns React's own hook on newer
         * versions. Nimbus requires React 19, so import the hook from `react`
         * directly. This keeps CJS code that calls `require("react")` out of
         * the dist, which a pure-ESM build can't express without an interop
         * facade that webpack rejects.
         */
        {
          find: /^use-sync-external-store\/shim(\/index\.js)?$/,
          replacement: "react",
        },
      ],
    },
  };

  if (!isWatchMode) {
    config.plugins.push(
      dts({
        include: ["src/**/*"],
        // Don't declare types for stories and tests in bundle.
        // Note: src/test/setup-jsdom-polyfills.ts is a published entry point
        // (see createEntries above), so it must be type-declared — only the
        // other test-only files in src/test/ are excluded.
        //
        // Keep this list in sync with scripts/postbuild-types.mjs: anything
        // emitted under dist/test/ (i.e. a src/test/ file not excluded here)
        // gets silently deleted when the postbuild script runs `rmSync` on
        // dist/test/ after relocating setup-jsdom-polyfills.d.ts.
        exclude: [
          "src/**/*.stories.*",
          "src/**/*.spec.*",
          "src/**/*.test-*.*",
          // Illustrations are docs-only assets: the drawing kit and the
          // sources are never published.
          "src/illustration-kit/**",
          "src/**/*.illustration.ts",
          "src/test/unit-test-setup.ts",
          "src/test/utils.tsx",
          "src/test/jest-dom-vitest-shim.d.ts",
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
