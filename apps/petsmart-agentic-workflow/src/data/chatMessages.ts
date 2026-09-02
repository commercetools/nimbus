export const chatConfigs: Record<
  string,
  {
    agentName: string;
    messages: Array<{ role: string; content: string }>;
    placeholder: string;
  }
> = {
  // Orchestrated mode: panel is the primary interface
  "/orchestrated/step-1": {
    agentName: "PetSmart Orchestrator",
    messages: [
      {
        role: "assistant",
        content:
          "I've checked your Pet Health inventory. 23 products are below the velocity threshold, representing $47,200 in shelf value. The average time on shelf is 79 days.\n\nBased on 2024 and 2025 data, spring wellness promotions lifted this category by 28%. The optimal window is March 1 through April 15.\n\nI'd recommend a Buy 2 Get 1 Free offer on pet health products, bundled with high-velocity accessories like KONG toys and Milk-Bone treats.\n\n[Sources: Inventory Agent (warehouse velocity data), Strategy Agent (catalog analysis)]",
      },
    ],
    placeholder: "Ask about inventory, seasonal trends, or promotion strategy...",
  },
  "/orchestrated/step-2": {
    agentName: "PetSmart Orchestrator",
    messages: [
      {
        role: "assistant",
        content:
          "I've drafted the Spring Pet Wellness 2026 discount based on the strategy from step 1.\n\n**Configuration:** Buy 2 Get 1 Free targeting Pet Health products with shelf days over 60.\n\n**Impact:** ~340 products affected, estimated margin impact of -4.1%.\n\n**Stock check:** 312 of 340 products have sufficient inventory. 28 are low-stock with reorder lead times that exceed the promo window. I'd recommend excluding those.\n\n**Conflict detected:** 67 products overlap with your Loyalty Paw Points 10% discount. Stacking would push 12 products below the 15% margin floor. I've set stacking mode to non-stackable.\n\n[Sources: Promo Agent (discount config, conflict detection), Inventory Agent (stock validation)]",
      },
    ],
    placeholder: "Ask about conditions, conflicts, or stock details...",
  },
  "/orchestrated/step-3": {
    agentName: "PetSmart Orchestrator",
    messages: [
      {
        role: "assistant",
        content:
          "I ran 3 cart simulations against your draft discount.\n\n**Cart A (happy path):** 2x Flea Treatment + 1x Dental Chews. Buy 2 Get 1 Free applied. Savings: $24.99. Margin: 22%. ✓\n\n**Cart B (below minimum):** 1x Flea Treatment + 1x Vitamins. No discount (minimum not met). Margin: 31%. ✓\n\n**Cart C (stacking conflict):** 3x Dental Chews with Loyalty stacking. Margin drops to 11%, below the 15% floor. ⚠️\n\nCart C confirms the stacking issue. Since we set non-stackable mode in the previous step, this won't happen in production.\n\nI also checked PetSmart's return policy: if a bundled item is returned in-store, the discount still applies to the remaining items. 78% of targeted products are available for in-store pickup.\n\n[Sources: Preview Agent (cart simulation), Inventory Agent (return policy, pickup eligibility)]",
      },
    ],
    placeholder: "Ask about specific cart scenarios or edge cases...",
  },
  "/orchestrated/step-4": {
    agentName: "PetSmart Orchestrator",
    messages: [
      {
        role: "assistant",
        content:
          "Here's your promotion brief for approval.\n\n**Spring Pet Wellness 2026**\nBuy 2 Get 1 Free · 340 products · March 1 through April 15\n\n**Strategy:** Targeting 23 slow movers in Pet Health. Historical uplift: +28%.\n**Discount:** Non-stackable, margin impact -4.1%. Loyalty Paw Points conflict resolved.\n**Simulation:** 3 carts tested. One stacking edge case confirmed safe with non-stackable mode.\n**Inventory:** 312 products in stock. 28 excluded (low stock, reorder lead time exceeds window).\n\nThis promotion will go live immediately upon approval.\n\n[Sources: Strategy Agent, Promo Agent, Preview Agent, Inventory Agent]",
      },
    ],
    placeholder: "Ask for more detail on any section before approving...",
  },
  "/orchestrated/step-5": {
    agentName: "PetSmart Orchestrator",
    messages: [
      {
        role: "assistant",
        content:
          "Spring Pet Wellness ran March 1 through April 15. Here are the results.\n\n**commercetools data (current totals):**\n• 4,287 orders used the promo code\n• $312,400 total revenue\n• $72.88 average order value\n• 34% code usage rate among eligible carts\n\n**PetSmart cross-channel data (time-series):**\n• In-store pickup uplift: +12% for promoted products\n• Online-to-store conversion: 8.3% of online browsers visited stores\n• Halo effect: non-promoted pet health products up 7%\n\n**Inventory clearance:**\n• 18 of 23 slow movers cleared below threshold\n• Average days to clear: reduced from 87 to 34\n• Overstock reduced from $47,200 to $8,200\n\nThe same products you flagged in Step 1 are now measured. Want me to suggest what to include in the next promotion?\n\n[Sources: Data Agent (CT order totals), Reporting Agent (cross-channel trends, inventory clearance)]",
      },
    ],
    placeholder: "Ask about specific products, channels, or next steps...",
  },
};
