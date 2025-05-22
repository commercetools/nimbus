import { atom } from "jotai";
import * as nimbus from "@commercetools/nimbus";

/**
 * Interface for a nimbus export item
 */
export interface NimbusExportItem {
  name: string;
  type: "component" | "hook" | "util" | "type-export";
}

/**
 * Priority order for sorting export types
 */
const typePriority: Record<NimbusExportItem["type"], number> = {
  component: 1,
  hook: 2,
  util: 3,
  "type-export": 4,
};

/**
 * Determines the type of a nimbus export based on its name.
 */
function getExportType(name: string): NimbusExportItem["type"] {
  if (name.startsWith("use")) {
    return "hook";
  }
  if (name.charAt(0) === "_") {
    return "type-export";
  }
  if (name.charAt(0) === name.charAt(0).toUpperCase()) {
    return "component";
  }
  return "util";
}

/**
 * Atom that contains a list of all exports from the @commercetools/nimbus package,
 * categorized and sorted by type and name.
 */
export const nimbusExportsAtom = atom<NimbusExportItem[]>(() => {
  const exportNames = Object.keys(nimbus);

  return exportNames
    .map((name) => ({
      name,
      type: getExportType(name),
    }))
    .sort((a, b) => {
      const typeDiff = typePriority[a.type] - typePriority[b.type];
      return typeDiff !== 0 ? typeDiff : a.name.localeCompare(b.name);
    });
});
