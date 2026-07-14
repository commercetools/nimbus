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
   * Ban the `@/components` source barrel everywhere. Use deep imports
   * (`@/components/<name>`) instead. The barrel causes Vite 8 to
   * tree-shake re-exported compound roots (CodeRoot, DefaultPageRoot, ...)
   * out of production Storybook builds, leaving dangling references.
   */
  {
    files: ["packages/nimbus/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/components",
              message:
                "Use deep imports (e.g. '@/components/button') instead of the '@/components' barrel to avoid circular chunk dependencies and production build breakage.",
            },
          ],
        },
      ],
    },
  },
  // Spread storybook configurations if available
  ...storybookConfigs
);
