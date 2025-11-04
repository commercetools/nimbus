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

        // Load the main doc JSON using the pre-defined glob imports
        // Find the importer by matching the filename in the key (handles both dev and prod path formats)
        const docImporter = Object.entries(routeModules).find(([key]) =>
          key.endsWith(`/${filename}.json`)
        )?.[1];

        if (!docImporter) {
          throw new Error(`Route data file not found: ${filename}`);
        }

        const docData = await docImporter();
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

            if (!relatedImporter) {
              return null;
            }
            try {
              return await relatedImporter();
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
