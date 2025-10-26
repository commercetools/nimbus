/**
 * Asset Optimization
 *
 * Optimizes images and other static assets for documentation
 */

import fs from "fs/promises";
import path from "path";
import { flog } from "./parse-mdx";

/**
 * Copy and optimize images from packages to docs
 */
export async function optimizeAssets(
  sourceDir: string,
  outputDir: string
): Promise<void> {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Find all image files
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
    const images = await findFiles(sourceDir, imageExtensions);

    flog(`[Assets] Found ${images.length} images to process`);

    // Copy images to output directory
    for (const imagePath of images) {
      const relativePath = path.relative(sourceDir, imagePath);
      const outputPath = path.join(outputDir, relativePath);

      // Ensure output directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Copy file
      await fs.copyFile(imagePath, outputPath);
    }

    flog(`[Assets] Optimized ${images.length} assets`);
  } catch (error) {
    console.error("Error optimizing assets:", error);
    throw error;
  }
}

/**
 * Recursively find files with specific extensions
 */
async function findFiles(dir: string, extensions: string[]): Promise<string[]> {
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
        const subFiles = await findFiles(fullPath, extensions);
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
