# Implementation Learnings: Contextual AI Prototype

Observations from building a working React prototype of the 6 user journeys described in `mc-foundation-planning/agentic-surfaces/user-journeys-contextual-ai.md`, using real Nimbus components.

## What worked well

**The three render target types compose naturally.** Every journey uses the same three-layer pattern (inline cards at the top for persistent analysis, augmentations embedded in form fields/tables, panel for conversation), and the visual hierarchy is intuitive without explanation. The inline cards provide ambient context, the augmentations feel like the existing controls got smarter, and the panel is there when you need depth. This composition pattern is the strongest design signal the RFCs produce.

**InlineSlot direction (row vs. column) is load-bearing.** Horizontal inline slots (side-by-side cards) work well for dashboard-style summaries at the top of a page. Vertical stacking works for narrower contexts like expanded table rows. The `direction` prop on `AgentInlineSlot` should be part of the JSX-Surface Channel Contract, not just an implementation detail. It changes the visual hierarchy meaningfully.

**Provenance indicators at small sizes work.** At 10-12px (Nimbus `boxSize="350"`), the sparkles icon is subtle enough to be ambient but visible enough to be discoverable. Larger sizes (the default Nimbus `2xs` at ~16px) compete visually with the content. Recommendation: the provenance indicator should be smaller than the smallest text on the page.

**Locator-aware chat context is the biggest UX win.** The chat panel knowing the current page context (and pre-seeding the conversation accordingly) eliminates the "blank prompt" problem entirely. The user never types a prompt from scratch. This should be emphasized in the RFCs as a primary advantage of the locator system: locators are not just placement mechanisms, they are context signals.

## Issues and gaps discovered

**Nimbus component API discovery is nontrivial.** Several Nimbus components use compound APIs that differ from what you'd guess:
- `Tooltip` is `Tooltip.Root` + `Tooltip.Content`, not `<Tooltip content={...}>`
- `Breadcrumbs` is `Breadcrumbs.Root` + `Breadcrumbs.Item`, not `Breadcrumbs.Link`/`Breadcrumbs.CurrentLink`
- `FormField.Description` exists but `FormField.HintMessage` does not
- Icons from `@commercetools/nimbus-icons` must be wrapped in `<Icon as={...} />`, not used bare with `style` props

The Nimbus MCP was essential for discovering these APIs. Without it, the prototype would have taken significantly longer to debug.

**Nimbus ComboBox sections handle the augmented dropdown well.** The `ComboBox.Section` component with custom `ComboBox.Option` children maps directly to the RFC's augmented combobox pattern. A "Recently Used" section and an "AI Suggested" section with provenance indicators, confidence badges, and custom styling per option are all achievable within the existing Nimbus API. The prototype's hand-built dropdown should be migrated to use `ComboBox.Root` with `ComboBox.Section` for each group. No component gap here; this was an implementation shortcut in the prototype, not a Nimbus limitation.

**Augmentation data in table cells is hard to show subtly.** The price table in Journey 2 embeds provenance indicators and suggested values inline with existing data, but the visual density gets high quickly. Showing a sparkles icon + current value + suggested value + margin impact + actions per row requires careful column sizing. The RFC's `rows` data shape doesn't address column width or cell-level rendering hints.

**Panel slide animation timing matters.** The 200ms ease transition for the chat panel works well. Faster (100ms) feels abrupt; slower (300ms) feels sluggish. The panel width change causes the main content to reflow, which can be jarring on pages with tables. A fixed-position overlay panel (floating over content rather than pushing it) might be better for the production implementation.

**Chat panel messages are static in this prototype.** The real implementation needs AG-UI streaming for agent messages. The user journey document describes real-time updates (inline cards updating as context changes, suggestions appearing as the user edits), but this prototype uses static mock data. The next iteration should integrate CopilotKit's streaming to demonstrate the "live" feel.

## Recommendations for the RFCs

1. **Add `direction` to the inline slot spec** in the JSX-Surface Channel Contract. It is not just a CSS detail; it determines whether agents stack vertically or tile horizontally, which changes the information hierarchy.

2. **Specify provenance indicator sizing guidance.** The Augmentation Render Target RFC defines `agentKey` and `agentLabel` fields but doesn't specify how the indicator should be sized relative to the content. Recommendation: the indicator should be 60-70% of the smallest text size on the page (e.g., 10px icon alongside 14px text).

3. **The augmented combobox pattern maps cleanly to Nimbus `ComboBox.Section`.** The RFC's `items` data shape with `group` fields translates to `ComboBox.Section` with custom `ComboBox.Option` children. No component gap: the target component at the anchor can render AI-suggested items with provenance indicators and confidence badges using standard Nimbus APIs. The RFC should note this as a concrete implementation path.

4. **Consider a floating panel option** in addition to the push panel. The MC's current right panel pushes content left, which causes reflow. A floating/overlay panel would avoid reflow and feel lighter, especially for brief interactions.

5. **The locator-as-context-signal concept deserves its own section** in the Multi-Surface Agent Delivery RFC. Currently locators are described as placement identifiers. The prototype shows they're equally valuable as context signals: the agent uses the locator to determine what data to pre-fetch and what conversation to pre-seed.

6. **Expandable table rows as inline slots work but need careful density management.** When two agents stack vertically in an expanded row, the row can become taller than the viewport. Consider a max-height with scroll, or a "show more" pattern for the expanded area.
