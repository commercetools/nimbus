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
  /** Tour steps spanning all views. includes navigateTo for cross-page transitions */
  tourSteps: TourStep[];
}

// ─── Journey 1: Strategy (Dana) ─────────────────────────────────────────────

const j1Steps: TourStep[] = [
  // Product List
  {
    selector: "[data-tour='inline-slot']",
    title: "Inventory data in the product list",
    description:
      "This card combines PetSmart inventory data with ct product data. Neither system alone shows that $340K in aging stock is a channel-specific problem. That requires correlating days-on-hand with channel sales analytics.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='agent-columns']",
    title: "External data as table columns",
    description:
      "Days-on-hand, velocity, and margin come from PetSmart's systems and appear as extra columns. Dana scans the table the same way she always does, but the aging problem is now visible at a glance.",
    placement: "left",
  },
  {
    selector: "[data-tour='view-inventory-action']",
    title: "Contextual navigation cue",
    description:
      "This action only appears on aging SKUs. The agent identifies which products need attention and offers a direct path to deeper investigation.",
    placement: "left",
    navigateTo: "/products/outdoor-fetch-toy",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Three data sources, one conclusion",
    description:
      "ct order data, PetSmart analytics, and PetSmart inventory are combined in a single view. Strong conversion but low online impressions means a deeper discount won't help. The problem is visibility, not price.",
    placement: "left",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Every number is verifiable",
    description:
      "Hover any ✦ to see which agent produced it and why. Click to open a conversation with full context about that specific data point, including its sources and methodology.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='model-promotions-btn']",
    title: "Intent-driven navigation",
    description:
      "This button appeared because the agent inferred that Dana is evaluating promotion-worthiness. Navigation cues reflect accumulated context and would not appear without the preceding inventory review.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Pre-populated scenarios",
    description:
      "The agent pre-populated these scenarios from Dana's navigation path. Each includes projected impact and historical outcomes, so she can compare strategies without leaving this page.",
    placement: "top",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Context-aware conversation",
    description:
      "The chat opens with the agent's best understanding of what Dana is working on. She can redirect it, refine the scope, or ask follow-up questions without starting from scratch.",
    placement: "left",
    action: "openPanel",
  },
];

// ─── Journey 2: Evaluation (Carlos) ─────────────────────────────────────────

const j2Steps: TourStep[] = [
  // Product List
  {
    selector: "[data-tour='inline-slot']",
    title: "Margin impact from external cost data",
    description:
      "ct knows prices but not wholesale costs. The agent correlates PetSmart's supplier cost feed with ct pricing to show which SKUs dropped below the 18% margin floor after the cost increase.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='agent-columns']",
    title: "Before and after margin on every SKU",
    description:
      "Each row shows old and new margin side-by-side. The agent assembled this view the moment Carlos filtered to this brand, replacing what would normally require a spreadsheet.",
    placement: "left",
  },
  {
    selector: "[data-tour='view-response-action']",
    title: "Evaluate response options",
    description:
      "This action appears only on below-floor SKUs. Click to see multiple response levers for this specific product, including absorb, pass-through, substitute, and promotional offset.",
    placement: "left",
    navigateTo: "/products/hills-science-diet-30lb",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Multiple response levers",
    description:
      "Rather than defaulting to a price increase, the agent lays out five options. Each includes competitive pricing context from PetSmart's intelligence feed alongside ct data.",
    placement: "left",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Verify before recommending",
    description:
      "The provenance tells Carlos exactly where the competitive price came from, how fresh the data is, and lets him dig deeper in chat before building a recommendation around it.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-alternatives-btn']",
    title: "Navigation choices signal intent",
    description:
      "Clicking 'View alternatives' versus 'Model promotional offset' tells the agent which lever Carlos is exploring. The next page's data will reflect that choice.",
    placement: "bottom",
    navigateTo: "/products?filter=house-brand",
  },
  // Product List (house-brand)
  {
    selector: "[data-tour='agent-columns']",
    title: "Substitution risk assessment",
    description:
      "Beyond showing alternatives, the agent flags churn risk from PetSmart's customer data. The 74% repurchase rate on Hill's products changes how Carlos frames the recommendation.",
    placement: "left",
  },
  {
    selector: "[data-tour='model-scenarios-btn']",
    title: "Context is complete, ready to model",
    description:
      "This button appears only after Carlos has assessed the damage, evaluated per-SKU options, and reviewed substitutes. The agent surfaces it when the context is sufficient for scenario modeling.",
    placement: "left",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Quantitative backing for stakeholders",
    description:
      "Every scenario includes projected impact and historical outcomes, assembled from Carlos's navigation path. He walks into the meeting with data, not assumptions.",
    placement: "top",
  },
];

