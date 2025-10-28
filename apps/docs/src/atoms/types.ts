import { atom } from "jotai";
import type { ComponentDoc } from "react-docgen-typescript";

/**
 * Cache for loaded component types to avoid re-fetching
 */
const typeCache = new Map<string, ComponentDoc>();

/**
 * Loads a component's type definition dynamically
 * @param componentId - The displayName of the component
 * @param manifest - The types manifest from ManifestProvider context
 * @returns The component's type definition or null if not found
 */
export async function loadComponentType(
  componentId: string,
  manifest: Record<string, string> | null
): Promise<ComponentDoc | null> {
  // Return from cache if already loaded
  if (typeCache.has(componentId)) {
    return typeCache.get(componentId)!;
  }

  // Check if manifest is loaded
  if (!manifest) {
    console.warn("Types manifest not loaded yet");
    return null;
  }

  // Check if component exists in manifest
  const filename = manifest[componentId];
  if (!filename) {
    console.warn(`Component type not found: ${componentId}`);
    return null;
  }

  try {
    // Fetch the component type file from public folder
    const response = await fetch(`/generated/types/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch type: ${response.statusText}`);
    }
    const typeData: ComponentDoc = await response.json();

    // Cache for future use
    typeCache.set(componentId, typeData);

    return typeData;
  } catch (error) {
    console.error(`Error loading type for ${componentId}:`, error);
    return null;
  }
}

/**
 * Atom to manage loaded type data
 * Components are loaded on-demand and stored here
 */
export const typesAtom = atom<Map<string, ComponentDoc>>(new Map());
