/**
 * Route Manifest Generator
 *
 * Generates route configuration from parsed MDX documents
 */

import fs from "fs/promises";
import type {
  MdxDocument,
  RouteManifest,
  RouteInfo,
  CategoryInfo,
} from "./types";
import { routeManifestSchema } from "./schemas";
import { flog } from "./parse-mdx";

/**
 * Generate route manifest from parsed documents
 */
export async function generateRouteManifest(
  docs: Map<string, MdxDocument>,
  outputPath: string
): Promise<RouteManifest> {
  const routes: RouteInfo[] = [];
  const categoriesMap = new Map<string, CategoryInfo>();

  // Process each document
  for (const [, doc] of docs) {
    const { meta } = doc;
    const category = meta.menu?.[0] || "Uncategorized";
    const routePath = `/${meta.route}`;

    // Create route info
    const route: RouteInfo = {
      path: routePath,
      id: meta.id,
      title: meta.title,
      category,
      tags: meta.tags || [],
      chunkName: `route-${meta.id.toLowerCase().replace(/\s+/g, "-")}`,
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
  await fs.writeFile(outputPath, JSON.stringify(validatedManifest, null, 2));

  flog(`[Routes] Generated manifest with ${routes.length} routes`);

  return validatedManifest;
}
