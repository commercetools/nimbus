import { atom } from "jotai";
import type { ComponentDoc } from "react-docgen-typescript";
import manifest from "./../data/types/manifest.json";

/**
 * Cache for loaded component types to avoid re-fetching
 */
const typeCache = new Map<string, ComponentDoc>();

/**
 * Loads a component's type definition dynamically
 * @param componentId - The displayName of the component
 * @returns The component's type definition or null if not found
 */
export async function loadComponentType(
  componentId: string
): Promise<ComponentDoc | null> {
  // Return from cache if already loaded
  if (typeCache.has(componentId)) {
    return typeCache.get(componentId)!;
  }

  // Check if component exists in manifest
  const filename = manifest[componentId as keyof typeof manifest];
  if (!filename) {
    console.warn(`Component type not found: ${componentId}`);
    return null;
  }

  try {
    // Dynamically import the component type file
    const typeModule = await import(`./../data/types/${filename}`);
    const typeData: ComponentDoc = typeModule.default;

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
