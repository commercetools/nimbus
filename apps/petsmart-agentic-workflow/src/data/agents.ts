export type AgentSource = "ct" | "customer";

export interface AgentInfo {
  id: string;
  name: string;
  pipelineStep: number;
  source: AgentSource;
  description: string;
}

export const agents: Record<string, AgentInfo> = {
  inventory: { id: "inventory", name: "Inventory Agent", pipelineStep: 1, source: "customer", description: "Surfaces slow-moving stock data from PetSmart's warehouse system" },
  strategy: { id: "strategy", name: "Strategy Agent", pipelineStep: 2, source: "ct", description: "Suggests promotional strategy based on current catalog structure and seasonality" },
  promo: { id: "promo", name: "Promo Agent", pipelineStep: 3, source: "ct", description: "Generates discount configurations, predicate assistance, and conflict detection" },
  preview: { id: "preview", name: "Preview Agent", pipelineStep: 4, source: "ct", description: "Simulates cart outcomes and validates discount behavior" },
  badge: { id: "badge", name: "Badge Agent", pipelineStep: 5, source: "ct", description: "Reads discount configuration and generates product listing badges" },
  data: { id: "data", name: "Data Agent", pipelineStep: 7, source: "ct", description: "Provides order data, code usage, and revenue metrics from commercetools" },
  reporting: { id: "reporting", name: "Reporting Agent", pipelineStep: 8, source: "customer", description: "Provides BI data, cross-channel attribution from PetSmart's data warehouse" },
  orchestrator: { id: "orchestrator", name: "PetSmart Orchestrator", pipelineStep: 0, source: "customer", description: "Coordinates all agents into a single unified experience" },
};

// Pipeline steps including the human gate
export const pipelineSteps = [
  { step: 1, agentId: "inventory", label: "Inventory" },
  { step: 2, agentId: "strategy", label: "Strategy" },
  { step: 3, agentId: "promo", label: "Promo" },
  { step: 4, agentId: "preview", label: "Preview" },
  { step: 5, agentId: "badge", label: "Badge" },
  { step: 6, agentId: null, label: "Approve", isHumanGate: true },
  { step: 7, agentId: "data", label: "Data" },
  { step: 8, agentId: "reporting", label: "Reporting" },
];
