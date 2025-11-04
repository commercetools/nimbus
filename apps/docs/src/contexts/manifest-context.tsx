import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";

/**
 * Route manifest structure
 */
export type RouteManifest = {
  routes: Array<{
    path: string;
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    menu: string[];
    order: number;
    chunkName: string;
    icon?: string;
  }>;
  categories: Array<{
    id: string;
    label: string;
    items: Array<{
      id: string;
      title: string;
      path: string;
    }>;
  }>;
};

/**
 * Types manifest structure - maps component names to type filenames
 */
export type TypesManifest = Record<string, string>;

type ManifestContextValue = {
  routeManifest: RouteManifest | null;
  typesManifest: TypesManifest | null;
  isLoading: boolean;
};

const ManifestContext = createContext<ManifestContextValue | undefined>(
  undefined
);

/**
 * ManifestProvider loads and provides both route and types manifests to the entire app.
 * Both manifests are loaded once at app startup for optimal performance.
 *
 * HMR Support: When manifest files change during development, this component
 * automatically reloads them using cache-busting timestamps.
 */
export function ManifestProvider({ children }: { children: ReactNode }) {
  const [routeManifest, setRouteManifest] = useState<RouteManifest | null>(
    null
  );
  const [typesManifest, setTypesManifest] = useState<TypesManifest | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  // Version state for HMR - increment to trigger re-load
  const [manifestVersion, setManifestVersion] = useState(0);

  useEffect(() => {
    // Load both manifests on mount and when manifestVersion changes (HMR)
    const loadManifests = async () => {
      try {
        // Dynamic import - Vite's module graph will provide fresh data after HMR invalidation
        const [routeData, typesData] = await Promise.all([
          import("../data/route-manifest.json"),
          import("../data/types/manifest.json"),
        ]);

        setRouteManifest(routeData.default || routeData);
        setTypesManifest(typesData.default || typesData);
      } catch (error) {
        console.error("Failed to load manifests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadManifests();
  }, [manifestVersion]);

  // HMR: Accept updates to manifest files and trigger reload
  useEffect(() => {
    if (import.meta.hot) {
      // Accept changes to manifest files - new modules passed as callback parameter
      import.meta.hot.accept(
        ["../data/route-manifest.json", "../data/types/manifest.json"],
        ([newRouteModule, newTypesModule]) => {
          console.log("[HMR] Manifest files updated, applying changes...");

          // If new modules provided directly, use them
          if (newRouteModule) {
            setRouteManifest(newRouteModule.default || newRouteModule);
          }
          if (newTypesModule) {
            setTypesManifest(newTypesModule.default || newTypesModule);
          }

          // If modules not provided, increment version to re-import
          if (!newRouteModule || !newTypesModule) {
            setIsLoading(true);
            setManifestVersion((v) => v + 1);
          }
        }
      );
    }
  }, []);

  // Memoize context value to prevent unnecessary rerenders in consumers
  const value = useMemo(
    () => ({ routeManifest, typesManifest, isLoading }),
    [routeManifest, typesManifest, isLoading]
  );

  return (
    <ManifestContext.Provider value={value}>
      {children}
    </ManifestContext.Provider>
  );
}

/**
 * Hook to access the route manifest
 */
export function useManifest() {
  const context = useContext(ManifestContext);
  if (!context) {
    throw new Error("useManifest must be used within ManifestProvider");
  }
  return context;
}
