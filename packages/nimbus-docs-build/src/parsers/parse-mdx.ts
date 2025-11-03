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
          filePath: path.join(dir, file),
        };
      });

    return viewFiles;
  } catch {
    return [];
  }
};

/**
 * Parse a single MDX file and return its content, frontmatter, and TOC
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
    const { data: frontmatter, content: mdx } = matter(content) as unknown as {
      data: Record<string, unknown>;
      content: string;
    };
    const toc = await generateToc(mdx);
    return { mdx, toc, frontmatter };
  } catch {
    return null;
  }
};

/**
 * Parse a single MDX file and return structured document data
 * Supports multi-view documentation (e.g., button.dev.mdx, button.api.mdx)
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
    const { data: meta, content: mdx } = matter(content) as unknown as {
      data: Record<string, unknown>;
      content: string;
    };

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
