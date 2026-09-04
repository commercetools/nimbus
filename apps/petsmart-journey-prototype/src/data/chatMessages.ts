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
 * The chat panel never opens blank — it always has context.
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
          "You're asking about the conversion rate for this SKU. It's calculated from PetSmart analytics: 412 purchases out of 10,842 product page views over the last 30 days, giving a 3.8% rate. The category average of 2.1% is across all 47 SKUs in Dog Toys > Outdoor. Want me to break this down by channel or compare it to similar products?",
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
          "You've been reviewing aging inventory in Dog Toys > Outdoor. I've pre-populated clearance scenarios for the 47 SKUs aging past 60 days. Want me to adjust the product scope, discount depth, or channel targeting?",
      },
      {
        sender: "user",
        content:
          "What if I only target the online channel? In-store sales are fine.",
      },
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content:
          "Online-only flash sale targeting 47 aging SKUs: projected to clear 65% of online aging stock in 2 weeks. In-store inventory is unaffected — those products continue selling at current velocity. Margin impact: -2.8% online channel only, vs. -4.1% if applied to all channels. The narrower scope preserves your in-store margins while addressing the channel where the problem is.",
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
          "PetCo's price of $52.99 comes from PetSmart's competitive intelligence feed, last updated 2 days ago via automated price monitoring of petco.com. This SKU has been at this price for 3 weeks. Want me to show the price history, compare across other competitors, or model the impact of different pass-through levels?",
      },
      {
        sender: "user",
        content:
          "What's the price elasticity here? Would a 5% pass-through lose us volume?",
      },
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content:
          "Based on 18 months of price-change data for this SKU: a 5% increase historically reduced volume by ~2% over 6 weeks, then recovered. An 8% increase (full pass-through) reduced volume by ~4% and only partially recovered. At 5% pass-through, your margin recovers to 19.4% (above the 18% floor) while keeping volume impact minimal. PetCo is currently at $52.99 — a 5% pass-through puts you at $54.49, creating a $1.50 gap.",
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
        content:
          "Your rule targets 'Collars & Leashes,' which matches Dog Supplies > Collars & Leashes (55 SKUs) as intended, but also matches Pet Supplies > Cat > Cat Collars (34 SKUs) because of the shared keyword 'Collars' in the category path. Want me to suggest an exclusion rule, or show you the full list of unintended matches?",
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
        content:
          "I found a stacking conflict: your 'Loyalty 10%' discount combines with the crates discount (20% off) on 12 SKUs, pushing them below your margin floor. I can help you evaluate options: make crates non-stackable, add an exclusion rule for those 12 SKUs, or adjust the discount depth on crates.",
      },
      {
        sender: "user",
        content: "What happens if I make the crates discount non-stackable?",
      },
      {
        sender: "agent",
        agentLabel: "Promotions Agent",
        content:
          "Making crates non-stackable resolves the margin floor violation for all 12 SKUs. However, it also means Loyalty members lose their 10% on crate purchases during the campaign — that's ~340 customers based on past 30 days. An alternative: add an exclusion rule for the 12 high-cost SKUs only. This keeps the discount stackable for the other 77 crate products while protecting margin on the ones that would breach the floor.",
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
          "You're asking about the PetCo competitor promotion. Their 'Leash & Harness Sale' (20% off) was first detected on Aug 26 via PetSmart's competitive intelligence feed, and it's confirmed still active as of today. 78% of your leash products have a matching SKU on PetCo's promotion. Want me to show the product-by-product price comparison, or estimate how much of the leash discount's drop is attributable to the competitive pressure vs. the badge gap?",
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
        content:
          "The leashes discount has two problems: 61% of targeted products are missing their promotional badge, and PetCo launched a competing 20% off leashes promotion 5 days ago. I can help you understand the timeline, model a discount adjustment, or plan a badge fix. Where would you like to start?",
      },
      {
        sender: "user",
        content:
          "When did leashes start dropping? Was it before or after PetCo's launch?",
      },
      {
        sender: "agent",
        agentLabel: "PetSmart Commerce Intelligence",
        content:
          "Daily redemption timeline: the leashes discount started at 8% redemption in the first 5 days (below target but reasonable), then dropped to 1% the day after PetCo's launch on Aug 26. The badge gap was present from day one — it suppressed performance from the start — but the competitive undercut pushed it from underperforming to failing. Two problems, different timing. Fixing badges alone won't fully recover if PetCo is still running their promotion.",
      },
    ],
  },
};
