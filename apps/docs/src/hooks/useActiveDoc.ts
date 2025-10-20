import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { documentationAtom } from "@/atoms/documentation";
import { activeRouteAtom } from "@/atoms/route";
import type { MdxFileFrontmatter } from "@/types";

/**
 * Hook to get the currently active document.
 *
 * This hook uses direct lookup from the documentation object instead of
 * relying on the derived activeDocAtom, which eliminates race conditions
 * during navigation when async atoms can be out of sync.
 *
 * @returns The active document's frontmatter, or undefined if not found
 */
export const useActiveDoc = (): MdxFileFrontmatter | undefined => {
  const documentation = useAtomValue(documentationAtom);
  const activeRoute = useAtomValue(activeRouteAtom);

  const activeDoc = useMemo(() => {
    const doc = Object.values(documentation).find(
      (doc) => doc.meta.route === activeRoute
    );
    console.log("[useActiveDoc] Looking up:", {
      activeRoute,
      found: !!doc,
      foundRoute: doc?.meta.route,
    });
    return doc;
  }, [documentation, activeRoute]);

  return activeDoc;
};
