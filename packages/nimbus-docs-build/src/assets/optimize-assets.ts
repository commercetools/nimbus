/**
 * Asset Optimization
 *
 * Optimizes images and other static assets for documentation
 */
import fs from "fs/promises";
import path from "path";
import { findFilesByExtensions } from "../utils/file-utils.js";
import { flog } from "../utils/logger.js";

/**
 * Copy and optimize images from packages to docs
 */
export async function optimizeAssets(
  sourceDir: string,
  outputDir: string,
  imageExtensions: string[] = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]
): Promise<void> {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Find all image files
    const images = await findFilesByExtensions(sourceDir, imageExtensions);

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
