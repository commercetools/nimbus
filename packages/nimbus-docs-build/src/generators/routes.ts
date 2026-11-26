/**
 * Route Manifest Generator
 *
 * Generates route configuration from parsed MDX documents
 */
import fs from "fs/promises";
import path from "path";
import type {
  MdxDocument,
  RouteManifest,
  RouteInfo,
  CategoryInfo,
} from "../types/mdx.js";
import { routeManifestSchema } from "../schemas/mdx-document.js";
import { flog } from "../utils/logger.js";
import { validateFilePath } from "../utils/validate-file-path.js";
import { findMonorepoRoot } from "../utils/file-utils.js";
import { resolveChildIllustrations } from "./resolve-illustrations.js";
import {
  ILLUSTRATION_SOURCES_DIR,
  findIllustration,
  findUnknownIllustrations,
  formatUnknownIllustrations,
  listIllustrationNames,
} from "./illustration-sources.js";
import { resolveSourceFiles } from "./resolve-source-files.js";
import { resolveRelated } from "./resolve-related.js";

/**
 * Generate route manifest from parsed documents
 */
export async function generateRouteManifest(
  docs: Map<string, MdxDocument>,
  outputPath: string
): Promise<RouteManifest> {
  const routes: RouteInfo[] = [];
  const categoriesMap = new Map<string, CategoryInfo>();
  const monorepoRoot = await findMonorepoRoot(process.cwd());
  const knownIllustrations = monorepoRoot
    ? await listIllustrationNames(
        path.join(monorepoRoot, ILLUSTRATION_SOURCES_DIR)
      )
    : new Set<string>();

  // The build stops on unknown names (see `build`); the dev watcher only warns
  const unknownIllustrations = findUnknownIllustrations(
    [...docs].map(([file, doc]) => ({ file, meta: doc.meta })),
    knownIllustrations
  );
  if (monorepoRoot && unknownIllustrations.length > 0) {
    console.warn(formatUnknownIllustrations(unknownIllustrations));
  }

  // Process each document
  for (const [docFile, doc] of docs) {
    const { meta } = doc;
    const category = meta.menu[0] || "Uncategorized";
    const routePath = `/${meta.route}`;

    // Create route info
    const route: RouteInfo = {
      path: routePath,
      id: meta.id,
      title: meta.title,
      exportName: meta.exportName,
      description: meta.description || "",
      lifecycleState: meta.lifecycleState,
      category,
      tags: meta.tags || [],
      menu: meta.menu,
      order: meta.order || 999,
      chunkName: `route-${meta.route.replace(/\//g, "-")}`,
      icon: meta.icon,
      illustrations: await findIllustration(
        monorepoRoot,
        meta,
        knownIllustrations
      ),
      related: meta.related || [],
      tabs: meta.tabs || [],
      files: monorepoRoot
        ? await resolveSourceFiles(path.join(monorepoRoot, docFile))
        : [],
    };

    routes.push(route);

    // Build categories
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, {
        id: category.toLowerCase().replace(/\s+/g, "-"),
        label: category,
        order: 999,
        items: [],
      });
    }

    categoriesMap.get(category)!.items.push(route);
  }

  // Category pages show the illustrations of the documents below them
  resolveChildIllustrations(routes);

  // Related links are two-way: add the documents that list a document
  const related = resolveRelated(routes);
  for (const route of routes) {
    route.related = related.get(route.id) ?? [];
  }

  // Convert categories map to array and sort
  const categories = Array.from(categoriesMap.values()).sort(
    (a, b) => a.order - b.order
  );

  // Build navigation structure
  const navigation = categories.reduce(
    (acc, category) => {
      acc[category.id] = {
        label: category.label,
        items: category.items.map((item) => ({
          id: item.id,
          title: item.title,
          path: item.path,
        })),
      };
      return acc;
    },
    {} as RouteManifest["navigation"]
  );

  const manifest: RouteManifest = {
    routes,
    categories,
    navigation,
  };

  // Validate
  const validatedManifest = routeManifestSchema.parse(manifest);

  // Write to disk
  const outputDir = path.dirname(outputPath);
  const validatedPath = validateFilePath(outputDir, path.basename(outputPath));
  await fs.writeFile(validatedPath, JSON.stringify(validatedManifest, null, 2));

  flog(`[Routes] Generated manifest with ${routes.length} routes`);

  return validatedManifest;
}
