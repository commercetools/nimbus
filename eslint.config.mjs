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
   * Stories and bundled utils must not import the `@/components` source
   * barrel. The `@/` alias resolves to source even in production Storybook
   * builds, so it drags the raw source barrel into the bundle alongside
   * `dist`, where Rollup tree-shakes away re-exported compound roots
   * (CodeRoot, DefaultPageRoot, ...) and leaves dangling references that
   * throw at runtime. Import from `@commercetools/nimbus` (resolves to dist)
   * instead. Deep paths like `@/components/x/x.types` stay allowed.
   */
  {
    files: [
      "packages/nimbus/src/**/*.stories.tsx",
      "packages/nimbus/src/utils/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/components",
              message:
                "Import components from '@commercetools/nimbus' instead of the '@/components' source barrel, which leaks source into the production Storybook build.",
            },
          ],
        },
      ],
    },
  },
  // Spread storybook configurations if available
  ...storybookConfigs
);
