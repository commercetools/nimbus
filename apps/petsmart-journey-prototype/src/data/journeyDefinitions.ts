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
    title: "Inventory data meets the product list",
    description:
      "This summary card combines PetSmart's inventory system data with ct product data. Neither system alone could tell Dana that $340K in aging stock is a channel-specific problem. that insight requires correlating inventory days-on-hand with sales analytics.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='product-table']",
    title: "External data in existing controls",
    description:
      "Days-on-hand, velocity, and margin come from PetSmart's systems. They appear as extra columns. not in a separate tool. Dana scans the table the same way she always does, but now the aging problem is visible at a glance.",
    placement: "top",
  },
  {
    selector: "[data-tour='view-inventory-action']",
    title: "Contextual navigation cue",
    description:
      "This action only appears on aging SKUs. the agent knows which products need attention and offers a direct path to deeper investigation. Click to see the product detail.",
    placement: "left",
    navigateTo: "/products/outdoor-fetch-toy",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Three data sources, one conclusion",
    description:
      "ct order data, PetSmart analytics, and PetSmart inventory are combined into a single view. The conclusion. strong conversion but low online impressions. changes the promotion strategy entirely. A deeper discount won't help if the problem is visibility, not price.",
    placement: "left",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Every number is verifiable",
    description:
      "Hover any ✦ to see which agent produced it and why. Click to open a chat with full context about that specific data point. the agent explains its sources and offers to go deeper.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='model-promotions-btn']",
    title: "Intent-driven navigation",
    description:
      "This button appeared because the agent inferred Dana is evaluating promotion-worthiness. The agent's navigation cues reflect accumulated context. it wouldn't suggest modeling if Dana hadn't been reviewing aging inventory.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Scenarios from context, not from scratch",
    description:
      "Dana didn't configure these scenarios. the agent pre-populated them from her navigation path. Each includes projected impact and historical outcomes, so she can compare strategies without leaving this page.",
    placement: "top",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "The chat knows what she's been doing",
    description:
      "The chat opens with the agent's best guess at what Dana wants. then she redirects it. She never types a prompt from scratch. The agent adapts because it tracked her path through the MC.",
    placement: "left",
    action: "openPanel",
  },
];

// ─── Journey 2: Evaluation (Carlos) ─────────────────────────────────────────

const j2Steps: TourStep[] = [
  // Product List
  {
    selector: "[data-tour='inline-slot']",
    title: "Margin impact requires cost data ct doesn't have",
    description:
      "The supplier cost feed is PetSmart's data. ct knows prices but not wholesale costs. The agent correlates both to show which SKUs dropped below the margin floor, a calculation impossible with ct data alone.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='product-table']",
    title: "Before/after margin on every SKU",
    description:
      "Each row shows old and new margin side-by-side. Carlos can scan the entire affected product line without building a spreadsheet. the agent assembled the view the moment he filtered to this brand.",
    placement: "top",
  },
  {
    selector: "[data-tour='view-response-action']",
    title: "From understanding damage to evaluating options",
    description:
      "The action appears only on below-floor SKUs. Click to see multiple response levers for this specific product. not just 'raise the price.'",
    placement: "left",
    navigateTo: "/products/hills-science-diet-30lb",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Five levers, not just one",
    description:
      "The agent doesn't default to the obvious answer. It lays out absorb, pass-through, substitute, and promotional offset. each with competitive pricing context that requires PetSmart's external data.",
    placement: "left",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Verify before you recommend",
    description:
      "Carlos needs to trust the competitive price before building a recommendation around it. The provenance tells him exactly where the data came from, how fresh it is, and lets him dig deeper in chat.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-alternatives-btn']",
    title: "The agent tracks which lever Carlos explores",
    description:
      "Clicking 'View alternatives' vs 'Model promotional offset' tells the agent which direction Carlos is leaning. The next page's data will reflect that choice.",
    placement: "bottom",
    navigateTo: "/products?filter=house-brand",
  },
  // Product List (house-brand)
  {
    selector: "[data-tour='product-table']",
    title: "Substitution isn't simple",
    description:
      "The agent doesn't just show alternatives. it flags the churn risk from PetSmart's customer data. This nuance changes how Carlos frames the recommendation to stakeholders.",
    placement: "top",
  },
  {
    selector: "[data-tour='model-scenarios-btn']",
    title: "Ready to model because the context is complete",
    description:
      "This button appears now. not on the first visit. The agent waited until Carlos had assessed damage, evaluated per-SKU options, and reviewed substitutes before suggesting he model scenarios.",
    placement: "left",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "Quantitative backing for a stakeholder meeting",
    description:
      "Every scenario includes projected impact and historical outcomes. Carlos walks into the meeting with numbers, not opinions. assembled entirely from his navigation path through the MC.",
    placement: "top",
  },
];

// ─── Journey 3: Execution (Dana) ────────────────────────────────────────────

