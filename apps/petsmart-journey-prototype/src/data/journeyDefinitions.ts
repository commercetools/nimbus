import type { TourStep } from "../components/Tour";
import type { Persona } from "./personas";
import { personas } from "./personas";

export type JourneyMode =
  "strategy" | "evaluation" | "execution" | "correction";

export interface JourneyDefinition {
  id: number;
  title: string;
  mode: JourneyMode;
  persona: Persona;
  coreQuestion: string;
  /** Detailed description explaining why a PetSmart evaluator should care */
  description: string;
  /** Route path for the first view in this journey */
  startPath: string;
  /** Compact breadcrumb of view names in order */
  viewSequence: string[];
  /** Tour steps spanning all views — includes navigateTo for cross-page transitions */
  tourSteps: TourStep[];
}

// ─── Journey 1: Strategy (Dana) ─────────────────────────────────────────────

const j1Steps: TourStep[] = [
  // Product List
  {
    selector: "[data-tour='inline-slot']",
    title: "The category picture",
    description:
      'Dana opens the product list filtered to Dog Toys > Outdoor. Above the table, the agent shows the category-level picture: "$340K in stock aging past 60 days across 47 SKUs." It also surfaces a channel breakdown: "This category is down 12% online but flat in-store."',
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='product-table']",
    title: "The table",
    description:
      "PetSmart's agent has enriched the list with data from their inventory system and analytics provider. Notice the extra columns on flagged rows: days-on-hand, velocity trend, and margin headroom. This inventory data doesn't exist in commercetools.",
    renderTarget: "augmentation",
    placement: "bottom",
  },
  {
    selector: "[data-tour='view-inventory-action']",
    title: "The next step",
    description:
      'The agent has added a ✦ "View inventory" action to each flagged row. Dana clicks it to see channel-level sales and inventory data for a specific slow-moving SKU.',
    renderTarget: "augmentation",
    placement: "left",
    navigateTo: "/products/outdoor-fetch-toy",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "One product, full context",
    description:
      'The agent has placed a context panel combining order history by channel (ct), impressions and conversion (PetSmart analytics), and days-on-hand (PetSmart inventory). Key insight: "This SKU has strong conversion when viewed (3.8% vs. 2.1% category avg) but low impressions online."',
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Interrogating the data",
    description:
      'Every piece of agent-provided data includes the agent\'s name, a short explanation, a feedback rating, and a "Chat about this" button. The tutorial clicks "Chat about this" on the conversion insight.',
    renderTarget: "augmentation",
    placement: "right",
    action: "openPanel",
  },
  {
    selector: "[data-tour='model-promotions-btn']",
    title: "Moving to scenarios",
    description:
      'The agent has added a ✦ "Model promotions" button to the toolbar. Dana clicks it to open the configuration playground with pre-populated clearance scenarios.',
    renderTarget: "augmentation",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Pre-populated scenarios",
    description:
      'The scenarios are pre-populated based on what Dana has been reviewing. Each shows projected margin impact, estimated clearance timeline, and channel-level breakdown. Historical performance is surfaced: "Last Q3, a 20% clearance on outdoor toys cleared 78% of aging stock in 3 weeks."',
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Chat: redirecting the agent's guess",
    description:
      'The chat opens with context: "You\'ve been reviewing aging inventory in Dog Toys > Outdoor. I\'ve pre-populated clearance scenarios for the 47 SKUs aging past 60 days." Dana replies: "What if I only target the online channel?" The agent responds with an updated online-only scenario.',
    renderTarget: "panel",
    placement: "left",
    action: "openPanel",
  },
];

// ─── Journey 2: Evaluation (Carlos) ─────────────────────────────────────────

