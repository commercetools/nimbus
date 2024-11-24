import * as path from "path";
import { promises as fs } from "fs";

/**
 * Recursively find the monorepo root by checking for "workspaces" in package.json.
 * @param dir The starting directory to search from.
 * @returns The absolute path to the monorepo root or null if not found.
 */
async function findMonorepoRoot(dir: string): Promise<string | null> {
  const packageJsonPath = path.join(dir, "package.json");

  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson.workspaces) {
      return dir;
    }
  } catch (error) {
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
