import type { TourStep } from "../components/Tour";

export type FlavorMode = "contextual" | "orchestrated";

// Step 1: Discover
export const discoverContextualSteps: TourStep[] = [
  { selector: "[data-tour='product-table']", title: "Maya spots the problem", description: "She opens the Pet Health product list and immediately sees which items are stalling. Shelf days and velocity are right in the table, highlighted amber when they're overdue. She didn't run a report or open a spreadsheet.", placement: "bottom", action: "pulseShelfDaysCells" },
  { selector: "[data-tour='inventory-card']", title: "The numbers are already there", description: "23 slow movers, $47,200 in shelf value, trending down. Maya didn't ask for this summary. It appeared because she's looking at Pet Health products.", placement: "top" },
  { selector: "[data-tour='strategy-card']", title: "A recommendation, not a blank page", description: "Spring promotions have lifted this category 28% in the past. Bundle slow movers with accessories. Maya reads a recommendation, not a raw data dump.", placement: "top" },
  { selector: "[data-tour='create-promotion']", title: "She acts", description: "Maya clicks Create Promotion. She never left this page, never opened another tool, never typed a prompt. The decision was hers; the context was ready.", placement: "left", action: "pulseElement" },
];

export const discoverOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='chat-panel']", title: "One conversation, full lifecycle", description: "Maya asks for a spring promotion. The Orchestrator finds the slow movers, drafts a Buy 2 Get 1 Free discount, validates stock and conflicts, and simulates 3 carts. All in one thread, from one page.", placement: "left", action: "openPanel" },
  { selector: "[data-tour='product-table']", title: "The MC page is context, not the driver", description: "Maya can see the products the Orchestrator identified, but she didn't have to navigate anywhere. The conversation drove the work. Now she approves the draft and moves to review.", placement: "bottom", navigateTo: "/orchestrated/step-4" },
];

// Step 2: Build
export const buildContextualSteps: TourStep[] = [
  { selector: "[data-tour='discount-type']", title: "The form knows what works", description: "Buy 2 Get 1 Free is already suggested, with a note that it outperforms flat percentages by 31% in this category. Maya sees the recommendation right where she'd normally type.", placement: "bottom" },
  { selector: "[data-tour='suggested-conditions']", title: "One click to add a condition", description: "A product predicate is suggested: shelf-days over 60. Maya clicks the chip to add it. She didn't have to write the predicate syntax.", placement: "top", action: "clickSuggestedCondition" },
  { selector: "[data-tour='impact-card']", title: "She sees the impact immediately", description: "340 products affected, -4.1% margin impact. This updates as she configures. Maya knows the cost before she commits.", placement: "top" },
  { selector: "[data-tour='stock-card']", title: "A stock problem she would have missed", description: "28 products don't have enough inventory to last the promotion window. Maya would have found this after launch. Now she sees it before.", placement: "top" },
  { selector: "[data-tour='conflict-card']", title: "A conflict, caught early", description: "67 products overlap with the Loyalty Paw Points discount. Stacking would break the margin floor. Maya adds an exclusion before it becomes a production issue.", placement: "top", action: "pulseElement" },
  { selector: "[data-tour='save-simulate']", title: "She saves and tests", description: "Maya clicks Save & Simulate. The discount is configured, the conflicts are noted. Now she wants to see it work against real carts.", placement: "bottom", action: "pulseElement" },
];

export const buildOrchestratedSteps: TourStep[] = [];

// Step 3: Test
export const testContextualSteps: TourStep[] = [
  { selector: "[data-tour='simulation-card']", title: "Margin at a glance", description: "The chart shows margin by cart against the 15% floor. Cart C is immediately visible as the problem. Maya used to test discounts by placing real orders. This didn't exist before.", placement: "top" },
  { selector: "[data-tour='cart-warning']", title: "Cart C breaks the floor", description: "Three dental chews with loyalty stacking drops the margin to 11%. This would have reached production and eroded margins for weeks before anyone noticed.", placement: "top", action: "pulseWarningCart" },
  { selector: "[data-tour='petsmart-context']", title: "Return and pickup rules", description: "If a customer returns a bundled item in-store, does the discount still apply? 78% of products are available for pickup. Maya sees the answers here, not in a separate system.", placement: "top" },
  { selector: "[data-tour='submit-approval']", title: "She submits for approval", description: "The simulation passed. The stacking issue is understood and handled. Maya submits for review.", placement: "bottom", action: "pulseElement" },
];

