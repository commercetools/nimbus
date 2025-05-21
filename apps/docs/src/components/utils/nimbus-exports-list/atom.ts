import { atom } from "jotai";
import * as nimbus from "@commercetools/nimbus";

/**
 * Interface for a nimbus export item
 */
export interface NimbusExportItem {
  name: string;
  type:
    | "component"
    | "compound-component"
    | "subcomponent"
    | "hook"
    | "util"
    | "unknown";
}

/**
 * Atom that contains a list of all exports from the @commercetools/nimbus package
 */
export const nimbusExportsAtom = atom<NimbusExportItem[]>(() => {
  // Get all export names from the nimbus package
  const exportNames = Object.keys(nimbus);

  // Categorize exports based on naming conventions or inspection
  return exportNames
    .map((name) => {
      let type: NimbusExportItem["type"] = "unknown";

      // Categorize based on conventions
      if (name.startsWith("use")) {
        type = "hook";
      } else if (name.charAt(0) === "_") {
        // Subcomponents now go to unknown
        type = "unknown";
      } else if (name.charAt(0) === name.charAt(0).toUpperCase()) {
        // All components (including compound components) are now just "component"
        type = "component";
      } else if (
        typeof nimbus[name as keyof typeof nimbus] === "function" &&
        !name.startsWith("use")
      ) {
        type = "util";
      }

      return {
        name,
        type,
      };
    })
    .sort((a, b) => {
      // Define priority order for types
      const typePriority = {
        component: 1,
        hook: 2,
        util: 3,
        unknown: 4,
        "compound-component": 4,
        subcomponent: 4,
      };

      // Compare by type priority first
      const typeDiff = typePriority[a.type] - typePriority[b.type];

      // If same type, sort alphabetically by name
      return typeDiff !== 0 ? typeDiff : a.name.localeCompare(b.name);
    });
});
