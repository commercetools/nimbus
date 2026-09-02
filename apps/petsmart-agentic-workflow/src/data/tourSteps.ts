import type { TourStep } from "../components/Tour";

export type FlavorMode = "contextual" | "orchestrated";

// Step 1: Discover
export const discoverContextualSteps: TourStep[] = [
  { selector: "[data-tour='product-table']", title: "Maya sees the slow movers", description: "The product table shows Pet Health products. The Shelf Days and Velocity columns come from PetSmart's Inventory Agent (notice the colored ✦). Products over 80 days are highlighted in amber.", renderTarget: "augmentation", placement: "bottom", action: "pulseShelfDaysCells" },
  { selector: "[data-tour='inventory-card']", title: "PetSmart's warehouse data", description: "The Inventory Agent surfaces 23 slow-moving products worth $47,200 in shelf value. This data comes from PetSmart's warehouse system, not commercetools.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='strategy-card']", title: "CT adds strategy context", description: "The Strategy Agent analyzes the current catalog and notes that spring promotions historically lift this category 28%. The historical data comes from PetSmart's records.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='create-promotion']", title: "Maya decides to act", description: "With both agents' input visible on the same page, Maya clicks Create Promotion. She never opened a separate tool or typed a prompt.", renderTarget: "augmentation", placement: "left", action: "pulseElement" },
];

export const discoverOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='product-table']", title: "Same data, different delivery", description: "The product table looks the same. The Orchestrator called the Inventory Agent behind the scenes and injected the shelf data.", renderTarget: "augmentation", placement: "bottom", action: "pulseShelfDaysCells" },
  { selector: "[data-tour='orchestrator-card']", title: "One card, two sources", description: "Instead of separate cards, the PetSmart Orchestrator composed a single recommendation from both the Inventory Agent and Strategy Agent.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='agent-chain']", title: "Expand to see the sources", description: "Click 'Powered by 2 agents' to see which downstream agents the Orchestrator consulted and what each contributed.", renderTarget: "inline", placement: "bottom" },
  { selector: "[data-tour='next-step-btn']", title: "Maya moves forward", description: "There's no separate 'Create Promotion' action to click — the Orchestrator's recommendation already is the promotion draft. Maya advances to Build.", placement: "top", action: "pulseElement" },
];

// Step 2: Build
export const buildContextualSteps: TourStep[] = [
  { selector: "[data-tour='discount-type']", title: "PetSmart knows what works", description: "The suggested discount type 'Buy 2 Get 1 Free' comes from PetSmart's Inventory Agent with historical performance data: this structure lifts pet health 31% vs flat percentage.", renderTarget: "augmentation", placement: "bottom" },
  { selector: "[data-tour='suggested-conditions']", title: "A suggested condition, one click away", description: "The Promo Agent suggests a product predicate based on the catalog and current rules. Maya clicks the chip to add it — no need to write the predicate herself.", renderTarget: "augmentation", placement: "top", action: "clickSuggestedCondition" },
  { selector: "[data-tour='impact-card']", title: "CT calculates the impact", description: "The Promo Agent shows 340 products affected with a -4.1% margin impact, calculated from current commercetools pricing data.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='stock-card']", title: "PetSmart checks the warehouse", description: "The Inventory Agent flags 28 low-stock products where the reorder lead time exceeds the promotion window. This data is from the warehouse, not commercetools.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='conflict-card']", title: "CT catches a conflict", description: "The Promo Agent detects 67 products that overlap with the Loyalty Paw Points discount. Stacking would push 12 products below the margin floor.", renderTarget: "inline", placement: "top", action: "pulseElement" },
  { selector: "[data-tour='save-simulate']", title: "Maya saves and moves to simulation", description: "With the discount configured and the conflict noted, Maya clicks Save & Simulate to see how it plays out against real carts.", renderTarget: "augmentation", placement: "bottom", action: "pulseElement" },
];

export const buildOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='discount-type']", title: "The Orchestrator drafts the discount", description: "The Orchestrator chose 'Buy 2 Get 1 Free' after consulting both the Promo Agent (discount model) and Inventory Agent (historical performance).", renderTarget: "augmentation", placement: "bottom" },
  { selector: "[data-tour='orchestrator-card']", title: "Impact, stock, and conflicts in one view", description: "The Orchestrator composed impact analysis, stock validation, and conflict detection into a single card. Three agents' worth of work, one reading experience.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='agent-chain']", title: "See who contributed what", description: "The agent chain shows the Promo Agent handled discount configuration and conflict detection, while the Inventory Agent provided stock validation.", renderTarget: "inline", placement: "bottom" },
  { selector: "[data-tour='next-step-btn']", title: "On to simulation", description: "The draft is composed and reviewed. Maya advances to cart simulation.", placement: "top", action: "pulseElement" },
];