const j3Steps: TourStep[] = [
  // Discount Detail
  {
    selector: "[data-tour='predicate-builder']",
    title: "The agent catches what the syntax checker can't",
    description:
      "ct's predicate builder validates syntax. PetSmart's agent validates intent. it knows this rule accidentally matches Cat Collars because it understands PetSmart's category structure, not just the predicate grammar.",
    placement: "right",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "Understanding the overlap",
    description:
      "The chat explains exactly why the overlap exists and how many products are affected. Dana can make an informed decision about the exclusion rule rather than discovering the problem post-launch.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='simulate-campaign-btn']",
    title: "Test all three discounts together",
    description:
      "Individual discounts pass validation. But do they work as a campaign? Simulation catches stacking conflicts and coverage gaps that only appear when discounts are evaluated as a portfolio.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "A stacking conflict caught before production",
    description:
      "The Loyalty discount stacks with the crates discount on 12 SKUs, pushing them below the margin floor. This would have eroded margin for weeks before anyone noticed. The simulation caught it in seconds.",
    placement: "top",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Evaluating the trade-off",
    description:
      "Making crates non-stackable fixes the margin problem but affects Loyalty members. The agent quantifies both sides so Dana can choose the right fix, not just the obvious one.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='check-coverage-btn']",
    title: "From simulation to verification",
    description:
      "Click to see every product matched by the campaign, with badge status. The coverage check that happens manually after launch now happens before it.",
    placement: "left",
    navigateTo: "/products?filter=back-to-school",
  },
  // Product List
  {
    selector: "[data-tour='product-table']",
    title: "Coverage and badge status at a glance",
    description:
      "The table now shows campaign-specific columns: which discount matches each product, the effective discount, and whether the promo badge is set. Red badges mean customers won't see the offer.",
    placement: "top",
  },
  {
    selector: "[data-tour='set-badge-action']",
    title: "The gap between discount and visibility",
    description:
      "A discount exists in ct. But without a badge on the product listing, customers don't know about it. The agent identifies every gap and suggests copy. Click to see the fix.",
    placement: "left",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "23 of 89 products are invisible to customers",
    description:
      "The discount is active and correctly configured. But 23 products don't show it because their badge attribute is empty. The agent surfaces the gap and suggests copy. Dana still approves, but she's fixing a list, not hunting for problems.",
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
      "Redemption data comes from ct orders. But knowing that leashes is at 3% vs. a 15% target only tells Priya there's a problem. not why. The diagnosis below needs PetSmart's impression and competitive data to explain the cause.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='diagnosis-card']",
    title: "Two causes, two data sources",
    description:
      "Low impressions (PetSmart analytics) and competitive undercut (PetSmart competitive feed) are separate problems with different fixes. Neither is visible from ct data alone. The agent assembled this diagnosis from multiple external sources.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='provenance-demo']",
    title: "When was the competitor detected?",
    description:
      "The provenance tells Priya exactly when PetCo's promotion was first detected, whether it's still active, and what the SKU overlap is. This lets her assess whether competitive pressure is temporary or structural.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='diagnose-action']",
    title: "From campaign view to individual discount",
    description:
      "This action only appears on the underperforming discount. collars and crates don't need diagnosis. Click to see the discount-level diagnostic data.",
    placement: "left",
    navigateTo: "/discounts/back-to-school-leashes",
  },
  // Discount Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "The gap is leashes-specific",
    description:
      "Collars and crates have >90% badge coverage. Leashes has 39%. The badge gap explains why the conversion rate for viewed products is normal but overall redemption is low. most customers never see the offer.",
    placement: "left",
  },
  {
    selector: "[data-tour='chat-panel']",
    title: "Timing matters for the pivot decision",
    description:
      "Priya asks when the drop started. The agent shows that leashes was already underperforming (8%) before PetCo's launch, then cratered to 1% after. Two problems, different timing. which means the fix needs both badges and potentially a price adjustment.",
    placement: "left",
    action: "openPanel",
  },
  {
    selector: "[data-tour='view-badge-gap-btn']",
    title: "See the impact on a real product",
    description:
      "Click to see what the badge gap looks like on a specific product. with impression data showing the measurable cost of missing visibility.",
    placement: "right",
    navigateTo: "/products/nylon-leash-medium",
  },
  // Product Detail
  {
    selector: "[data-tour='inline-slot']",
    title: "Measurable lost visibility",
    description:
      "412 impressions vs. 1,100 for badged products. The missing badge isn't just a data quality issue. it's a quantifiable conversion gap that the agent can measure because it has both ct order data and PetSmart impression data.",
    placement: "left",
  },
  {
    selector: "[data-tour='model-pivot-btn']",
    title: "From diagnosis to action",
    description:
      "Priya now has the full diagnostic picture across three views. The pivot scenarios will reflect everything she's seen. including the option that the cheapest fix (badges) might recover most of the lost performance.",
    placement: "bottom",
    navigateTo: "/playground",
  },
  // Configuration Playground
  {
    selector: "[data-tour='scenario-cards']",
    title: "The cheapest fix gets most of the way there",
    description:
      "Fixing badges alone projects ~9% redemption (from 3%). Deepening to 20% adds incremental lift to ~16% but costs margin. The agent gives Priya the numbers to make a proportionate decision rather than an overreaction.",
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