const j2Steps: TourStep[] = [
  // Product List
  {
    selector: "[data-tour='inline-slot']",
    title: "The blast radius",
    description:
      "Carlos opens the product list filtered to Hill's Science Diet. The agent has calculated the margin impact on every SKU using supplier cost data from PetSmart's procurement system. A summary panel shows: \"68 of 120 SKUs now below margin floor. Estimated annual revenue at risk: $2.1M.\"",
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='product-table']",
    title: "Per-SKU margin impact",
    description:
      'Each flagged row shows the new margin alongside the old: "margin now 14%, was 22%, below 18% floor." Without this view, Carlos would need to export pricing, pull cost data from the ERP, and build a spreadsheet.',
    renderTarget: "augmentation",
    placement: "bottom",
  },
  {
    selector: "[data-tour='view-response-action']",
    title: "Drilling in",
    description:
      'The agent has added a ✦ "View response options" action to each flagged row. Carlos clicks it to see response options for a high-revenue SKU.',
    renderTarget: "augmentation",
    placement: "left",
    navigateTo: "/products/hills-science-diet-30lb",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Multiple levers, one view",
    description:
      "The agent shows the full option landscape: absorb the cost (margin drops to 14%), pass-through (price → $X, competitor PetCo at $Y), substitute with house-brand (32% margin), or promotional offset (bundle with accessories).",
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Interrogating the data",
    description:
      'Carlos clicks "open chat" on PetCo\'s price. The chat opens: "PetCo\'s price of $52.99 comes from PetSmart\'s competitive intelligence feed, last updated 2 days ago. This SKU has been at this price for 3 weeks." Carlos asks: "What\'s the price elasticity here?"',
    renderTarget: "panel",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-alternatives-btn']",
    title: "Exploring substitution",
    description:
      'The decision panel includes a ✦ "View alternatives" action. Carlos clicks it to see house-brand products in the same category.',
    renderTarget: "augmentation",
    placement: "right",
    navigateTo: "/products?filter=house-brand",
  },
  // Product List (house-brand)
  {
    selector: "[data-tour='product-table']",
    title: "Evaluating substitution",
    description:
      'The agent surfaces comparison data: margin differential, sales velocity by channel, and customer overlap. A callout flags a risk: "⚠ Hill\'s customers have 74% repurchase rate. Substitution may risk churn on loyal customers."',
    renderTarget: "augmentation",
    placement: "bottom",
  },
  {
    selector: "[data-tour='model-scenarios-btn']",
    title: "Moving to scenarios",
    description:
      'The agent has added a ✦ "Model scenarios" button to the toolbar. It appears now because Carlos has assessed the damage, evaluated per-SKU options, and reviewed substitutes.',
    renderTarget: "augmentation",
    placement: "left",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Numbers for the stakeholder meeting",
    description:
      'Scenarios are pre-populated from everything Carlos reviewed: "Bundle Hill\'s 30lb + house-brand treats at combined margin of 19%", "Volume discount: Buy 2 bags, save $5." Historical data: "Last time you raised prices 6%, volume dropped 4% over 8 weeks."',
    renderTarget: "inline",
    placement: "bottom",
  },
];

// ─── Journey 3: Execution (Dana) ────────────────────────────────────────────

