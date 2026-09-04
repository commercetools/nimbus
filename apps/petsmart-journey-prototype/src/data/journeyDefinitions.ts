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
    title: "Dana sees the inventory problem immediately",
    description:
      "Dana is reviewing outdoor dog toys. PetSmart's agent has correlated inventory data with channel sales and surfaced a summary: $340K in aging stock, concentrated in the online channel. Commercetools has the product catalog, but the agent adds the inventory depth and channel-level performance that makes the problem visible.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='agent-columns']",
    title: "Every row tells the full story",
    description:
      "Dana is scanning products the way she always does, but now each row includes days-on-hand, velocity trend, and margin headroom from PetSmart's systems. She can spot at a glance which SKUs are aging, which are declining, and where she has margin room to work with.",
    placement: "left",
  },
  {
    selector: "[data-tour='view-inventory-action']",
    title: "Dana investigates the worst offender",
    description:
      "Dana notices this SKU has been sitting for 89 days with declining velocity. The agent surfaces an action button only on aging products, pointing her directly to a deeper investigation. She does not have to search for the problem product.",
    placement: "left",
    navigateTo: "/products/outdoor-fetch-toy",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Dana reconsiders her discount strategy",
    description:
      "Dana came in thinking she needed a deeper discount. But the agent shows strong conversion on viewed products alongside low online impressions. The data changes her thinking: the problem is not price, it is visibility. She needs better placement, not a bigger markdown.",
    placement: "left",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Dana verifies the data before acting",
    description:
      "Dana hovers the ✦ to see which agent produced each number and how it was calculated. She can check data freshness, trace the methodology, and open a conversation to challenge any figure. She trusts the insight because she can verify it herself.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='model-promotions-btn']",
    title: "Dana is ready to model her options",
    description:
      "Dana has reviewed the inventory, diagnosed the channel-specific problem, and ruled out a blanket discount. The agent recognizes she is ready to model scenarios and offers a direct path to the playground. All the context she has gathered carries forward.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Dana compares four pre-built strategies",
    description:
      "Dana does not start from scratch. The agent has assembled four clearance scenarios based on her investigation: a 20% markdown, a buy-2-get-1, a bundle with fast-moving treats, and an online-only flash sale. Each includes projected margin impact and historical performance from similar past promotions.",
    placement: "top",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Dana fine-tunes through conversation",
    description:
      "Dana opens a conversation that already knows what she has been evaluating. She can ask follow-up questions, adjust parameters, or explore what-if scenarios without re-explaining the context. The agent works with her, building on everything she has reviewed.",
    placement: "left",
    action: "openPanel",
  },
];

// ─── Journey 2: Evaluation (Carlos) ─────────────────────────────────────────

const j2Steps: TourStep[] = [
  // Product List
  {
    selector: "[data-tour='inline-slot']",
    title: "Carlos sees the blast radius of a cost increase",
    description:
      "Carlos just learned that Hill's Science Diet raised wholesale costs 8%. The agent has already correlated PetSmart's supplier cost feed with commercetools pricing and calculated the impact: 68 of 120+ SKUs now sit below the 18% margin floor, putting $2.1M in annual revenue at risk.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='agent-columns']",
    title: "Carlos compares old and new margins instantly",
    description:
      "Carlos is scanning the product list and can see before-and-after margins on every SKU without opening a spreadsheet. The agent assembled this view the moment he filtered to the affected brand. He can immediately identify which products are most exposed.",
    placement: "left",
  },
  {
    selector: "[data-tour='view-response-action']",
    title: "Carlos drills into the highest-risk product",
    description:
      "Carlos sees that this SKU dropped from 22% to 14% margin, well below floor. The action button appears only on below-floor products, directing him to a detailed view with multiple response levers. He does not have to figure out which products to investigate first.",
    placement: "left",
    navigateTo: "/products/hills-science-diet-30lb",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Carlos discovers five response options, not just one",
    description:
      "Carlos expected to recommend a price increase. Instead, the agent presents five levers: absorb, pass-through, substitute, bundle, and promotional offset. Each includes competitive pricing from PetSmart's intelligence feed. Carlos now has a richer set of options for his stakeholder meeting.",
    placement: "left",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Carlos checks the competitive pricing data",
    description:
      "Carlos hovers the ✦ to verify where the competitor price came from. He can see the data source, when it was last updated, and the confidence level. He needs this to be solid before building a recommendation around competitive positioning.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-alternatives-btn']",
    title: "Carlos explores the substitution lever",
    description:
      "Carlos clicks 'View alternatives' to assess house-brand substitutes. The agent notes this choice and will tailor the next view accordingly. If he had clicked 'Model promotional offset' instead, the data would reflect that different path.",
    placement: "bottom",
    navigateTo: "/products?filter=house-brand",
  },
  // Product List (house-brand)
  {
    selector: "[data-tour='agent-columns']",
    title: "Carlos sees the churn risk in substitution",
    description:
      "Carlos is reviewing house-brand alternatives, but the agent adds a critical data point from PetSmart's customer analytics: Hill's customers have a 74% repurchase rate. Pushing substitution too hard risks losing loyal customers. This changes how Carlos frames the recommendation.",
    placement: "left",
  },
  {
    selector: "[data-tour='model-scenarios-btn']",
    title: "Carlos has the full picture for his meeting",
    description:
      "Carlos has assessed the margin damage, reviewed per-SKU response options, checked competitive pricing, and evaluated substitution risks. The agent recognizes he has enough context and offers a path to model scenarios with projected outcomes.",
    placement: "left",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Carlos walks into the meeting with data",
    description:
      "Carlos sees three modeled scenarios: a bundle strategy preserving 19% margin, a volume discount with projected lift, and a partial pass-through with house-brand shelf space. Each includes projected impact from his investigation. He presents options with numbers, not assumptions.",
    placement: "top",
  },
];

