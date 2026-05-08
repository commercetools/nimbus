import { fileURLToPath } from "node:url";
import { glob } from "glob";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig, esmExternalRequirePlugin } from "vite";
import type { LibraryFormats, PluginOption, Rollup } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { analyzer } from "vite-bundle-analyzer";
import { LOCALE_BCP47_CODES } from "../i18n/scripts/locales";

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
  // Separate entry so the jest polyfill ships as CJS.
  entries.set(
    "setup-jsdom-polyfills",
    fileURLToPath(new URL("src/test/setup-jsdom-polyfills.ts", import.meta.url))
  );
  return Object.fromEntries(entries);
};

/**
 * External (peer) dependencies — not bundled into the nimbus dist.
 *
 * Two arrays exist because of how the upstream packages are published:
 *
 * ### `requireRewriteExternals` — via `esmExternalRequirePlugin`
 *
 * For packages whose graph contains CJS files calling `require("<name>")`.
 * The plugin both externalizes them **and** rewrites internal `require()`
 * calls into ESM imports — without the rewrite, Rolldown leaks
 * `__require(...)` into our ESM dist and breaks pure-ESM consumers.
 *
 * Only React-family hits this today: `react` ships as CJS, and
 * `use-sync-external-store/cjs/*` (transitively via react-aria /
 * react-stately) calls `require("react")` internally.
 *
 * **Critical:** entries here must **not** also be in `external` below.
 * If they are, Rolldown externalizes them before the plugin's rewrite
 * runs, the rewrite no-ops, and `__require(...)` leaks into the dist.
 * Ref: https://github.com/vitejs/rolldown-vite/issues/596
 *
 * ### `external` — via `rollupOptions.external`
 *
 * For packages where plain externalization is enough — they ship ESM
 * (chakra, slate) or are workspace packages.
 *
 * **Default to this list when adding a new external.** Move an entry to
 * `requireRewriteExternals` only if you observe `__require(...)` leaking
 * into the built output.
 *
 * Anything externalized (either list) must also be a peerDependency &
 * devDependency in this package's `package.json`.
 */
const requireRewriteExternals = [/^react(-dom)?(\/.+)?$/];

const external = [
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
    // Typed as `PluginOption[]` so we can `.push(...)` later (dts/analyzer)
    // without TS narrowing the element type to the first plugin's literal shape.
    plugins: [
      react(),
      // Only package locale strings for locales we internationalize in our products
      // Locales are defined in packages/i18n/scripts/locales.ts (single source of truth)
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
          if (["index", "setup-jsdom-polyfills"].includes(entryName)) {
            return `${entryName}.${extension}`;
          }
          // Put component entries in a components folder
          return `components/${entryName}.${extension}`;
        },
        formats: ["es", "cjs"] satisfies LibraryFormats[],
      },
      rollupOptions: {
        /**
         * `esmExternalRequirePlugin` handles `requireRewriteExternals`
         * (see the file-top doc).
         *
         * **Must live in `rollupOptions.plugins`** (not in the top-level
         * `plugins` array) so it only applies to nimbus's lib build. If it
         * leaks into Storybook's iframe build, react gets externalized
         * there too and the deployed Storybook breaks with
         * `Uncaught TypeError: Failed to resolve module specifier 'react'`
         * (no importmap).
         */
        plugins: [
          esmExternalRequirePlugin({ external: requireRewriteExternals }),
          /**
           * Pin chunk extensions to `.es.js` / `.cjs.js`.
           *
           * Vite 8/Rolldown changed the `[format]` placeholder from `es` →
           * `esm` for the ESM output, which would shift our chunk filenames
           * from `*.es.js` to `*.esm.js`. The bundle-size script
           * (`scripts/check-bundle-size.mjs`) hard-codes the pattern
           * `**\/*.es.js`, so the upgrade would break its measurement.
           *
           * `outputOptions` runs once per output (i.e. once per format) and
           * exposes `format`, which `chunkFileNames` (called per chunk) does
           * not. We use it to write a literal `chunkFileNames` per format —
           * sidestepping `[format]` entirely.
           */
          {
            name: "nimbus-pin-chunk-extensions",
            outputOptions(options: Rollup.OutputOptions) {
              return {
                ...options,
                chunkFileNames:
                  options.format === "es"
                    ? "chunks/[name]-[hash].es.js"
                    : "chunks/[name]-[hash].cjs.js",
              };
            },
          },
        ],
        external,
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
    resolve: { tsconfigPaths: true },
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
          "src/test/unit-test-setup.ts",
          "src/test/utils.tsx",
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