// ─── Journey 3: Execution (Dana) ────────────────────────────────────────────

const j3Steps: TourStep[] = [
  // Discount Detail
  {
    selector: "[data-tour='predicate-builder']",
    title: "Intent validation, not just syntax",
    description:
      "The ct predicate builder validates syntax. PetSmart's agent validates intent: it flags that this rule accidentally matches 34 Cat Collar SKUs because it understands PetSmart's category structure.",
    placement: "right",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Understanding the overlap",
    description:
      "The chat explains exactly why the overlap exists and how many products are affected. Dana can make an informed decision about the exclusion rule before launch.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='simulate-campaign-btn']",
    title: "Test all three discounts together",
    description:
      "Individual discounts pass validation, but do they work as a campaign? Simulation catches stacking conflicts and coverage gaps that only surface when discounts are evaluated together.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Stacking conflict caught before production",
    description:
      "The Loyalty discount stacks with the crates discount on 12 SKUs, pushing them below the margin floor. Without simulation, this would erode margin for weeks before anyone noticed.",
    placement: "top",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Evaluating the trade-off",
    description:
      "Making crates non-stackable fixes the margin problem but affects Loyalty members. The agent quantifies both sides so Dana can choose the right fix for the situation.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='check-coverage-btn']",
    title: "From simulation to verification",
    description:
      "Click to see every product matched by the campaign along with its badge status. This coverage check happens before launch instead of after.",
    placement: "left",
    navigateTo: "/products?filter=back-to-school",
  },
  // Product List
  {
    selector: "[data-tour='agent-columns']",
    title: "Coverage and badge status",
    description:
      "Campaign-specific columns show which discount matches each product, the effective discount percentage, and whether the promo badge is set. Red badges indicate customers will not see the offer.",
    placement: "left",
  },
  {
    selector: "[data-tour='set-badge-action']",
    title: "Discount without visibility",
    description:
      "A discount exists in ct, but without a badge on the product listing, customers do not know about it. The agent identifies every gap and suggests copy.",
    placement: "left",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "23 of 89 products missing badges",
    description:
      "The discount is active and correctly configured, but 23 products do not display it because their badge attribute is empty. The agent surfaces the gap, suggests copy, and shows the scope.",
    placement: "left",
  },
];

// ─── Journey 4: Correction (Priya) ──────────────────────────────────────────

