export interface ChatMessage {
  sender: "agent" | "user";
  content: string;
  agentLabel?: string;
  items?: Array<{ label: string; detail: string }>;
  footnote?: string;
}

export interface ChatConfig {
  agentName: string;
  messages: ChatMessage[];
  placeholder: string;
}

/**
 * Pre-seeded chat conversations keyed by journey ID + view path.
 * The chat panel never opens blank; it always has context.
 * Agent messages use `items` for structured data and `footnote` for next steps.
 */
export const chatConfigs: Record<string, ChatConfig> = {
  // Journey 1 — Product Detail
  "j1:/products/outdoor-fetch-toy": {
    agentName: "PetSmart Commerce Intelligence",
    placeholder: "Ask about this product's inventory or sales data...",
    messages: [
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content:
          "Conversion rate for this SKU, calculated from PetSmart analytics over the last 30 days:",
        items: [
          {
            label: "Conversion rate",
            detail: "3.8% (412 purchases / 10,842 page views)",
          },
          {
            label: "Category average",
            detail: "2.1% across all 47 SKUs in Dog Toys > Outdoor",
          },
          { label: "Channel split", detail: "Online: 2.9% · In-store: 5.1%" },
        ],
        footnote:
          "Want me to break this down further by channel, time period, or compare to similar products?",
      },
    ],
  },
  // Journey 1 — Playground
  "j1:/playground": {
    agentName: "PetSmart Commerce Intelligence",
    placeholder: "Ask about these scenarios...",
    messages: [
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content:
          "Based on your review of aging inventory in Dog Toys > Outdoor, I've pre-populated clearance scenarios for the 47 SKUs aging past 60 days.",
        footnote:
          "Want me to adjust the product scope, discount depth, or channel targeting?",
      },
      {
        sender: "user",
        content:
          "What if I only target the online channel? In-store sales are fine.",
      },
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content: "Online-only flash sale targeting 47 aging SKUs:",
        items: [
          {
            label: "Projected clearance",
            detail: "65% of online aging stock in 2 weeks",
          },
          {
            label: "In-store impact",
            detail: "None. Products continue selling at current velocity",
          },
          {
            label: "Margin impact",
            detail: "-2.8% online only (vs. -4.1% all channels)",
          },
        ],
        footnote:
          "The narrower scope preserves in-store margins while addressing the channel where the problem is.",
      },
    ],
  },
  // Journey 2 — Product Detail
  "j2:/products/hills-science-diet-30lb": {
    agentName: "PetSmart Commerce Intelligence",
    placeholder: "Ask about pricing, margins, or competitive data...",
    messages: [
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content:
          "Competitive price data for this SKU from PetSmart's intelligence feed:",
        items: [
          {
            label: "PetCo price",
            detail: "$52.99 (stable for 3 weeks, last updated 2 days ago)",
          },
          {
            label: "Source",
            detail: "Automated price monitoring of petco.com",
          },
          { label: "Your current price", detail: "$54.99" },
        ],
        footnote:
          "Want me to show price history, compare across other competitors, or model different pass-through levels?",
      },
      {
        sender: "user",
        content:
          "What's the price elasticity here? Would a 5% pass-through lose us volume?",
      },
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content: "Based on 18 months of price-change data for this SKU:",
        items: [
          {
            label: "5% pass-through",
            detail:
              "Volume drops ~2% over 6 weeks, then recovers. Margin: 19.4% (above floor)",
          },
          {
            label: "8% full pass-through",
            detail:
              "Volume drops ~4%, only partial recovery. Price gap vs PetCo: $6.40",
          },
          {
            label: "Recommendation",
            detail:
              "5% pass-through recovers margin above floor with minimal volume impact",
          },
        ],
      },
    ],
  },
  // Journey 3 — Discount Detail
  "j3:/discounts/back-to-school-collars": {
    agentName: "Promotions Agent",
    placeholder: "Ask about this discount configuration...",
    messages: [
      {
        sender: "agent",
        agentLabel: "Promotions Agent",
        content: "Targeting rule overlap detected:",
        items: [
          {
            label: "Intended match",
            detail: "Dog Supplies > Collars & Leashes (55 SKUs)",
          },
          {
            label: "Unintended match",
            detail: "Pet Supplies > Cat > Cat Collars (34 SKUs)",
          },
          {
            label: "Cause",
            detail: "Shared keyword 'Collars' in the category path",
          },
        ],
        footnote:
          "Want me to suggest an exclusion rule, or show the full list of unintended matches?",
      },
    ],
  },
  // Journey 3 — Playground
  "j3:/playground": {
    agentName: "Promotions Agent",
    placeholder: "Ask about the campaign simulation...",
    messages: [
      {
        sender: "agent",
        agentLabel: "Promotions Agent",
        content: "Stacking conflict found in the campaign simulation:",
        items: [
          {
            label: "Conflict",
            detail: "'Loyalty 10%' combines with crates (20%) on 12 SKUs",
          },
          { label: "Impact", detail: "12 SKUs pushed below margin floor" },
          {
            label: "Affected customers",
            detail: "~340 Loyalty members (past 30 days)",
          },
        ],
        footnote:
          "Options: make crates non-stackable, add exclusion for 12 high-cost SKUs, or adjust discount depth.",
      },
      {
        sender: "user",
        content: "What happens if I make the crates discount non-stackable?",
      },
      {
        sender: "agent",
        agentLabel: "Promotions Agent",
        content:
          "Making crates non-stackable resolves the margin floor violation for all 12 SKUs. Trade-offs:",
        items: [
          { label: "Margin", detail: "All 12 SKUs restored above floor ✓" },
          {
            label: "Loyalty impact",
            detail: "~340 members lose 10% on crate purchases during campaign",
          },
          {
            label: "Alternative",
            detail:
              "Exclude only the 12 high-cost SKUs. Keeps stacking for the other 77 crate products",
          },
        ],
        footnote:
          "The exclusion approach is narrower and preserves the Loyalty benefit on most crate products.",
      },
    ],
  },
  // Journey 4 — Discount List
  "j4:/discounts": {
    agentName: "PetSmart Commerce Intelligence",
    placeholder: "Ask about campaign performance...",
    messages: [
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content:
          "Competitor promotion details from PetSmart's intelligence feed:",
        items: [
          {
            label: "Promotion",
            detail: "PetCo 'Leash & Harness Sale' (20% off)",
          },
          {
            label: "First detected",
            detail: "August 26 via automated monitoring",
          },
          { label: "Status", detail: "Confirmed still active as of today" },
          {
            label: "SKU overlap",
            detail:
              "78% of your leash products have a matching SKU on PetCo's promotion",
          },
        ],
        footnote:
          "Want me to show the product-by-product price comparison, or estimate how much of the drop is competitive pressure vs. the badge gap?",
      },
    ],
  },
  // Journey 4 — Discount Detail
  "j4:/discounts/back-to-school-leashes": {
    agentName: "PetSmart Commerce Intelligence",
    placeholder: "Ask about this discount's performance...",
    messages: [
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content: "The leashes discount has two identified problems:",
        items: [
          {
            label: "Badge gap",
            detail: "61% of targeted products missing promotional badge",
          },
          {
            label: "Competitive undercut",
            detail: "PetCo launched 20% off leashes 5 days ago",
          },
        ],
        footnote:
          "I can help with the timeline, model a discount adjustment, or plan a badge fix. Where would you like to start?",
      },
      {
        sender: "user",
        content:
          "When did leashes start dropping? Was it before or after PetCo's launch?",
      },
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content: "Daily redemption timeline for the leashes discount:",
        items: [
          {
            label: "Days 1-5",
            detail: "8% redemption (below target but reasonable)",
          },
          { label: "Day 6 (PetCo launch)", detail: "Dropped to 1% redemption" },
          { label: "Days 7-10", detail: "Holding at 1-2% redemption" },
        ],
        footnote:
          "The badge gap suppressed performance from day one. The competitive undercut pushed it from underperforming to failing. The fix likely needs both badges and a price adjustment.",
      },
    ],
  },
};
