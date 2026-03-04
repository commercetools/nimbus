// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

// @ts-check

/**
 * @fileoverview ESLint configuration with TypeScript support
 */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
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
    ignores: ["**/node_modules/**", "**/dist/**", "**/storybook-static/**"],
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
  // Spread storybook configurations if available
  ...storybookConfigs
);