const j4Steps: TourStep[] = [
  // Discount List
  {
    selector: "[data-tour='inline-slot']",
    title: "Campaign performance at a glance",
    description:
      "Redemption data comes from ct orders. Knowing that leashes is at 3% vs. a 15% target identifies the problem, but not the cause. The diagnosis below uses PetSmart's impression and competitive data to explain why.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='diagnosis-card']",
    title: "Two causes, two data sources",
    description:
      "Low impressions (PetSmart analytics) and a competitive undercut (PetSmart competitive feed) are separate problems with different fixes. Neither is visible from ct data alone.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "When was the competitor detected?",
    description:
      "The provenance shows exactly when PetCo's promotion was first detected, whether it is still active, and what the SKU overlap is. This helps assess whether competitive pressure is temporary or structural.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='diagnose-action']",
    title: "Drill into the underperformer",
    description:
      "This action only appears on the underperforming discount. Collars and crates are on target and do not need diagnosis. Click to see discount-level diagnostic data.",
    placement: "left",
    navigateTo: "/discounts/back-to-school-leashes",
  },
  // Discount Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "The gap is leashes-specific",
    description:
      "Collars and crates have >90% badge coverage. Leashes has 39%. The badge gap explains why conversion on viewed products is normal but overall redemption is low: most customers never see the offer.",
    placement: "left",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Timing matters for the pivot",
    description:
      "Priya asks when the drop started. The agent shows leashes was already underperforming at 8% before PetCo's launch, then cratered to 1% after. Two problems with different timing means the fix may need both badges and a price adjustment.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-badge-gap-btn']",
    title: "See the impact on a real product",
    description:
      "Click to see what the badge gap looks like on a specific product, with impression data showing the measurable cost of missing visibility.",
    placement: "right",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Measurable lost visibility",
    description:
      "412 impressions versus 1,100 for badged products. The missing badge is not just a data quality issue; it is a quantifiable conversion gap the agent can measure using both ct order data and PetSmart impression data.",
    placement: "left",
  },
  {
    selector: "[data-tour='model-pivot-btn']",
    title: "From diagnosis to action",
    description:
      "Priya now has the full diagnostic picture across three views. The pivot scenarios reflect everything she has seen, including the option that the cheapest fix (badges) might recover most of the lost performance.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "The cheapest fix recovers most of the gap",
    description:
      "Fixing badges alone projects ~9% redemption, up from 3%. Deepening to 20% adds incremental lift to ~16% but costs margin. The agent provides the numbers for a proportionate decision.",
    placement: "top",
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
      "Dana identifies $340K in aging outdoor dog toys and diagnoses a channel-specific problem: online sales are down 12% while in-store is flat. The agent surfaces inventory days-on-hand, channel performance, and margin headroom directly in the product list. then pre-populates clearance scenarios with projected margin impact and historical performance. Three views, no spreadsheets, no separate BI tool. The key: every data point the agent surfaces comes from correlating PetSmart's external data (inventory, analytics) with ct product data.",
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
      "Costs went up. what levers do we have and what should I recommend?",
    description:
      "Carlos assesses the blast radius of an 8% wholesale cost increase across 120+ SKUs: 68 now below the margin floor, $2.1M at risk. The agent shows per-SKU margin impact alongside competitive pricing and house-brand alternatives. data that requires correlating ct pricing with PetSmart's supplier cost feed and competitive intelligence. Carlos evaluates multiple levers (absorb, pass-through, substitute, promotional offset), reviews substitution risks, and walks into a stakeholder meeting with quantitative backing for a multi-lever recommendation, assembled entirely within the MC.",
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
      "I know what to build. help me build it right and prove it works before launch",
    description:
      'Dana builds a 3-discount "Back to School Pet Prep" campaign. The agent catches a predicate that accidentally matches 34 Cat Collar SKUs, identifies a stacking conflict with the Loyalty discount that would push 12 products below the margin floor, simulates all three discounts against sample carts, and flags 23 products missing promotional badges. Each of these is a concrete error with direct revenue impact. wrong predicates erode margin, stacking violations compound, missing badges hide the promotion from customers.',
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
      "This promotion is underperforming. why, and how do I pivot now?",
    description:
      "Priya discovers that the leashes discount in an otherwise successful campaign has 3% redemption vs. a 15% target. The agent diagnoses two root causes: 61% of leash products are missing promotional badges (a merchandising execution gap), and a competitor launched 20% off leashes 5 days ago. A daily timeline shows exactly when the drop started. The pivot scenarios show that fixing badges alone lifts redemption from 3% to ~9%. a conclusion that requires correlating ct redemption data with PetSmart's impression analytics and competitive intelligence feed.",
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
