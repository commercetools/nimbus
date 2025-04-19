// filepath: /Volumes/Code/nimbus/apps/docs/scripts/config.ts
import path from "path";

/**
 * Centralized configuration for the documentation generation system
 */
export const CONFIG = {
  // Directories
  watchDir: path.resolve("../../packages"),

  // Package-specific directories for optimized parsing
  packageDirs: {
    nimbus: path.resolve("../../packages/nimbus"),
  },

  // Output files
  outputFiles: {
    docs: path.resolve("./src/data/docs.json"),
    types: path.resolve("./src/data/types.json"),
  },

  // Source files
  typeSource: path.resolve("../../packages/nimbus/src/index.ts"),

  // Processing settings
  debounceMs: 300, // Reduced from 500ms to 300ms for faster updates

  // File extensions to watch
  extensions: {
    code: [".ts", ".tsx"],
    docs: [".mdx"],
  },

  // Directories to ignore
  ignoreDirs: ["node_modules", "dist", ".turbo", "coverage"],
};