const j3Steps: TourStep[] = [
  // Discount Detail
  {
    selector: "[data-tour='predicate-builder']",
    title: "Building the discount",
    description:
      'Dana is creating "Back to School Pet Prep — Collars." The agent suggests targeting rules: "Category: Dog Supplies > Collars & Leashes", "Inventory > 20 units." It also catches a mistake: "This rule also matches Cat Collars — 34 unintended SKUs. Add an exclusion?"',
    renderTarget: "augmentation",
    placement: "bottom",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Interrogating the overlap",
    description:
      "The chat opens with context: \"Your rule targets 'Collars & Leashes,' which matches Dog Supplies > Collars & Leashes (55 SKUs) as intended, but also matches Cat Collars (34 SKUs) because of the shared keyword.\"",
    renderTarget: "panel",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='simulate-campaign-btn']",
    title: "Simulating the campaign",
    description:
      'The agent has added a ✦ "Simulate campaign" button to the toolbar. Dana clicks it to test all three discounts together.',
    renderTarget: "augmentation",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Simulating the full campaign",
    description:
      'All three discounts simulated together: "Cart with 2 collars + 1 leash: total discount $8.50, margin 22% ✓." A conflict is flagged: "Active \'Loyalty 10%\' stacks with crates, pushing 12 SKUs below margin floor."',
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Chat: exploring the fix",
    description:
      'The chat opens: "I found a stacking conflict: \'Loyalty 10%\' combines with crates on 12 SKUs." Dana asks: "What happens if I make crates non-stackable?" The agent shows the trade-off: resolves margin but Loyalty members lose their 10% on crates.',
    renderTarget: "panel",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='check-coverage-btn']",
    title: "Checking coverage",
    description:
      'The simulation results include a ✦ "Check coverage" action. Dana clicks it to see the campaign\'s targeted products.',
    renderTarget: "augmentation",
    placement: "right",
    navigateTo: "/products?filter=back-to-school",
  },
  // Product List
  {
    selector: "[data-tour='product-table']",
    title: "Verifying coverage",
    description:
      "The product list now shows campaign-specific data: which discount matches each product, the effective discount %, and badge status. Products missing coverage are highlighted. Products unintentionally matched are flagged.",
    renderTarget: "augmentation",
    placement: "bottom",
  },
  {
    selector: "[data-tour='set-badge-action']",
    title: "Fixing a badge",
    description:
      'The agent has added a ✦ "Set badge" action on rows where the promotional badge is missing. Dana clicks it.',
    renderTarget: "augmentation",
    placement: "left",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Closing the merchandising gap",
    description:
      'This leash product has no promotional badge. The agent suggests copy: "Save 15% — Back to School Pet Prep." It flags the scope: "23 of 89 matched products are missing badges." Today, someone hand-edits each product one at a time.',
    renderTarget: "augmentation",
    placement: "bottom",
  },
];

// ─── Journey 4: Correction (Priya) ──────────────────────────────────────────

const j4Steps: TourStep[] = [
  // Discount List
  {
    selector: "[data-tour='inline-slot']",
    title: "The dashboard",
    description:
      'Priya selects the "Back to School Pet Prep" campaign group. Analytics charts show: collars 14% redemption (✓), crates 17% (✓), leashes 3% (⚠ flagged). The leashes discount is dramatically underperforming.',
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='diagnosis-card']",
    title: "The diagnosis",
    description:
      'The agent assembles a preliminary diagnosis: "Page impressions on leash products are 60% below category average" (PetSmart analytics), "Competitor PetCo launched 20% off leashes 5 days ago" (competitive feed). Two problems, different sources.',
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Interrogating the data",
    description:
      'Priya clicks "Chat about this" on the PetCo alert. The chat opens: "Their \'Leash & Harness Sale\' (20%) was first detected Aug 26. 78% of your leash products have a matching SKU on PetCo\'s promotion."',
    renderTarget: "panel",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='diagnose-action']",
    title: "Digging deeper",
    description:
      'The agent has added a ✦ "Diagnose underperformance" action on the flagged row. Priya clicks it.',
    renderTarget: "augmentation",
    placement: "left",
    navigateTo: "/discounts/back-to-school-leashes",
  },
  // Discount Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "The badge gap",
    description:
      'Diagnostic charts alongside the form: "Badge set on only 12 of 31 targeted leash products — 61% aren\'t showing the offer." The other discounts: "Collars and crates both have >90% badge coverage. The gap is leashes-specific."',
    renderTarget: "inline",
    placement: "bottom",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Chat: interrogating the diagnosis",
    description:
      'The chat opens: "The leashes discount has two problems: 61% missing badges and PetCo\'s competing 20% off." Priya asks: "When did leashes start dropping?" The agent shows a timeline: 8% redemption first 5 days, then 1% after PetCo\'s launch.',
    renderTarget: "panel",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-badge-gap-btn']",
    title: "Seeing the gap",
    description:
      'The diagnostic charts include a ✦ "View badge gap" action. Priya clicks it to see the impact on a specific leash product.',
    renderTarget: "augmentation",
    placement: "right",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Seeing the gap firsthand",
    description:
      'This leash product is missing its badge. The agent shows: "412 impressions this week, 3 orders. Leash products with badges average 1,100 impressions." Competitive: "Your price after discount: $21.24. PetCo: $19.99."',
    renderTarget: "augmentation",
    placement: "bottom",
  },
  {
    selector: "[data-tour='model-pivot-btn']",
    title: "Modeling the pivot",
    description:
      'The agent has added a ✦ "Model pivot" button to the toolbar. Priya clicks it to open the configuration playground with pivot scenarios.',
    renderTarget: "augmentation",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Choosing a response",
    description:
      'Scenarios from the diagnosis: "Deepen leashes to 20% (matches competitor)", "Bundle leash + collar at combined 20%", "Fix badge coverage first." Key finding: "Fixing badges alone lifts redemption from 3% to ~9%. Deepening to 20% projects ~16%."',
    renderTarget: "inline",
    placement: "bottom",
  },
];

