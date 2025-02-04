// @ts-check

/**
 * @fileoverview ESLint configuration with TypeScript support
 */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

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
    ignores: ["**/node_modules/**", "**/dist/**"],
  },

  /**
   * Base ESLint recommended rules
   */
  eslint.configs.recommended,

  /**
   * TypeScript-specific rules with type checking enabled
   */
  tseslint.configs.recommendedTypeChecked,

  /**
   * TypeScript parser configuration
   * - Enables project-wide type checking
   * - Sets the root directory for tsconfig.json
   */
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Add specific rules for test files
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/test/**/*.ts",
      "**/test/**/*.tsx",
    ],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
  /**
   * Make sure eslint is aware of prettier rules
   * to prevent any responsibility overlap or conflicts
   */
  eslintPluginPrettierRecommended
);