// Step 3: Test
export const testContextualSteps: TourStep[] = [
  { selector: "[data-tour='simulation-card']", title: "Carts the merchant never had to build", description: "The Preview Agent simulated three carts automatically. No test orders, no manual checking. This capability didn't exist before.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='cart-warning']", title: "A stacking problem caught before launch", description: "Cart C triggers a stacking violation: Buy 2 Get 1 Free plus Loyalty Paw Points drops the margin to 11%, below the 15% floor. This would have reached production.", renderTarget: "inline", placement: "top", action: "pulseWarningCart" },
  { selector: "[data-tour='petsmart-context']", title: "PetSmart adds return and pickup rules", description: "The Inventory Agent adds context the Preview Agent doesn't have: return policy implications and in-store pickup eligibility for the promoted products.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='submit-approval']", title: "Maya submits for approval", description: "Simulation looks good and the one stacking issue is understood. Maya submits the promotion for approval.", renderTarget: "augmentation", placement: "bottom", action: "pulseElement" },
];

export const testOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='orchestrator-card']", title: "Simulation with business rules", description: "The Orchestrator ran cart simulations through the Preview Agent, then enriched the results with PetSmart's return and pickup policies from the Inventory Agent.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='cart-warning']", title: "The stacking issue", description: "Cart C's stacking violation is the same regardless of flavor. The Orchestrator surfaces it with the same urgency.", renderTarget: "inline", placement: "top", action: "pulseWarningCart" },
  { selector: "[data-tour='agent-chain']", title: "Two agents, one report", description: "The Preview Agent handled cart math. The Inventory Agent added return policy and pickup context.", renderTarget: "inline", placement: "bottom" },
  { selector: "[data-tour='next-step-btn']", title: "On to approval", description: "The simulation report is complete. Maya advances to the approval gate.", placement: "top", action: "pulseElement" },
];

// Step 4: Approve
export const approveContextualSteps: TourStep[] = [
  { selector: "[data-tour='pipeline']", title: "The full picture", description: "The pipeline shows all 8 agents. Steps 1-5 are complete (checkmarks). Maya is at step 6: the human approval gate.", renderTarget: "inline", placement: "bottom" },
  { selector: "[data-tour='summary-cards']", title: "Each agent's contribution, traceable", description: "Four compact cards summarize what each agent produced. Every piece of data is labeled with its source: CT brand green for platform agents, blue for PetSmart agents.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='approve-btn']", title: "The human decides", description: "No agent can launch this promotion. The Approve button has no AI augmentation. Maya reviews, then decides.", renderTarget: "augmentation", placement: "bottom", action: "pulseElement" },
];

export const approveOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='pipeline']", title: "Same gate, different view", description: "The pipeline is identical. The human approval gate is the same regardless of how the information was assembled.", renderTarget: "inline", placement: "bottom" },
  { selector: "[data-tour='orchestrator-card']", title: "One brief, fully expanded", description: "The Orchestrator composed an executive summary. The agent chain is expanded by default so Maya can see every source.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='approve-btn']", title: "Still the human's call", description: "Same approval gate. The Orchestrator assembled the brief, but the decision is Maya's.", renderTarget: "augmentation", placement: "bottom", action: "pulseElement" },
];

// Step 5: Measure
export const measureContextualSteps: TourStep[] = [
  { selector: "[data-tour='ct-card']", title: "CT shows the current totals", description: "The Data Agent provides 4,287 orders and $312K revenue. These are point-in-time totals from commercetools. No trend lines, no daily breakdowns: CT provides current state.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='petsmart-card']", title: "PetSmart shows how it played out", description: "The Reporting Agent adds what CT can't: daily order trends, in-store pickup uplift (+12%), and cross-channel attribution. This time-series data comes from PetSmart's BI system.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='clearance-card']", title: "The loop is closed", description: "18 of 23 slow movers cleared. Overstock went from $47K to $8K. The same products Maya spotted in Step 1 are now measured.", renderTarget: "inline", placement: "top" },
];

export const measureOrchestratedSteps: TourStep[] = [
  { selector: "[data-tour='orchestrator-card']", title: "Unified performance report", description: "The Orchestrator composed CT's current totals with PetSmart's time-series data into a single results card.", renderTarget: "inline", placement: "top" },
  { selector: "[data-tour='agent-chain']", title: "CT totals + PetSmart trends", description: "The Data Agent contributed order counts and revenue. The Reporting Agent contributed daily trends, cross-channel data, and inventory clearance.", renderTarget: "inline", placement: "bottom" },
];

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

const LAST_STEP = 5;

type StartTourFn = (steps: TourStep[], onComplete?: () => void) => void;

/**
 * Starts the tour for a given step page, and — unless it's the last step —
 * chains into the next step page's tour once this one finishes. Used so a
 * single "Start" click from the Landing page (or the tour's own advancement
 * pulse) carries Maya continuously through all 5 steps.
 */
export function startStepTour(
  navigate: (path: string) => void,
  startTour: StartTourFn,
  mode: FlavorMode,
  stepNumber: number
): void {
  const steps = stepsByModeAndNumber[mode][stepNumber];
  if (!steps) return;

  const onComplete =
    stepNumber < LAST_STEP
      ? () => {
          navigate(`/${mode}/step-${stepNumber + 1}`);
          setTimeout(() => startStepTour(navigate, startTour, mode, stepNumber + 1), 500);
        }
      : undefined;

  startTour(steps, onComplete);
}
