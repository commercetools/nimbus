/**
 * MDX Parser for Documentation Build System
 *
 * Parses MDX files with frontmatter, generates table of contents,
 * and supports multi-view documentation (e.g., *.dev.mdx, *.api.mdx)
 */

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkFlexibleToc, {
  type FlexibleTocOptions,
} from "remark-flexible-toc";
import { mdxDocumentSchema } from "../schemas/mdx-document.js";
import type { MdxDocument, TocItem } from "../types/mdx.js";
import { menuToPath, getPathFromMonorepoRoot } from "../utils/index.js";
import { validateFilePath } from "../utils/validate-file-path.js";
import { extractTestSections } from "./test-extractor.js";
import type { TestSection } from "../types/test-section.js";

/**
 * Resolve the path to a .docs.spec.ts file from an MDX file path
 * @param mdxFilePath - Absolute path to the MDX file
 * @param testFileName - Name of the test file from the {{docs-tests:}} token
 * @returns Absolute path to the test file
 */
const resolveTestFilePath = (
  mdxFilePath: string,
  testFileName: string
): string => {
  const mdxDir = path.dirname(mdxFilePath);
  return path.join(mdxDir, testFileName);
};

/**
 * Generate markdown section from a test section
 * @param section - Extracted test section
 * @returns Markdown string with heading, description, and code block
 */
const generateMarkdownSection = (section: TestSection): string => {
  const lines: string[] = [];

  // Add heading
  lines.push(`### ${section.title}`);
  lines.push("");

  // Add description if present
  if (section.description) {
    lines.push(section.description);
    lines.push("");
  }

  // Add code block with full, unmodified code
  lines.push("```tsx");

  // Add imports (deduplicated)
  const uniqueImports = Array.from(new Set(section.imports));
  if (uniqueImports.length > 0) {
    lines.push(uniqueImports.join("\n"));
    lines.push("");
  }

  // Add test code (unmodified - show exactly what developers write)
  lines.push(section.code);
  lines.push("```");
  lines.push("");

  return lines.join("\n");
};

/**
 * Inject test sections into MDX content by replacing {{docs-tests:}} tokens
 * @param mdxContent - MDX content that may contain {{docs-tests:}} tokens
 * @param mdxFilePath - Absolute path to the MDX file (for resolving test file paths)
 * @returns MDX content with test sections injected
 */
const injectTestSections = async (
  mdxContent: string,
  mdxFilePath: string
): Promise<string> => {
  // Pattern: {{docs-tests: filename.docs.spec.ts}}
  const tokenPattern = /\{\{docs-tests:\s*([^}]+)\}\}/g;

  let result = mdxContent;
  const matches = mdxContent.matchAll(tokenPattern);

  for (const match of matches) {
    const [fullMatch, testFileName] = match;

    try {
      // Resolve test file path
      const testFilePath = resolveTestFilePath(
        mdxFilePath,
        testFileName.trim()
      );

      // Check if test file exists
      try {
        await fs.access(testFilePath);
      } catch {
        console.warn(
          `Test file not found: ${testFilePath} (referenced in ${path.basename(mdxFilePath)})`
        );
        // Leave token in place if file doesn't exist
        continue;
      }

      // Extract test sections
      const sections = await extractTestSections(testFilePath);

      if (sections.length === 0) {
        console.warn(
          `No test sections found in ${testFileName} (add @docs-section JSDoc tags)`
        );
        // Leave token in place if no sections found
        continue;
      }

      // Generate markdown for all sections
      const sectionMarkdown = sections
        .map((section) => generateMarkdownSection(section))
        .join("\n");

      // Replace token with generated markdown
      result = result.replace(fullMatch, sectionMarkdown);
    } catch (error) {
      console.error(
        `Error processing test file ${testFileName}:`,
        error instanceof Error ? error.message : error
      );
      // Leave token in place on error
    }
  }

  return result;
};

/**
 * Generate table of contents from MDX content (without frontmatter)
 * @param content - The MDX content string with frontmatter already removed
 */
const generateToc = async (content: string): Promise<TocItem[]> => {
  const toc: NonNullable<FlexibleTocOptions["tocRef"]> = [];

  await remark().use(remarkFlexibleToc, { tocRef: toc }).process(content);

  return toc || [];
};

/**
 * Get all view MDX files for the given base .mdx file
 * Returns array of objects with key and filePath
 * e.g., button.dev.mdx -> { key: "dev", filePath: "..." }
 */
const getViewMdxFiles = async (
  baseMdxPath: string
): Promise<Array<{ key: string; filePath: string }>> => {
  const dir = path.dirname(baseMdxPath);
  const basename = path.basename(baseMdxPath, ".mdx");

  try {
    const files = await fs.readdir(dir);
    const viewFiles = files
      .filter((file) => {
        // Match pattern: component-name.{key}.mdx
        const regex = new RegExp(`^${basename}\\.([^.]+)\\.mdx$`);
        return regex.test(file);
      })
      .map((file) => {
        // Extract key from filename
        const regex = new RegExp(`^${basename}\\.([^.]+)\\.mdx$`);
        const match = file.match(regex);
        const key = match ? match[1] : "";
        return {
          key,
          filePath: validateFilePath(dir, file),
        };
      });

    return viewFiles;
  } catch {
    return [];
  }
};

