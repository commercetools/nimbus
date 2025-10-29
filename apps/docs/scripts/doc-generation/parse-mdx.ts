import fs from "fs";
import matter from "gray-matter";
import { menuToPath } from "../../src/utils/sluggify";
import { MdxFileFrontmatter, TocItem } from "../../src/types";

import { read } from "to-vfile";
import { remark } from "remark";
import remarkFlexibleToc from "remark-flexible-toc";
import debounce from "lodash/debounce";
import { flog } from "./parse-types";
import { getPathFromMonorepoRoot } from "../../utils/find-monorepo-root";
import { mdxDocumentSchema } from "../../src/schemas/mdx-document";
import { stripMarkdown } from "../../src/utils/stip-markdown";
import path from "path";

// Directory for route JSON files
const routesDir = "./src/data/routes";
// Route manifest file
const manifestFile = "./src/data/route-manifest.json";
// Search index file
const searchIndexFile = "./src/data/search-index.json";

// Ensure routes directory exists
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
}

// In-memory storage for generating manifest and search index
const documentation: Record<string, MdxFileFrontmatter> = {};

const generateToc = async (fileRef) => {
  const toc: TocItem[] = [];

  await remark()
    .use(remarkFlexibleToc, { tocRef: toc })
    .process(await read(fileRef));

  return toc || [];
};

/**
 * Generate route manifest with enhanced data for menu building
 */
const writeManifest = debounce(() => {
  const routes = Object.keys(documentation)
    .sort()
    .map((repoPath) => {
      const doc = documentation[repoPath];
      const route = doc.meta.route;
      // Create chunk name from route (e.g., "home/contribute/adr's" -> "home-contribute-adr's")
      const chunkName = route.replace(/\//g, "-");

      return {
        path: `/${route}`,
        id: doc.meta.id,
        title: doc.meta.title,
        description: doc.meta.description || "",
        category: doc.meta.menu[0] || "Uncategorized",
        tags: doc.meta.tags || [],
        menu: doc.meta.menu,
        order: doc.meta.order || 999,
        chunkName: chunkName,
        icon: doc.meta.icon,
        hasDevView: doc.meta.hasDevView || false,
      };
    });

  const manifest = {
    routes,
    // Add category grouping for easier navigation
    categories: Array.from(new Set(routes.map((r) => r.category))).map(
      (category) => ({
        id: category.toLowerCase().replace(/\s+/g, "-"),
        label: category,
        items: routes
          .filter((r) => r.category === category)
          .map((r) => ({
            id: r.id,
            title: r.title,
            path: r.path,
          })),
      })
    ),
  };

  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  flog("[MDX] Route manifest updated");
}, 500);

/**
 * Generate search index with lightweight data (no full MDX content)
 */
const writeSearchIndex = debounce(() => {
  const searchItems = Object.keys(documentation)
    .sort()
    .map((repoPath) => {
      const doc = documentation[repoPath];

      return {
        id: doc.meta.id,
        title: doc.meta.title,
        description: doc.meta.description || "",
        tags: doc.meta.tags || [],
        route: doc.meta.route,
        menu: doc.meta.menu,
        // Strip markdown and truncate content for search (first 500 chars)
        content: stripMarkdown(doc.mdx).slice(0, 500),
      };
    });

  fs.writeFileSync(searchIndexFile, JSON.stringify(searchItems, null, 2));
  flog("[MDX] Search index updated");
}, 500);

/**
 * Write individual route JSON file
 */
const writeRouteFile = (chunkName: string, data: MdxFileFrontmatter) => {
  const filePath = path.join(routesDir, `${chunkName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

/**
 * Debounced function to write all generated files
 */
const writeAllFiles = debounce(() => {
  // Write individual route files
  Object.keys(documentation).forEach((repoPath) => {
    const doc = documentation[repoPath];
    const chunkName = doc.meta.route.replace(/\//g, "-");
    writeRouteFile(chunkName, doc);
  });

  // Write manifest and search index
  writeManifest();
  writeSearchIndex();

  flog("[MDX] All documentation files updated");
}, 500);

const observable = (target, callback, _base = []) => {
  for (const key in target) {
    if (typeof target[key] === "object" && target[key] !== null)
      target[key] = observable(target[key], callback, [..._base, key]);
  }
  return new Proxy(target, {
    set(target, key, value) {
      if (typeof value === "object" && value !== null)
        value = observable(value, callback, [..._base, key]);
      callback([..._base, key], (target[key] = value));
      return true;
    },
    deleteProperty(target, key) {
      callback([..._base, key], undefined);

      // Delete individual route file if document is removed
      if (_base.length === 0) {
        const doc = target[key];
        if (doc?.meta?.route) {
          const chunkName = doc.meta.route.replace(/\//g, "-");
          const filePath = path.join(routesDir, `${chunkName}.json`);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            flog(`[MDX] Deleted route file: ${chunkName}.json`);
          }
        }
      }

      return Reflect.deleteProperty(target, key);
    },
  });
};

// Create observable documentation object
const observableDocumentation: Record<string, MdxFileFrontmatter> = observable(
  documentation,
  writeAllFiles
);

/**
 * Check if a .dev.mdx file exists for the given .mdx file
 */
const getDevMdxPath = (mdxFilePath: string): string => {
  // Replace .mdx with .dev.mdx
  return mdxFilePath.replace(/\.mdx$/, ".dev.mdx");
};

/**
 * Parse a single MDX file and return its content and TOC
 */
const parseSingleMdx = async (
  filePath: string
): Promise<{ mdx: string; toc: any[] } | null> => {
  try {
    const content = await fs.promises.readFile(filePath, "utf8");
    const { content: mdx } = matter(content) as unknown as {
      content: string;
    };
    const toc = await generateToc(filePath);
    return { mdx, toc };
  } catch (err) {
    return null;
  }
};

export const parseMdx = async (filePath: string) => {
  // Skip files from node_modules to avoid duplicated IDs
  if (filePath.includes("node_modules")) {
    return;
  }

  // Skip .dev.mdx files as they will be processed with their main .mdx file
  if (filePath.endsWith(".dev.mdx")) {
    flog(
      `[MDX] Skipping .dev.mdx file (will be processed with main .mdx): ${filePath}`
    );
    return;
  }

  fs.readFile(filePath, "utf8", async (err, content) => {
    if (err) {
      const repoPath = await getPathFromMonorepoRoot(filePath);
      delete observableDocumentation[repoPath];
      flog(`[MDX] File ${filePath} not found. Removed from documentation.`);
      return;
    }

    const { data: meta, content: mdx } = matter(content) as unknown as {
      data: MdxFileFrontmatter["meta"];
      content: MdxFileFrontmatter["mdx"];
    };

    const toc = await generateToc(filePath);
    const repoPath = await getPathFromMonorepoRoot(filePath);

    // Check for .dev.mdx file
    const devMdxPath = getDevMdxPath(filePath);
    const devView = await parseSingleMdx(devMdxPath);

    const item = {
      meta: {
        ...meta,
        repoPath,
        order: meta.order || 999,
        route: menuToPath(meta.menu),
        toc,
        hasDevView: devView !== null,
      },
      mdx,
      ...(devView && { devView }),
    };

    try {
      // Validate data before converting to a string
      const validData = mdxDocumentSchema.parse(item);

      // Store in observable documentation (triggers file writes)
      observableDocumentation[repoPath] = validData;

      if (devView) {
        flog(`[MDX] Parsed ${filePath} with dev view`);
      }
      return;
    } catch (error) {
      console.error("Error serializing frontmatter:", error);
      throw error;
    }
  });
};
