/**
 * File system utility functions
 */
import fs from "fs/promises";
import path from "path";

/**
 * Recursively find the monorepo root by checking for "workspaces" in package.json.
 * @param dir The starting directory to search from.
 * @returns The absolute path to the monorepo root or null if not found.
 */
export async function findMonorepoRoot(dir: string): Promise<string | null> {
  const packageJsonPath = path.join(dir, "package.json");

  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson.workspaces) {
      return dir;
    }
  } catch {
    // Ignore errors (e.g., file not found or invalid JSON) and continue
  }

  const parentDir = path.dirname(dir);
  if (parentDir === dir) {
    // Reached the filesystem root
    return null;
  }

  return findMonorepoRoot(parentDir);
}

/**
 * Get the relative path from the monorepo root to the specified file path.
 * @param filePath The file path to calculate the relative path for.
 * @returns The relative path from the monorepo root to the file path.
 * @throws If the monorepo root cannot be found.
 */
export async function getPathFromMonorepoRoot(
  filePath: string
): Promise<string> {
  const absoluteFilePath = path.resolve(filePath);
  const startingDir = path.dirname(absoluteFilePath);
  const monorepoRoot = await findMonorepoRoot(startingDir);

  if (!monorepoRoot) {
    throw new Error(
      'Monorepo root not found. Ensure a package.json with a "workspaces" property exists.'
    );
  }

  return path.relative(monorepoRoot, absoluteFilePath);
}

/**
 * Find all files with a specific extension recursively
 * @param dir Directory to search
 * @param extension File extension to match (e.g., ".mdx")
 * @returns Array of file paths
 */
export async function findFiles(
  dir: string,
  extension: string
): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and dist
        if (entry.name === "node_modules" || entry.name === "dist") {
          continue;
        }

        const subFiles = await findFiles(fullPath, extension);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        if (
          path.extname(entry.name).toLowerCase() === extension.toLowerCase()
        ) {
          files.push(fullPath);
        }
      }
    }
  } catch {
    // Ignore permission errors
  }

  return files;
}

/**
 * Find all files matching multiple extensions
 * @param dir Directory to search
 * @param extensions Array of extensions to match
 * @returns Array of file paths
 */
export async function findFilesByExtensions(
  dir: string,
  extensions: string[]
): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and dist directories
        if (entry.name === "node_modules" || entry.name === "dist") {
          continue;
        }

        // Recursively search subdirectories
        const subFiles = await findFilesByExtensions(fullPath, extensions);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch {
    // Ignore permission errors, etc.
  }

  return files;
}