/**
 * Parse a single MDX file and return its content, frontmatter, and TOC
 *
 * @param filePath - Absolute path to MDX file (should be pre-validated by caller)
 * @note Callers must ensure filePath is validated to prevent path traversal
 */
const parseSingleMdx = async (
  filePath: string
): Promise<{
  mdx: string;
  toc: TocItem[];
  frontmatter: Record<string, unknown>;
} | null> => {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const { data: frontmatter, content: mdxContent } = matter(
      content
    ) as unknown as {
      data: Record<string, unknown>;
      content: string;
    };

    // Inject test sections if {{docs-tests:}} tokens are present
    const mdx = mdxContent.includes("{{docs-tests:")
      ? await injectTestSections(mdxContent, filePath)
      : mdxContent;

    const toc = await generateToc(mdx);
    return { mdx, toc, frontmatter };
  } catch {
    return null;
  }
};

/**
 * Parse a single MDX file and return structured document data
 * Supports multi-view documentation (e.g., button.dev.mdx, button.api.mdx)
 *
 * @param filePath - Absolute path to MDX file (should be from trusted source like file discovery)
 * @note This function reads from discovered MDX files within the packages directory
 */
export async function parseMdxFile(
  filePath: string
): Promise<MdxDocument | null> {
  try {
    // Skip node_modules
    if (filePath.includes("node_modules")) {
      return null;
    }

    // Skip view files (*.{key}.mdx) as they will be processed with their main .mdx file
    const basename = path.basename(filePath);
    const nameWithoutMdx = basename.replace(/\.mdx$/, "");
    if (nameWithoutMdx.includes(".")) {
      // This is a view file, skip it
      return null;
    }

    // Read main file content
    const content = await fs.readFile(filePath, "utf8");
    const { data: meta, content: mdxContent } = matter(content) as unknown as {
      data: Record<string, unknown>;
      content: string;
    };

    // Inject test sections if {{docs-tests:}} tokens are present
    const mdx = mdxContent.includes("{{docs-tests:")
      ? await injectTestSections(mdxContent, filePath)
      : mdxContent;

    // Generate TOC for main file
    const toc = await generateToc(mdx);

    // Get relative path from monorepo root
    const repoPath = await getPathFromMonorepoRoot(filePath);

    // Get tab metadata from main file frontmatter (with defaults)
    const mainTabTitle =
      (meta["tab-title"] as string) ||
      (meta["tabTitle"] as string) ||
      "Overview";
    const mainTabOrder =
      (meta["tab-order"] as number) || (meta["tabOrder"] as number) || 0;

    // Discover all view files (e.g., button.dev.mdx, button.api.mdx)
    const viewFiles = await getViewMdxFiles(filePath);

    // Build tabs array and views object
    const tabs: Array<{ key: string; title: string; order: number }> = [
      { key: "overview", title: mainTabTitle, order: mainTabOrder },
    ];

    const views: Record<string, { mdx: string; toc: TocItem[] }> = {
      overview: { mdx, toc },
    };

    // Parse each view file
    for (const { key, filePath: viewFilePath } of viewFiles) {
      const viewData = await parseSingleMdx(viewFilePath);
      if (viewData) {
        const { mdx: viewMdx, toc: viewToc, frontmatter: viewMeta } = viewData;

        // Get tab metadata from view file frontmatter (with defaults)
        const tabTitle =
          (viewMeta["tab-title"] as string) ||
          (viewMeta["tabTitle"] as string) ||
          key;
        const tabOrder =
          (viewMeta["tab-order"] as number) ||
          (viewMeta["tabOrder"] as number) ||
          999;

        tabs.push({ key, title: tabTitle, order: tabOrder });
        views[key] = { mdx: viewMdx, toc: viewToc };
      }
    }

    // Sort tabs by order (ascending)
    tabs.sort((a, b) => a.order - b.order);

    // Build document structure
    const document = {
      meta: {
        ...meta,
        repoPath,
        order: (meta.order as number) || 999,
        route: menuToPath((meta.menu as string[]) || []),
        toc,
        tabs,
      },
      mdx,
      views,
    };

    // Validate with Zod
    const validatedDoc = mdxDocumentSchema.parse(document);

    return validatedDoc;
  } catch (error) {
    console.error(`Error parsing MDX file ${filePath}:`, error);
    return null;
  }
}

/**
 * Parse all MDX files and return a map of documents
 */
export async function parseAllMdx(
  mdxFiles: string[]
): Promise<Map<string, MdxDocument>> {
  const docs = new Map<string, MdxDocument>();

  // Parse all files in parallel
  const results = await Promise.all(
    mdxFiles.map(async (filePath) => {
      const doc = await parseMdxFile(filePath);
      return { filePath, doc };
    })
  );

  // Collect results
  for (const { doc } of results) {
    if (!doc) continue;
    docs.set(doc.meta.repoPath, doc);
  }

  return docs;
}