// ─── Journey registry ───────────────────────────────────────────────────────

export const journeys: JourneyDefinition[] = [
  {
    id: 1,
    title: "Clear Aging Inventory",
    mode: "strategy",
    persona: personas.dana,
    coreQuestion: "What should we promote to clear this aging stock?",
    description:
      "Dana identifies $340K in aging outdoor dog toys and diagnoses a channel-specific problem: online sales are down 12% while in-store is flat. The agent surfaces inventory days-on-hand, channel performance, and margin headroom directly in the product list — then pre-populates clearance scenarios with projected margin impact and historical performance. Three views, no spreadsheets, no separate BI tool. The key: every data point the agent surfaces comes from correlating PetSmart's external data (inventory, analytics) with ct product data.",
    startPath: "/products",
    viewSequence: ["Product List", "Product Detail", "Playground"],
    tourSteps: j1Steps,
  },
  {
    id: 2,
    title: "Supplier Cost Increase",
    mode: "evaluation",
    persona: personas.carlos,
    coreQuestion:
      "Costs went up — what levers do we have and what should I recommend?",
    description:
      "Carlos assesses the blast radius of an 8% wholesale cost increase across 120+ SKUs: 68 now below the margin floor, $2.1M at risk. The agent shows per-SKU margin impact alongside competitive pricing and house-brand alternatives — data that requires correlating ct pricing with PetSmart's supplier cost feed and competitive intelligence. Carlos evaluates multiple levers (absorb, pass-through, substitute, promotional offset), reviews substitution risks, and walks into a stakeholder meeting with quantitative backing for a multi-lever recommendation, assembled entirely within the MC.",
    startPath: "/products",
    viewSequence: [
      "Product List",
      "Product Detail",
      "Product List",
      "Playground",
    ],
    tourSteps: j2Steps,
  },
  {
    id: 3,
    title: "Execute a Complex Promotion",
    mode: "execution",
    persona: personas.dana,
    coreQuestion:
      "I know what to build — help me build it right and prove it works before launch",
    description:
      'Dana builds a 3-discount "Back to School Pet Prep" campaign. The agent catches a predicate that accidentally matches 34 Cat Collar SKUs, identifies a stacking conflict with the Loyalty discount that would push 12 products below the margin floor, simulates all three discounts against sample carts, and flags 23 products missing promotional badges. Each of these is a concrete error with direct revenue impact — wrong predicates erode margin, stacking violations compound, missing badges hide the promotion from customers.',
    startPath: "/discounts/back-to-school-collars",
    viewSequence: [
      "Discount Detail",
      "Playground",
      "Product List",
      "Product Detail",
    ],
    tourSteps: j3Steps,
  },
  {
    id: 4,
    title: "Underperforming Promotion",
    mode: "correction",
    persona: personas.priya,
    coreQuestion:
      "This promotion is underperforming — why, and how do I pivot now?",
    description:
      "Priya discovers that the leashes discount in an otherwise successful campaign has 3% redemption vs. a 15% target. The agent diagnoses two root causes: 61% of leash products are missing promotional badges (a merchandising execution gap), and a competitor launched 20% off leashes 5 days ago. A daily timeline shows exactly when the drop started. The pivot scenarios show that fixing badges alone lifts redemption from 3% to ~9% — a conclusion that requires correlating ct redemption data with PetSmart's impression analytics and competitive intelligence feed.",
    startPath: "/discounts",
    viewSequence: [
      "Discount List",
      "Discount Detail",
      "Product Detail",
      "Playground",
    ],
    tourSteps: j4Steps,
  },
];
