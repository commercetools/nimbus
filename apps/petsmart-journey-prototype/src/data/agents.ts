export type AgentSource = "ct" | "petsmart";

export interface AgentInfo {
  id: string;
  name: string;
  source: AgentSource;
  description: string;
}

/**
 * Agent registry for the prototype.
 * ct agents are built by commercetools. The PetSmart agent is built by PetSmart.
 */
export const agents: Record<string, AgentInfo> = {
  "petsmart-commerce-intelligence": {
    id: "petsmart-commerce-intelligence",
    name: "PetSmart Commerce Intelligence",
    source: "petsmart",
    description:
      "Surfaces inventory, margin, competitive, and channel analytics data from PetSmart's internal systems",
  },
  "ct-promotions": {
    id: "ct-promotions",
    name: "Promotions Agent",
    source: "ct",
    description:
      "Provides discount impact previews, conflict detection, and predicate suggestions",
  },
  "ct-product-enrichment": {
    id: "ct-product-enrichment",
    name: "Product Enrichment Agent",
    source: "ct",
    description:
      "Readiness scoring, category suggestions, SEO metadata generation, and variant recommendations",
  },
};

/** Convenience lookup for the single PetSmart agent */
export const petsmartAgent = agents["petsmart-commerce-intelligence"];

/** Convenience lookup for ct agents */
export const ctPromotionsAgent = agents["ct-promotions"];
export const ctProductEnrichmentAgent = agents["ct-product-enrichment"];
