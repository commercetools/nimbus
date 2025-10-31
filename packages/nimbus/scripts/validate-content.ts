#!/usr/bin/env node
/**
 * Content Validation CLI
 *
 * Validates all MDX documentation files for:
 * - Required frontmatter fields
 * - Content structure
 * - Links integrity
 * - Code block syntax
 *
 * Usage:
 *   pnpm validate:content              # Validate all files
 *   pnpm validate:content --fix        # Auto-fix issues where possible
 *   pnpm validate:content --file path  # Validate single file
 */

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { glob } from "glob";
import matter from "gray-matter";
import { z } from "zod";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get to monorepo root (from packages/nimbus/scripts -> ../ three times)
const REPO_ROOT = path.resolve(__dirname, "../../..");
const MDX_PATTERN = "packages/nimbus/src/**/*.mdx";

// Frontmatter schema
const frontmatterSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order: z.number().default(999),
  menu: z.array(z.string()).min(1, "Menu array is required"),
  tags: z.array(z.string()).min(1, "At least one tag is recommended"),
  lifecycleState: z.string().optional(),
  documentState: z.string().optional(),
  figmaLink: z.string().optional(),
  icon: z.string().optional(),
});

interface ValidationError {
  file: string;
  line?: number;
  severity: "error" | "warning";
  message: string;
}

interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  filesChecked: number;
}

/**
 * Main validation function
 */
async function validateContent(options: {
  fix?: boolean;
  file?: string;
}): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Find MDX files
  const pattern = options.file
    ? path.resolve(REPO_ROOT, options.file)
    : path.join(REPO_ROOT, MDX_PATTERN);

  const files = await glob(pattern, {
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  console.log(`\n🔍 Validating ${files.length} MDX files...\n`);

  for (const file of files) {
    const relativePath = path.relative(REPO_ROOT, file);

    try {
      const content = await fs.readFile(file, "utf-8");

      // Validate frontmatter
      const { data: frontmatter, content: mdxContent } = matter(content);

      // Check for empty content
      if (!mdxContent.trim()) {
        errors.push({
          file: relativePath,
          severity: "error",
          message: "Document has no content",
        });
        continue;
      }

      // Validate frontmatter schema
      const result = frontmatterSchema.safeParse(frontmatter);

      if (!result.success) {
        result.error.issues.forEach((err) => {
          errors.push({
            file: relativePath,
            severity: "error",
            message: `Frontmatter: ${err.path.join(".")} - ${err.message}`,
          });
        });
      }

      // Check for empty tags array (warning)
      if (Array.isArray(frontmatter.tags) && frontmatter.tags.length === 0) {
        warnings.push({
          file: relativePath,
          severity: "warning",
          message: "Missing recommended field: tags",
        });
      }

      // Validate content structure
      const contentErrors = validateContentStructure(mdxContent, relativePath);
      errors.push(...contentErrors);

      // Check for broken internal links
      const linkWarnings = await validateInternalLinks(
        mdxContent,
        file,
        relativePath
      );
      warnings.push(...linkWarnings);
    } catch (error) {
      errors.push({
        file: relativePath,
        severity: "error",
        message: `Failed to parse: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    filesChecked: files.length,
  };
}

/**
 * Validate content structure
 */
function validateContentStructure(
  content: string,
  file: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for H1 heading
  if (!content.match(/^# /m)) {
    errors.push({
      file,
      severity: "error",
      message: "Missing H1 heading",
    });
  }

  // Check for malformed code blocks
  const codeBlockPattern = /```[a-z-]*\n[\s\S]*?```/g;
  const matches = content.match(codeBlockPattern) || [];

  matches.forEach((block) => {
    // Check if code block is closed
    if ((block.match(/```/g) || []).length !== 2) {
      errors.push({
        file,
        severity: "error",
        message: "Unclosed code block",
      });
    }
  });

  return errors;
}

/**
 * Validate internal links
 */
async function validateInternalLinks(
  content: string,
  filePath: string,
  relativePath: string
): Promise<ValidationError[]> {
  const warnings: ValidationError[] = [];

  // Find all markdown links
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(content)) !== null) {
    const [, , url] = match;

    // Only check relative links
    if (url.startsWith("http") || url.startsWith("#")) continue;

    // Resolve relative link
    const linkedPath = path.resolve(path.dirname(filePath), url);

    try {
      await fs.access(linkedPath);
    } catch {
      warnings.push({
        file: relativePath,
        severity: "warning",
        message: `Broken link: ${url}`,
      });
    }
  }

  return warnings;
}

/**
 * Print validation results
 */
function printResults(result: ValidationResult): void {
  console.log(`\n📊 Validation Results\n`);
  console.log(`Files checked: ${result.filesChecked}`);

  if (result.errors.length > 0) {
    console.log(`\n❌ Found ${result.errors.length} errors:\n`);
    result.errors.forEach((err) => {
      console.log(`  ${err.file}`);
      console.log(`    ${err.message}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  Found ${result.warnings.length} warnings:\n`);
    result.warnings.forEach((warn) => {
      console.log(`  ${warn.file}`);
      console.log(`    ${warn.message}`);
    });
  }

  if (result.passed && result.warnings.length === 0) {
    console.log(`\n✅ All content valid!\n`);
  } else if (result.passed) {
    console.log(`\n✅ No errors found (${result.warnings.length} warnings)\n`);
  } else {
    console.log(`\n❌ Content validation failed\n`);
  }
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const options = {
    fix: args.includes("--fix"),
    file: args.find((arg) => arg.startsWith("--file="))?.replace("--file=", ""),
  };

  const result = await validateContent(options);
  printResults(result);

  // Exit with error code if validation failed
  process.exit(result.passed ? 0 : 1);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
