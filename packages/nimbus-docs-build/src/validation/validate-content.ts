/**
 * Content Validation
 *
 * Validates documentation content for common issues
 */
import type { MdxDocument } from "../types/mdx.js";
import type { ValidationError } from "../types/config.js";
import { flog } from "../utils/logger.js";
import { findUnknownRelatedIds } from "../generators/resolve-related.js";
import { findUnknownInternalLinks } from "./find-unknown-links.js";

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
  }

  // Validate internal links: each must lead to a document or one of its tabs
  const unknownLinks = findUnknownInternalLinks(
    [...docs].map(([file, doc]) => ({
      file,
      route: doc.meta.route,
      viewKeys: Object.keys(doc.views ?? {}),
      // The text of the page and of all its tabs
      mdx: [doc.mdx, ...Object.values(doc.views ?? {}).map((view) => view.mdx)]
        .filter(Boolean)
        .join("\n"),
    }))
  );
  for (const { file, path } of unknownLinks) {
    errors.push({
      file,
      message: `Link to an unknown page: "${path}" is not the route of any document`,
      severity: "warning",
    });
  }

  // Validate related ids: each must be the id of an existing document
  const unknownRelated = findUnknownRelatedIds(
    [...docs].map(([file, doc]) => ({ file, meta: doc.meta }))
  );
  for (const { file, id } of unknownRelated) {
    errors.push({
      file,
      message: `Unknown id in related: "${id}" is not the id of any document`,
      severity: "error",
    });
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
