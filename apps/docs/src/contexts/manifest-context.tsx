import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
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

type ManifestContextValue = {
  manifest: RouteManifest | null;
  isLoading: boolean;
};

const ManifestContext = createContext<ManifestContextValue | undefined>(
  undefined
);

/**
 * ManifestProvider loads and provides the route manifest to the entire app.
 * This is loaded once at app startup for optimal performance.
 */
export function ManifestProvider({ children }: { children: ReactNode }) {
  const [manifest, setManifest] = useState<RouteManifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load manifest on mount
    const loadManifest = async () => {
      try {
        const manifestData = await import("../data/route-manifest.json");
        setManifest(manifestData.default || manifestData);
      } catch (error) {
        console.error("Failed to load route manifest:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadManifest();
  }, []);

  return (
    <ManifestContext.Provider value={{ manifest, isLoading }}>
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
