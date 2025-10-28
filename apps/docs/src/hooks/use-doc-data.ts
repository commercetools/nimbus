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

        // Load the main doc JSON
        const docData = await import(`../data/routes/${filename}.json`);
        setDoc(docData.default || docData);

        // Load related docs if specified (limit to 3)
        const relatedIds = (docData.default?.relatedDocs ||
          docData.relatedDocs ||
          []) as string[];
        const relatedPromises = relatedIds
          .slice(0, 3)
          .map((id: string) =>
            import(`../data/routes/${id}.json`)
              .then((data) => data.default || data)
              .catch(() => null)
          );

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