export const testOrchestratedSteps: TourStep[] = [];

// Step 4: Approve
export const approveContextualSteps: TourStep[] = [
  { selector: "[data-tour='promotion-details']", title: "The full picture", description: "Name, key, predicates, stacking mode, conflict resolution: everything Maya configured is laid out in the format she recognizes from the Merchant Center. No surprises.", placement: "bottom" },
  { selector: "[data-tour='review-checklist']", title: "Pre-launch checklist", description: "Five checks, each traced to its source. Inventory coverage, margin safety, conflict resolution, cart simulation, historical benchmark. Maya reads pass/warn/info, not agent names.", placement: "top" },
  { selector: "[data-tour='approve-btn']", title: "Her call", description: "No automation can click this button. Maya reads the brief, confirms the numbers, and launches the promotion. The decision is hers.", placement: "bottom", action: "pulseElement" },
];

export const approveOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='chat-panel']", title: "The executive brief", description: "The Orchestrator compiled everything into one approval brief: strategy, discount config, simulation results, inventory status. Maya reads it and decides.", placement: "left", action: "openPanel" },
  { selector: "[data-tour='approve-btn']", title: "Her call", description: "The Orchestrator assembled the information, but Maya makes the decision. She clicks Approve & Launch.", placement: "bottom", action: "pulseElement", navigateTo: "/orchestrated/step-5" },
];

// Step 5: Measure
export const measureContextualSteps: TourStep[] = [
  { selector: "[data-tour='ct-card']", title: "The numbers are in", description: "4,287 orders, $312K revenue, 34% code usage. Maya sees the platform totals immediately. No waiting for a report request.", placement: "top" },
  { selector: "[data-tour='petsmart-card']", title: "The full story", description: "In-store pickup was up 12%. Online browsers drove store visits. Non-promoted items got a 7% halo. Maya sees what happened beyond the website.", placement: "top" },
  { selector: "[data-tour='clearance-card']", title: "The problem is solved", description: "18 of 23 slow movers cleared. Overstock dropped from $47K to $8K. The products Maya spotted in Step 1 are now measured. The loop is closed.", placement: "top" },
];

export const measureOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='chat-panel']", title: "The full report", description: "4,287 orders, $312K revenue, 18 of 23 slow movers cleared. The Orchestrator compiled platform totals, cross-channel trends, and inventory clearance into one report. Maya asks what to promote next.", placement: "left", action: "openPanel" },
];

// ─── Lookup ─────────────────────────────────────────────────────────────────

const stepsByModeAndNumber: Record<FlavorMode, Record<number, TourStep[]>> = {
  contextual: {
    1: discoverContextualSteps,
    2: buildContextualSteps,
    3: testContextualSteps,
    4: approveContextualSteps,
    5: measureContextualSteps,
  },
  orchestrated: {
    1: discoverOrchestratedSteps,
    2: buildOrchestratedSteps,
    3: testOrchestratedSteps,
    4: approveOrchestratedSteps,
    5: measureOrchestratedSteps,
  },
};

type StartTourFn = (steps: TourStep[]) => void;

/**
 * Gets the tour steps for a given step page and mode.
 */
export function getStepTourSteps(mode: FlavorMode, stepNumber: number): TourStep[] | undefined {
  return stepsByModeAndNumber[mode][stepNumber];
}

/**
 * Starts the tour for a single step page.
 */
export function startStepTour(
  startTour: StartTourFn,
  mode: FlavorMode,
  stepNumber: number
): void {
  const steps = stepsByModeAndNumber[mode][stepNumber];
  if (!steps) return;
  startTour(steps);
}
