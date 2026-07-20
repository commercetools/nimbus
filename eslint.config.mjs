// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

// @ts-check

/**
 * @fileoverview ESLint configuration with TypeScript support
 */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

// Import storybook plugin using createRequire for CommonJS compatibility
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {any[]} */
let storybookConfigs = [];
try {
  const storybook = require("eslint-plugin-storybook");
  // @ts-expect-error - configs property exists but types are incomplete
  if (storybook?.configs?.["flat/recommended"]) {
    // @ts-expect-error - configs property exists but types are incomplete
    storybookConfigs = storybook.configs["flat/recommended"];
  }
} catch {
  // Storybook plugin not available - continue without it
}

/**
 * @type {import("typescript-eslint").Config}
 * ESLint configuration that:
 * 1. Ignores node_modules and dist directories
 * 2. Includes recommended ESLint rules
 * 3. Includes recommended TypeScript-specific rules with type checking
 * 4. Configures TypeScript parser options
 */
export default tseslint.config(
  /**
   * Global ignores for common build and dependency directories
   */
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/dist-*/**",
      "**/storybook-static/**",
      // Nested git worktrees (created by worktree tooling) each carry a full
      // copy of the repo, including their own tsconfig. Without this ignore,
      // typescript-eslint sees multiple candidate TSConfigRootDirs under the
      // repo root and fails to parse every file. Not part of this project.
      "**/.claude/worktrees/**",
    ],
  },
  /**
   * Base ESLint recommended rules
   */
  eslint.configs.recommended,
  /**
   * TypeScript-specific rules with type checking enabled
   */
  ...tseslint.configs.recommended,
  /**
   * Prettier configuration
   * - Disables conflicting ESLint rules
   * - Adds prettier as an ESLint rule
   */
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  /**
   * Node.js globals for script files
   */
  {
    files: ["**/scripts/**/*.mjs", ".github/actions/**/*.mjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
  /**
   * React Hooks rules (classic only — no React Compiler rules)
   * Using manual config instead of `recommended` preset which includes
   * 17 Compiler rules that produce false positives without React Compiler.
   */
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  /**
   * Ban value `export *` (re-export stars) below the rollup layer. They defeat
   * static tree-shaking analysis and, with vite/rolldown lazyBarrel, mis-shake
   * split-module compound components into runtime ReferenceErrors (see
   * docs/superpowers/specs/2026-07-08-decouple-import-notation-from-build-target.md).
   *
   * The safe boundary (per the spec's root cause) is the *leaf* barrel: the
   * one sitting directly on top of implementation files, where a compound
   * root declared in a separate module (`export const Code = CodeRoot`) first
   * enters the barrel graph. Once every leaf barrel names its re-exports, the
   * `export *` chain is broken there and the rollup barrels above it —
   * `src/index.ts` and each category `src/<category>/index.ts` — may safely
   * `export *`, because a star over an explicitly-named module is safe.
   *
   * So: leaf barrels (and implementation files) must name their value
   * re-exports; the root + category rollup barrels are exempt. `export type *`
   * is erased at build and stays allowed everywhere.
   */
  {
    files: ["packages/nimbus/src/**/*.{ts,tsx}"],
    // Rollup barrels that only forward already-named sub-modules — safe to star.
    ignores: ["packages/nimbus/src/index.ts", "packages/nimbus/src/*/index.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration[exportKind!='type']",
          message:
            "No value `export *` in a leaf barrel. Use explicit named re-exports (`export { X } from ...`); for type-only modules use `export type *`. (Only the root + category rollup barrels may `export *`.)",
        },
      ],
    },
  },
  /**
   * Lane: IMPLEMENTATION files build the library — they import via `@/`,
   * never from the public package (which would self-reference / drag the
   * built barrel back in).
   */
  {
    files: ["packages/nimbus/src/**/*.{ts,tsx}"],
    ignores: [
      "packages/nimbus/src/**/*.stories.tsx",
      "packages/nimbus/src/**/*.spec.{ts,tsx}",
      "packages/nimbus/src/**/*.docs.spec.tsx",
      "packages/nimbus/src/**/*.test-*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@commercetools/nimbus",
              message:
                "Implementation files import Nimbus via the `@/` alias, not the public package. (Package imports are for stories/tests/docs.)",
            },
          ],
        },
      ],
    },
  },
  /**
   * Lane: CONSUMER files (stories/tests/docs) use the library — they import
   * Nimbus components/hooks from the package so prod test:storybook exercises
   * the built dist. `@/` stays fine for non-component helpers/fixtures/utils.
   */
  {
    files: [
      "packages/nimbus/src/**/*.stories.tsx",
      "packages/nimbus/src/**/*.spec.{ts,tsx}",
      "packages/nimbus/src/**/*.docs.spec.tsx",
      "packages/nimbus/src/**/*.test-*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components",
                "@/components/*",
                "@/patterns",
                "@/patterns/*",
              ],
              message:
                "Consumer files (stories/tests/docs) import Nimbus components from `@commercetools/nimbus`, not `@/`. Non-component helpers via `@/` are fine.",
            },
          ],
        },
      ],
    },
  },
  // Spread storybook configurations if available
  ...storybookConfigs
);
