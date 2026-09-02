export interface ChatMessage {
  sender: "agent" | "user";
  agentLabel?: string;
  content: string;
  items?: { label: string; detail: string }[];
  footnote?: string;
}

export interface ChatConfig {
  agentName: string;
  placeholder: string;
  messages: ChatMessage[];
}

export const chatConfigs: Record<string, ChatConfig> = {
  "/products/galaxy-s25-ultra": {
    agentName: "Product Enrichment",
    placeholder: "Ask about this product...",
    messages: [
      {
        sender: "agent",
        agentLabel: "Product Enrichment Agent",
        content:
          "You're editing the Galaxy S25 Ultra. Currently 3 variants configured (Black/128GB, Black/256GB, White/128GB). Based on EU category trends, I can suggest additional variants for market expansion.",
      },
      { sender: "user", content: "What variants should I add for the EU market?" },
      {
        sender: "agent",
        agentLabel: "Product Enrichment Agent",
        content: "Based on EU category sales data, three combinations stand out:",
        items: [
          { label: "Navy / 256GB", detail: "Top seller in DE/FR for this category" },
          { label: "Green / 128GB", detail: "Trending color, zero results in your catalog" },
          { label: "White / 512GB", detail: "High-margin config, 12% of EU mobile sales" },
        ],
        footnote: "I've added these to the variants table as suggestions. Review and create them there, or tell me to adjust.",
      },
    ],
  },
  "/products/pricing": {
    agentName: "Pricing Optimizer",
    placeholder: "Ask about pricing strategy...",
    messages: [
      {
        sender: "agent",
        agentLabel: "Pricing Optimizer Agent",
        content:
          "You're reviewing prices for the Galaxy S25 Ultra after a 12% supplier cost increase. 5 of 6 price entries are now below the 20% margin floor. I've suggested adjustments that restore all entries above floor while staying competitive.",
      },
      { sender: "user", content: "What if I raise prices 8% flat across the line instead?" },
      {
        sender: "agent",
        agentLabel: "Pricing Optimizer Agent",
        content: "An 8% flat increase would restore 4 of 6 entries above the 20% floor. The remaining 2 (EUR/Online and USD/Online) would land at 19.1% and 18.4%, still below target.",
        items: [
          { label: "Flat 8%", detail: "4/6 above floor, avg margin 20.8%" },
          { label: "Per-SKU optimization", detail: "6/6 above floor, avg margin 22.1%" },
        ],
        footnote: "Per-SKU optimization gets all entries above floor with minimal competitive risk. I recommend applying the suggested prices.",
      },
    ],
  },
  "/discounts/summer-clearance": {
    agentName: "Promotions",
    placeholder: "Ask about this campaign...",
    messages: [
      {
        sender: "agent",
        agentLabel: "Promotions Agent",
        content:
          "You're setting up Summer Clearance 2026. I've detected a potential stacking conflict with the active Loyalty Member discount on 142 products.",
      },
      { sender: "user", content: "Help me design a tiered discount that maximizes conversion without eroding margin below 15%." },
      {
        sender: "agent",
        agentLabel: "Promotions Agent",
        content: "Here are three tier structures based on historical data:",
        items: [
          { label: "Flat 20%", detail: "Simple. 0 products below floor. Est. +16% orders." },
          { label: "15/20/25% by age", detail: "Higher clearance on older stock. 0 below floor. Est. +22% orders." },
          { label: "10/20/30% aggressive", detail: "12 products below floor. Est. +28% orders." },
        ],
        footnote: "The 15/20/25% tier balances clearance velocity with margin protection. Want me to configure those three discount rules?",
      },
    ],
  },
  "/orders/mc-2026-847291": {
    agentName: "Order Intelligence",
    placeholder: "Investigate this order...",
    messages: [
      {
        sender: "agent",
        agentLabel: "Order Intelligence Agent",
        content:
          "Order #MC-2026-847291 for Sarah Chen. Risk score 87/100. Primary signals: recent address change and order value 3.4x the customer's average. Account is 2.3 years old with consistent ordering patterns.",
      },
      { sender: "user", content: "Has this customer changed addresses before?" },
      {
        sender: "agent",
        agentLabel: "Order Intelligence Agent",
        content: "Yes. Sarah changed her shipping address once before, in March 2025 (Berlin to Munich). That order was also flagged as medium risk but was fulfilled without issue. The pattern is consistent with periodic relocation.",
        footnote: "The billing address has stayed constant across all 14 orders. I'd suggest this is a legitimate relocation, not a fraud signal.",
      },
    ],
  },
  "/categories/phone-cases": {
    agentName: "Category Intelligence",
    placeholder: "Ask about category structure...",
    messages: [
      {
        sender: "agent",
        agentLabel: "Category Intelligence Agent",
        content:
          'You\'re viewing Accessories > Phone Cases. Conversion is 38% below the Accessories average, and customers search "phone covers" 2.1x more than "phone cases." I\'ve suggested three restructuring changes.',
      },
      { sender: "user", content: "What if I merge Phone Cases entirely into Electronics > Mobile > Accessories?" },
      {
        sender: "agent",
        agentLabel: "Category Intelligence Agent",
        content: "Moving 847 products under Electronics > Mobile > Accessories would:",
        items: [
          { label: "Cross-sell proximity", detail: "Cases appear alongside phones in the tree" },
          { label: "4 URL redirects", detail: "1 parent + 3 children" },
          { label: "3 discount rules affected", detail: "Reference the Accessories > Phone Cases path" },
        ],
        footnote: "Risk: the Accessories top-level category would lose 34% of its products. Want me to model what that tree looks like?",
      },
    ],
  },
  "/products/pour-over-kettle": {
    agentName: "Product Enrichment",
    placeholder: "What can I help with?",
    messages: [
      {
        sender: "agent",
        agentLabel: "Product Enrichment Agent",
        content:
          "You're editing the Precision Pour-Over Kettle. It's at 41% readiness. The main gaps are categories (unassigned), descriptions (empty in all locales), and images (need 1 more).",
      },
      { sender: "user", content: "What else should I do before this goes live? I'm new and not sure about the process." },
      {
        sender: "agent",
        agentLabel: "Product Enrichment Agent",
        content: "Here's a launch checklist tailored to this product:",
        items: [
          { label: "1. Assign a category", detail: "I've suggested Coffee & Tea based on the product name and attributes" },
          { label: "2. Write descriptions", detail: 'Use "Generate description" in the toolbar for a draft in all locales' },
          { label: "3. Upload 1 more image", detail: "Coffee & Tea recommends 3+ lifestyle shots" },
          { label: "4. Review SEO", detail: "Once descriptions are in, generate SEO metadata" },
        ],
        footnote: "The product is priced and has variants configured, so those steps are done. Focus on content and categorization.",
      },
    ],
  },
};
