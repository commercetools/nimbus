import { atom } from "jotai";
import * as nimbus from "@commercetools/nimbus";
import {
  categorizeExports,
  getExportType,
} from "../components/status/nimbus-exports-status/utils/export-utils";
import docsData from "../data/docs.json";

export type NimbusExportCategory = {
  components: string[];
  hooks: string[];
  theme: string[];
  other: string[];
};

export interface NimbusExportItem {
  name: string;
  type: string;
  description: string;
  docPath?: string;
  docRoute?: string;
  componentStatus?: string;
}

export interface NimbusExportsData {
  components: NimbusExportItem[];
  hooks: NimbusExportItem[];
  theme: NimbusExportItem[];
  other: NimbusExportItem[];
}

// Define the atom that will store the categorized exports
export const nimbusExportsAtom = atom<NimbusExportsData>({
  components: [],
  hooks: [],
  theme: [],
  other: [],
});

// Helper function to find documentation by export name
const findDocForExport = (exportName: string) => {
  // Go through all docs and find one with a matching title
  for (const [path, docData] of Object.entries(docsData)) {
    if (docData.meta.title === exportName) {
      return {
        description: docData.meta.description || "No description available",
        docPath: path,
        docRoute: docData.meta.route || undefined,
        componentStatus: docData.meta.componentStatus || null, // Return null instead of "stable" default
      };
    }
  }

  return {
    description: "No documentation available",
    docPath: undefined,
    docRoute: undefined,
    componentStatus: null, // Return null instead of "stable" default
  };
};

// Define a derived atom that will compute the categorized exports with documentation
export const nimbusExportsCategorizedAtom = atom(
  (get) => get(nimbusExportsAtom),
  (_get, set) => {
    const categorized = categorizeExports(nimbus);
    const enrichedExports: NimbusExportsData = {
      components: [],
      hooks: [],
      theme: [],
      other: [],
    };

    // Process each category and enrich with documentation data
    Object.entries(categorized).forEach(([category, exports]) => {
      const categoryKey = category as keyof NimbusExportCategory;

      enrichedExports[categoryKey] = exports.map((exportName) => {
        const exportType = getExportType(
          nimbus[exportName as keyof typeof nimbus],
          exportName
        );

        const docInfo = findDocForExport(exportName);

        return {
          name: exportName,
          type: exportType,
          description: docInfo.description,
          docPath: docInfo.docPath,
          docRoute: docInfo.docRoute,
          componentStatus: docInfo.componentStatus,
        };
      });
    });

    set(nimbusExportsAtom, enrichedExports);
  }
);