// ─── Journey 3: Execution (Dana) ────────────────────────────────────────────

const j3Steps: TourStep[] = [
  // Discount Detail
  {
    selector: "[data-tour='predicate-builder']",
    title: "Dana's targeting rule has a hidden problem",
    description:
      "Dana is building the collars discount. Commercetools validates that the predicate syntax is correct. PetSmart's agent goes further: it understands PetSmart's category hierarchy and flags that this rule accidentally matches 34 Cat Collar SKUs. Dana catches an error that would have gone live.",
    placement: "right",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Dana understands the overlap before deciding",
    description:
      "Dana opens a conversation to understand exactly why the overlap exists and which products are affected. She can make an informed decision about adding an exclusion rule rather than guessing at the scope of the problem.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='simulate-campaign-btn']",
    title: "Dana tests all three discounts as a campaign",
    description:
      "Each discount passes validation individually, but Dana needs to know if they work together. She runs a campaign simulation to catch stacking conflicts and coverage gaps that only surface when all three discounts are evaluated against the same catalog.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "The simulation catches a margin-eroding conflict",
    description:
      "Dana discovers that the existing Loyalty 10% discount stacks with the new crates 20% discount on 12 SKUs, pushing them below the margin floor. This conflict would have quietly eroded margin for weeks if the campaign launched without simulation.",
    placement: "top",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Dana weighs the trade-off with full context",
    description:
      "Making crates non-stackable fixes the margin problem but affects Loyalty members. Dana asks the agent to quantify both sides: how much margin is saved versus how many loyal customers lose a benefit. She makes her decision with both numbers in hand.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='check-coverage-btn']",
    title: "Dana checks product coverage before launch",
    description:
      "Dana wants to verify that every targeted product will actually show the promotion. She clicks through to see each product's badge status, catching visibility gaps before customers encounter a silent discount.",
    placement: "left",
    navigateTo: "/products?filter=back-to-school",
  },
  // Product List
  {
    selector: "[data-tour='agent-columns']",
    title: "Dana spots 23 products missing promotional badges",
    description:
      "The agent adds campaign-specific columns showing which discount matches each product and whether the promotional badge is set. Red badges mean customers will never see the offer. Dana can see at a glance that 23 products need badge updates before launch.",
    placement: "left",
  },
  {
    selector: "[data-tour='set-badge-action']",
    title: "Dana fixes the gap product by product",
    description:
      "Dana clicks through to a product where the discount is active and correctly configured, but customers cannot see it because the badge attribute is empty. The agent identifies every gap and suggests badge copy, turning a merchandising oversight into a quick fix.",
    placement: "left",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Dana sees the full scope of missing visibility",
    description:
      "Dana is looking at one product, but the agent shows the bigger picture: 23 of 89 campaign products are missing badges. The discount is live and correctly configured, but nearly a quarter of targeted products are invisible to customers. She now has a clear punch list to complete before launch.",
    placement: "left",
  },
];

// ─── Journey 4: Correction (Priya) ──────────────────────────────────────────

