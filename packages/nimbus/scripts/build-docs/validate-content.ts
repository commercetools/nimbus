/**
 * Content Validation
 *
 * Validates documentation content for common issues
 */

import type { MdxDocument } from "./types";
import { flog } from "./parse-mdx";

interface ValidationError {
  file: string;
  message: string;
  severity: "error" | "warning";
}

/**
 * Validate all documentation content
 */
export function validateContent(
  docs: Map<string, MdxDocument>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [filePath, doc] of docs) {
    // Validate required frontmatter fields
    if (!doc.meta.id) {
      errors.push({
        file: filePath,
        message: "Missing required field: id",
        severity: "error",
      });
    }

    if (!doc.meta.title) {
      errors.push({
        file: filePath,
        message: "Missing required field: title",
        severity: "error",
      });
    }

    // Warn about missing description
    if (!doc.meta.description) {
      errors.push({
        file: filePath,
        message: "Missing recommended field: description",
        severity: "warning",
      });
    }

    // Warn about missing tags
    if (!doc.meta.tags || doc.meta.tags.length === 0) {
      errors.push({
        file: filePath,
        message: "Missing recommended field: tags",
        severity: "warning",
      });
    }

    // Validate menu structure
    if (!doc.meta.menu || doc.meta.menu.length === 0) {
      errors.push({
        file: filePath,
        message: "Missing or empty menu array",
        severity: "error",
      });
    }

    // Check for empty content
    if (!doc.mdx || doc.mdx.trim().length === 0) {
      errors.push({
        file: filePath,
        message: "Document has no content",
        severity: "error",
      });
    }

    // Check for broken internal links (basic check)
    const internalLinkPattern = /\[.*?\]\(\/[^)]+\)/g;
    const matches = doc.mdx.match(internalLinkPattern);
    if (matches) {
      for (const match of matches) {
        // Extract path
        const path = match.match(/\((\/[^)]+)\)/)?.[1];
        if (
          path &&
          !path.startsWith("/images/") &&
          !path.startsWith("/public/")
        ) {
          // This is an internal doc link - could validate it exists
          // For now, just log it as info
        }
      }
    }
  }

  // Report validation results
  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;

  if (errorCount > 0) {
    console.error(`\n❌ Found ${errorCount} validation errors:`);
    errors
      .filter((e) => e.severity === "error")
      .forEach((err) => {
        console.error(`  ${err.file}: ${err.message}`);
      });
  }

  if (warningCount > 0) {
    console.warn(`\n⚠️  Found ${warningCount} validation warnings:`);
    errors
      .filter((e) => e.severity === "warning")
      .forEach((err) => {
        console.warn(`  ${err.file}: ${err.message}`);
      });
  }

  if (errors.length === 0) {
    flog("[Validation] All content valid ✓");
  }

  return errors;
}
