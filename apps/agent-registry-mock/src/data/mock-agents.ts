export interface MockAgent {
  key: string;
  name: string;
  description: string;
  publisher: string;
  publisherType: "commercetools" | "partner" | "organization";
  status: "ACTIVE" | "DRAFT" | "DISABLED";
  installed: boolean;
  version: string;
  lastUpdated: string;
  channels: string[];
  capabilities: string[];
  requiredScopes: Array<{ scope: string; description: string }>;
  hitl: boolean;
}

export const mockAgents: MockAgent[] = [
  {
    key: "product-enrichment-agent",
    name: "Product Enrichment Agent",
    description:
      "Proposes catalog attribute updates, generates missing product descriptions, and flags incomplete listings for review.",
    publisher: "commercetools",
    publisherType: "commercetools",
    status: "ACTIVE",
    installed: true,
    version: "2.4.0",
    lastUpdated: "2026-08-12",
    channels: ["MC", "MosAIc"],
    capabilities: [
      "Draft product descriptions from attribute data",
      "Detect missing or inconsistent attributes",
      "Suggest category assignments",
    ],
    requiredScopes: [
      { scope: "view_products", description: "Read catalog data" },
      {
        scope: "manage_products",
        description: "Write staged product changes",
      },
    ],
    hitl: true,
  },
  {
    key: "order-intake-agent",
    name: "Order Intake Agent",
    description:
      "Watches inbound order channels and stages order corrections for anomalies such as address mismatches or split shipments.",
    publisher: "commercetools",
    publisherType: "commercetools",
    status: "ACTIVE",
    installed: true,
    version: "1.9.2",
    lastUpdated: "2026-08-18",
    channels: ["MC"],
    capabilities: [
      "Validate incoming order payloads",
      "Flag address and payment mismatches",
      "Propose order line corrections",
    ],
    requiredScopes: [
      { scope: "view_orders", description: "Read order data" },
      {
        scope: "manage_orders",
        description: "Write staged order corrections",
      },
    ],
    hitl: true,
  },
  {
    key: "pricing-optimization-agent",
    name: "Pricing Optimization Agent",
    description:
      "Analyzes market and margin data to propose price adjustments across price books, with full audit history.",
    publisher: "Akeneo",
    publisherType: "partner",
    status: "ACTIVE",
    installed: true,
    version: "0.8.1",
    lastUpdated: "2026-07-30",
    channels: ["MC"],
    capabilities: [
      "Recommend price changes by segment",
      "Simulate margin impact before publishing",
      "Surface competitor price signals",
    ],
    requiredScopes: [
      { scope: "view_products", description: "Read catalog data" },
      { scope: "manage_prices", description: "Write staged price changes" },
    ],
    hitl: true,
  },
  {
    key: "inventory-forecasting-agent",
    name: "Inventory Forecasting Agent",
    description:
      "Forecasts demand from historical sales and stages replenishment recommendations for merchandiser approval.",
    publisher: "PetSmart",
    publisherType: "partner",
    status: "DRAFT",
    installed: false,
    version: "0.3.0",
    lastUpdated: "2026-08-05",
    channels: ["MC", "Teams"],
    capabilities: [
      "Forecast SKU-level demand",
      "Propose replenishment quantities",
      "Alert on stockout risk",
    ],
    requiredScopes: [
      { scope: "view_inventory", description: "Read inventory levels" },
      {
        scope: "manage_inventory",
        description: "Write staged replenishment orders",
      },
    ],
    hitl: true,
  },
  {
    key: "customer-service-agent",
    name: "Customer Service Agent",
    description:
      "Drafts responses to common customer inquiries across support channels, escalating anything outside its guardrails.",
    publisher: "commercetools",
    publisherType: "commercetools",
    status: "ACTIVE",
    installed: true,
    version: "3.1.0",
    lastUpdated: "2026-08-20",
    channels: ["MC", "Teams", "MosAIc"],
    capabilities: [
      "Draft responses to order status inquiries",
      "Summarize customer history for agents",
      "Escalate out-of-policy requests to a human",
    ],
    requiredScopes: [
      { scope: "view_customers", description: "Read customer profile data" },
      { scope: "view_orders", description: "Read order data" },
    ],
    hitl: true,
  },
  {
    key: "category-management-agent",
    name: "Category Management Agent",
    description:
      "Reorganizes category trees based on catalog growth and staged navigation changes for merchandiser sign-off.",
    publisher: "Acme Retail Group",
    publisherType: "organization",
    status: "DRAFT",
    installed: false,
    version: "0.1.4",
    lastUpdated: "2026-07-22",
    channels: ["MC"],
    capabilities: [
      "Propose category tree restructuring",
      "Detect orphaned or duplicate categories",
      "Draft navigation updates for review",
    ],
    requiredScopes: [
      { scope: "view_categories", description: "Read category tree data" },
      {
        scope: "manage_categories",
        description: "Write staged category changes",
      },
    ],
    hitl: true,
  },
  {
    key: "returns-processing-agent",
    name: "Returns Processing Agent",
    description:
      "Reviews return requests against policy and stages approval or rejection recommendations for support staff.",
    publisher: "commercetools",
    publisherType: "commercetools",
    status: "DISABLED",
    installed: true,
    version: "1.2.3",
    lastUpdated: "2026-06-14",
    channels: ["MC"],
    capabilities: [
      "Evaluate return requests against policy",
      "Recommend approve or reject decisions",
      "Draft refund line items",
    ],
    requiredScopes: [
      { scope: "view_orders", description: "Read order data" },
      { scope: "manage_returns", description: "Write staged return decisions" },
    ],
    hitl: true,
  },
  {
    key: "content-localization-agent",
    name: "Content Localization Agent",
    description:
      "Drafts localized product content across markets and flags translations that need human review before publishing.",
    publisher: "commercetools",
    publisherType: "commercetools",
    status: "ACTIVE",
    installed: false,
    version: "1.0.5",
    lastUpdated: "2026-08-09",
    channels: ["MC", "MosAIc"],
    capabilities: [
      "Draft localized product titles and descriptions",
      "Flag low-confidence translations",
      "Track localization coverage by market",
    ],
    requiredScopes: [
      { scope: "view_products", description: "Read catalog data" },
      {
        scope: "manage_products",
        description: "Write staged localized content",
      },
    ],
    hitl: true,
  },
];