const j4Steps: TourStep[] = [
  // Discount List
  {
    selector: "[data-tour='inline-slot']",
    title: "Priya sees leashes is underperforming badly",
    description:
      "Priya is reviewing the Back to School campaign. Commercetools shows redemption rates from order data: collars and crates are on target, but leashes is at 3% against a 15% goal. The numbers tell her there is a problem, but not why. PetSmart's agent adds the diagnosis below.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='diagnosis-card']",
    title: "Priya discovers two separate root causes",
    description:
      "PetSmart's agent identifies two factors driving the underperformance: page impressions on leash products are 60% below the category average (from PetSmart's web analytics), and competitor PetCo launched 20% off leashes five days ago (from the competitive intelligence feed). These are separate problems with different fixes.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Priya checks when the competitor was detected",
    description:
      "Priya hovers the ✦ to see exactly when PetCo's promotion was first detected, whether it is still active, and what the SKU overlap is. She needs to know if this competitive pressure is temporary or structural before deciding how to respond.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='diagnose-action']",
    title: "Priya focuses on the underperforming discount",
    description:
      "Priya notices the diagnose button only appears on the leashes row. Collars and crates are performing fine and do not need investigation. The agent directs her attention to the one discount that needs a decision.",
    placement: "left",
    navigateTo: "/discounts/back-to-school-leashes",
  },
  // Discount Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Priya finds a badge coverage gap specific to leashes",
    description:
      "PetSmart's agent shows that collars and crates have over 90% badge coverage, but leashes has only 39%. This explains the data: conversion on viewed products is actually normal, but most customers never see the offer because the promotional badge is missing on 61% of leash products.",
    placement: "left",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Priya asks when the underperformance started",
    description:
      "Priya opens a conversation and asks about timing. The agent shows that leashes was already underperforming at 8% before PetCo's launch, then cratered to 1% after. Two problems with different timelines means the fix likely needs both badge updates and a pricing adjustment.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-badge-gap-btn']",
    title: "Priya looks at the impact on a real product",
    description:
      "Priya clicks through to see what the badge gap looks like on an actual product listing. She wants to understand the measurable cost of missing visibility before deciding how aggressively to respond.",
    placement: "right",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Priya quantifies the lost visibility",
    description:
      "PetSmart's agent shows 412 impressions on this unbadged product versus 1,100 on comparable badged products. The missing badge is not just a data quality issue. It is a measurable conversion gap, and fixing it is the cheapest lever available.",
    placement: "left",
  },
  {
    selector: "[data-tour='model-pivot-btn']",
    title: "Priya is ready to decide on a pivot",
    description:
      "Priya has the complete diagnostic picture across three views: the underperformance, the two root causes, the badge coverage gap, and the per-product impact. She moves to the playground to compare pivot scenarios informed by everything she has seen.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Priya sees the cheapest fix recovers most of the gap",
    description:
      "The agent presents three options. Fixing badges alone projects 9% redemption, up from 3%, at zero cost. Deepening the discount to 20% adds incremental lift to 16% but costs margin. Priya can make a proportionate decision: fix badges first, then evaluate whether a price response is still needed.",
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
      "Dana can identify aging inventory, diagnose whether it is a channel-specific or category-wide problem, and model clearance scenarios with projected outcomes. PetSmart's agent brings inventory depth, channel performance, and margin data into the product list so she can go from problem to recommendation in one session.",
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
      "Costs went up. What levers do we have and what should I recommend?",
    description:
      "Carlos can assess the full impact of a supplier cost increase, compare response levers beyond a simple price hike, and build a quantitative recommendation for stakeholders. PetSmart's agent brings supplier costs, competitive pricing, and customer loyalty data into the Merchant Center so he can evaluate trade-offs and model scenarios in one workflow.",
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
      "I know what to build. Help me build it right and prove it works before launch.",
    description:
      "Dana can validate targeting rules against PetSmart's real category structure, simulate multi-discount campaigns for stacking conflicts, and verify promotional badge coverage before launch. PetSmart's agent catches errors that syntax validation alone would miss, so Dana ships campaigns that work correctly on day one.",
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
      "This promotion is underperforming. Why, and how do I pivot now?",
    description:
      "Priya can diagnose why a promotion is underperforming, separate root causes that need different fixes, and compare pivot scenarios ranked by cost and projected impact. PetSmart's agent brings web analytics, competitive intelligence, and badge coverage data into the discount view so she can move from diagnosis to decision in minutes.",
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
