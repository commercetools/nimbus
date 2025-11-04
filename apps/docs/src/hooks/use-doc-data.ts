import { useState, useEffect } from "react";
import { useManifest } from "@/contexts/manifest-context";

type DocData = {
  [key: string]: unknown;
  relatedDocs?: string[];
};

type UseDocDataReturn = {
  doc: DocData | null;
  relatedDocs: DocData[];
  isLoading: boolean;
  error: Error | null;
};

// Use import.meta.glob to statically analyze and bundle all route JSON files at build time
// This enables Vite to properly handle dynamic imports in production
const routeModules = import.meta.glob<DocData>("../data/routes/*.json", {
  eager: false,
  import: "default",
});

// Debug: Log module keys on initialization
console.log(
  "🔍 [INIT] routeModules keys:",
  Object.keys(routeModules).slice(0, 10)
);
console.log("🔍 [INIT] Total modules:", Object.keys(routeModules).length);

/**
 * Hook to load component documentation data.
 * Uses the manifest to resolve the file path, then dynamically imports the JSON data.
 *
 * @param path - The route path (e.g., "components/inputs/button")
 * @returns Document data, related docs, loading state, and error
 */
export function useDocData(path: string | undefined): UseDocDataReturn {
  const [doc, setDoc] = useState<DocData | null>(null);
  const [relatedDocs, setRelatedDocs] = useState<DocData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { routeManifest } = useManifest();

  useEffect(() => {
    if (!path || !routeManifest) {
      if (!path) {
        setError(new Error("Path is required"));
      }
      setIsLoading(false);
      return;
    }

    const loadDoc = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Find route in manifest
        const route = routeManifest.routes.find((r) => r.path === `/${path}`);

        if (!route) {
          throw new Error(`Document not found: ${path}`);
        }

        // Extract filename from chunk name
        const filename = route.chunkName.replace("route-", "");

        // Debug logging to see what's available
        console.log("🔍 Looking for filename:", filename);
        console.log("🔍 Route chunkName:", route.chunkName);
        console.log(
          "🔍 Total available modules:",
          Object.keys(routeModules).length
        );
        console.log(
          "🔍 First 5 module keys:",
          Object.keys(routeModules).slice(0, 5)
        );

        // Load the main doc JSON using the pre-defined glob imports
        // Find the importer by matching the filename in the key (handles both dev and prod path formats)
        let docImporter = Object.entries(routeModules).find(([key]) => {
          const matches = key.endsWith(`/${filename}.json`);
          if (filename.includes("components-inputs-button")) {
            console.log(`🔍 Checking key: ${key}, matches: ${matches}`);
          }
          return matches;
        })?.[1];

        // Fallback: If file not found in glob (can happen in Vercel builds due to timing),
        // try dynamic import as a last resort
        let docData: DocData;
        if (!docImporter) {
          console.warn(
            `⚠️  File not in glob, attempting dynamic import for: ${filename}`
          );
          try {
            docData = await import(`../data/routes/${filename}.json`);
          } catch (dynamicImportError) {
            console.error("❌ No importer found for filename:", filename);
            console.error("❌ All available keys:", Object.keys(routeModules));
            console.error("❌ Dynamic import also failed:", dynamicImportError);
            throw new Error(`Route data file not found: ${filename}`);
          }
        } else {
          docData = await docImporter();
        }
        setDoc(docData);

        // Load related docs if specified (limit to 3)
        const relatedIds = (docData?.relatedDocs || []) as string[];
        const relatedPromises = relatedIds
          .slice(0, 3)
          .map(async (id: string) => {
            // Find the importer by matching the filename in the key (handles both dev and prod path formats)
            const relatedImporter = Object.entries(routeModules).find(([key]) =>
              key.endsWith(`/${id}.json`)
            )?.[1];

            // Try glob first, fallback to dynamic import if needed
            try {
              if (relatedImporter) {
                return await relatedImporter();
              }
              // Fallback to dynamic import
              console.warn(
                `⚠️  Related doc not in glob, attempting dynamic import for: ${id}`
              );
              return await import(`../data/routes/${id}.json`);
            } catch {
              return null;
            }
          });

        const relatedData = await Promise.all(relatedPromises);
        setRelatedDocs(relatedData.filter((d): d is DocData => d !== null));
      } catch (err) {
        console.error(`Failed to load doc: ${path}`, err);
        setError(
          err instanceof Error ? err : new Error("Failed to load document")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDoc();
  }, [path, routeManifest]);

  return { doc, relatedDocs, isLoading, error };
}
