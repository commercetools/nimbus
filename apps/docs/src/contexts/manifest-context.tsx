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
 */
export function ManifestProvider({ children }: { children: ReactNode }) {
  const [routeManifest, setRouteManifest] = useState<RouteManifest | null>(
    null
  );
  const [typesManifest, setTypesManifest] = useState<TypesManifest | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load both manifests on mount
    const loadManifests = async () => {
      try {
        const [routeData, typesData] = await Promise.all([
          import("../data/route-manifest.json"),
          // Fetch types manifest from public folder (available in production)
          fetch("/generated/types/manifest.json").then((res) => res.json()),
        ]);

        setRouteManifest(routeData.default || routeData);
        setTypesManifest(typesData);
      } catch (error) {
        console.error("Failed to load manifests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadManifests();
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
