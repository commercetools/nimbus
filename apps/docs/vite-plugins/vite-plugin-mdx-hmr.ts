/**
 * Vite Plugin: MDX Hot Module Replacement
 *
 * Watches MDX files in the nimbus package and triggers HMR updates
 * when content changes, allowing live preview of documentation edits.
 */

import type { Plugin } from "vite";
import path from "path";
import fs from "fs/promises";

export function mdxHmrPlugin(): Plugin {
  const REPO_ROOT = path.resolve(__dirname, "../../..");
  const MDX_GLOB = "packages/nimbus/src/**/*.mdx";
  const ROUTE_MANIFEST_PATH = path.join(
    REPO_ROOT,
    "apps/docs/src/data/route-manifest.json"
  );

  return {
    name: "vite-plugin-mdx-hmr",

    // Enable in dev mode only
    apply: "serve",

    async configureServer(server) {
      console.log("📝 MDX Hot Reload enabled - watching for content changes");

      // Watch for MDX file changes
      server.watcher.add(path.join(REPO_ROOT, MDX_GLOB));

      server.watcher.on("change", async (file) => {
        // Only handle MDX files
        if (!file.endsWith(".mdx")) return;

        const relativePath = path.relative(REPO_ROOT, file);
        console.log(`🔄 MDX file changed: ${relativePath}`);

        try {
          // Extract route from file path
          const route = extractRouteFromPath(file);

          // Trigger rebuild of affected route data
          await rebuildRouteData(file);

          // Invalidate multiple modules for granular updates
          const modulesToInvalidate = [
            // Route manifest
            ROUTE_MANIFEST_PATH,
            // Specific route data file (derived from file path)
            path.join(
              REPO_ROOT,
              "apps/docs/src/data/routes",
              `${path.basename(file, ".mdx")}.json`
            ),
          ];

          let invalidatedCount = 0;
          for (const modulePath of modulesToInvalidate) {
            const module = server.moduleGraph.getModuleById(modulePath);
            if (module) {
              server.moduleGraph.invalidateModule(module);
              invalidatedCount++;
            }
          }

          console.log(
            `🔄 Invalidated ${invalidatedCount} module(s) for ${route}`
          );

          // Send HMR update
          server.ws.send({
            type: "custom",
            event: "mdx-update",
            data: {
              route,
              file: relativePath,
              timestamp: Date.now(),
            },
          });

          console.log(`✅ Hot reloaded: ${route}`);
        } catch (error) {
          console.error(`❌ Failed to hot reload MDX:`, error);
        }
      });
    },

    // Add virtual module for HMR client
    resolveId(id) {
      if (id === "virtual:mdx-hmr-client") {
        return "\0virtual:mdx-hmr-client";
      }
    },

    load(id) {
      if (id === "\0virtual:mdx-hmr-client") {
        return `
          if (import.meta.hot) {
            import.meta.hot.on("mdx-update", (data) => {
              console.log('[MDX HMR] Content updated:', data.route, 'at', new Date(data.timestamp).toLocaleTimeString());

              // Check if current route matches updated route
              const currentPath = window.location.pathname;
              if (currentPath === data.route || currentPath.startsWith(data.route + '/')) {
                console.log('[MDX HMR] Current route matches, invalidating modules...');

                // Invalidate the specific route data file and manifest
                // This will trigger React components to re-fetch the data
                import.meta.hot.invalidate();
              } else {
                console.log('[MDX HMR] Update is for different route, no action needed');
              }
            });

            // Also listen for full manifest updates
            import.meta.hot.accept(() => {
              console.log('[MDX HMR] Module accepted, letting React handle the update');
            });
          }
        `;
      }
    },
  };
}

/**
 * Extract route path from file path
 */
function extractRouteFromPath(filePath: string): string {
  // Remove everything before /components/ or /docs/
  const match = filePath.match(/\/(components|docs)\/(.+)\.mdx$/);
  if (!match) return "/";

  const [, category, rest] = match;

  // Convert file path to route path
  return `/${category}/${rest
    .split("/")
    .map((segment) => segment.toLowerCase().replace(/\s+/g, "-"))
    .join("/")}`;
}

/**
 * Rebuild route data for a single MDX file
 */
async function rebuildRouteData(filePath: string): Promise<void> {
  // In dev mode, we can use a lightweight rebuild
  // For now, just validate the file exists and is readable
  await fs.access(filePath, fs.constants.R_OK);

  // TODO: Implement incremental rebuild of single route data file
  // This would parse just the changed MDX file and update its route JSON
  // For now, the full page reload will fetch the latest content
}
