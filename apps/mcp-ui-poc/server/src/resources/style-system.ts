/**
 * Style system resource
 * Comprehensive guide to Chakra UI styled-system props
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Update this timestamp when style system guide changes
const LAST_MODIFIED = "2025-12-29T00:00:00Z";

export function registerStyleSystemResource(server: McpServer) {
  server.registerResource(
    "Nimbus Style System Guide",
    "nimbus://style-system",
    {
      description:
        "Complete guide to Chakra UI styled-system props with examples",
      mimeType: "text/markdown",
      annotations: {
        audience: ["assistant"],
        priority: 1.0,
        lastModified: LAST_MODIFIED,
      },
    },
    async () => ({
      contents: [
        {
          uri: "nimbus://style-system",
          mimeType: "text/markdown",
          text: `# Nimbus Style System Guide

## Overview

Nimbus uses Chakra UI's styled-system for component styling. All style properties are passed via the \`styleProps\` object parameter.

**Key Principles:**
1. Use **camelCase** formatting (e.g., \`backgroundColor\`, not \`background-color\`)
2. Prefer **design tokens** over raw CSS values (e.g., \`"400"\` instead of \`"16px"\`)
3. Token scales follow **4px base unit** where \`100 = 4px\`
4. All CSS properties are supported via styled-system

## Token Scale Pattern (4px Base)

Most spacing-related tokens follow a 4px-based scale:
- \`100 = 4px\` (base unit)
- \`200 = 8px\` (2x base)
- \`300 = 12px\` (3x base)
- \`400 = 16px\` (4x base - most common)
- etc.

**Applies to:** spacing (margin, padding, gap), borderRadius, blur

**Does NOT apply to:** fontSize (custom scale), fontWeight (CSS standard), borderWidth (1px increments)

## Available Style Properties

### Layout Properties
- \`display\`: "flex" | "block" | "inline" | "inline-block" | "none" | etc.
- \`width\`, \`height\`: Tokens or CSS values ("100px", "50%", "full", "fit-content")
- \`maxWidth\`, \`minWidth\`, \`maxHeight\`, \`minHeight\`
- \`overflow\`, \`overflowX\`, \`overflowY\`: "visible" | "hidden" | "scroll" | "auto"
- \`position\`: "relative" | "absolute" | "fixed" | "sticky" | "static"
- \`top\`, \`right\`, \`bottom\`, \`left\`: Position offsets
- \`zIndex\`: Stacking order (number or string)

### Spacing Properties (4px-based tokens)
- \`margin\`, \`marginTop\`, \`marginRight\`, \`marginBottom\`, \`marginLeft\`
- \`marginX\`: Horizontal margin (left + right)
- \`marginY\`: Vertical margin (top + bottom)
- \`padding\`, \`paddingTop\`, \`paddingRight\`, \`paddingBottom\`, \`paddingLeft\`
- \`paddingX\`: Horizontal padding
- \`paddingY\`: Vertical padding
- \`gap\`: Space between flex/grid children
- \`rowGap\`, \`columnGap\`: Grid-specific gaps

**Token values:** "25" (1px), "50" (2px), "100" (4px), "150" (6px), "200" (8px), "250" (10px), "300" (12px), "350" (14px), "400" (16px), "450" (18px), "500" (20px), "600" (24px), "700" (28px), "800" (32px)

### Color Properties (Use Design Tokens)
- \`color\`: Text color
- \`backgroundColor\` (or \`bg\`): Background color
- \`borderColor\`: Border color
- \`colorPalette\`: Sets the color palette for component theming (e.g., "primary", "critical")
- \`opacity\`: 0 to 1

**Format:** \`{scale}.{step}\` where scale is color name, step is 1-12 or "contrast"

### Typography Properties
- \`fontSize\`: Size tokens (custom scale, not 4px-based)
- \`fontWeight\`: Weight tokens (100-900, CSS standard values)
- \`fontFamily\`: Font family name
- \`lineHeight\`: Line height (number or string)
- \`letterSpacing\`: Letter spacing
- \`textAlign\`: "left" | "center" | "right" | "justify"
- \`textDecoration\`: "underline" | "line-through" | "none"
- \`textTransform\`: "uppercase" | "lowercase" | "capitalize"
- \`whiteSpace\`: "normal" | "nowrap" | "pre" | "pre-wrap"

### Border Properties
- \`border\`: Shorthand (e.g., "1px solid gray")
- \`borderWidth\`: Width tokens ("25", "50", "75", "100") - 1px increments, NOT 4px-based
- \`borderStyle\`: "solid" | "dashed" | "dotted" | "none"
- \`borderColor\`: Color (use tokens)
- \`borderRadius\`: Radius tokens (4px-based: 100 = 4px)
- \`borderTop\`, \`borderRight\`, \`borderBottom\`, \`borderLeft\`: Individual borders

### Flexbox Properties
- \`flexDirection\`: "row" | "column" | "row-reverse" | "column-reverse"
- \`flexWrap\`: "wrap" | "nowrap" | "wrap-reverse"
- \`justifyContent\`: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
- \`alignItems\`: "flex-start" | "center" | "flex-end" | "stretch" | "baseline"
- \`alignContent\`: Same as justifyContent
- \`alignSelf\`: Override alignItems for specific child
- \`flex\`: Flex shorthand ("1", "0 1 auto", etc.)
- \`flexGrow\`, \`flexShrink\`, \`flexBasis\`: Individual flex properties

### Grid Properties
- \`gridTemplateColumns\`: Column template (e.g., "1fr 1fr", "repeat(3, 1fr)")
- \`gridTemplateRows\`: Row template
- \`gridColumn\`, \`gridRow\`: Grid placement
- \`gridAutoFlow\`: "row" | "column" | "dense"
- \`gridGap\`: Shorthand for rowGap + columnGap

### Effects
- \`boxShadow\`: Shadow tokens ("1"-"6") or CSS values
- \`textShadow\`: Text shadow CSS
- \`transform\`: CSS transform values
- \`transition\`: CSS transition values
- \`animation\`: CSS animation values
- \`cursor\`: Cursor type ("pointer", "default", "not-allowed", etc.)
- \`pointerEvents\`: "auto" | "none"

## Design Token Usage Examples

### Spacing (4px-based scale)
\`\`\`typescript
// Single property with token
styleProps: {
  padding: "400"     // 16px (4 × 4px)
}

// Multiple properties
styleProps: {
  paddingX: "400",   // 16px horizontal
  paddingY: "300",   // 12px vertical
  gap: "300"         // 12px gap
}

// Individual sides
styleProps: {
  paddingTop: "500",    // 20px
  paddingRight: "400",  // 16px
  paddingBottom: "300", // 12px
  paddingLeft: "400"    // 16px
}
\`\`\`

### Colors
\`\`\`typescript
// Semantic colors (RECOMMENDED)
styleProps: {
  color: "primary.11",           // Primary text
  backgroundColor: "neutral.2",   // Subtle background
  borderColor: "neutral.6"        // Border
}

// Interactive states
styleProps: {
  backgroundColor: "primary.9",   // Main button color
  color: "primary.contrast"       // Guaranteed readable text
}

// Brand colors
styleProps: {
  backgroundColor: "ctviolet.9",
  color: "ctviolet.contrast"
}

// System colors for decorative purposes
styleProps: {
  backgroundColor: "blue.3",      // Light blue background
  color: "blue.11"                // High contrast blue text
}

// colorPalette (can be used in styleProps OR as top-level param)
styleProps: {
  colorPalette: "primary"         // Sets component color theme
}
\`\`\`

### Typography
\`\`\`typescript
// Body text (default)
styleProps: {
  fontSize: "400",      // 16px
  fontWeight: "400"     // Normal
}

// Heading
styleProps: {
  fontSize: "750",      // 30px
  fontWeight: "600"     // Semi-bold
}

// Small helper text
styleProps: {
  fontSize: "300",      // 12px
  color: "neutral.11"
}
\`\`\`

### Borders (4px-based radius, 1px-based width)
\`\`\`typescript
// Rounded card
styleProps: {
  borderRadius: "200",    // 8px (4px-based: 2 × 4px)
  borderWidth: "25",      // 1px (NOT 4px-based)
  borderColor: "neutral.6"
}

// Fully rounded (pill/circle)
styleProps: {
  borderRadius: "full"    // 9999px
}

// Thicker border
styleProps: {
  borderWidth: "50",      // 2px
  borderStyle: "solid",
  borderColor: "critical.9"
}
\`\`\`

## Complete Component Examples

### Primary Button
\`\`\`typescript
styleProps: {
  padding: "300",              // 12px (3 × 4px)
  fontSize: "400",             // 16px
  fontWeight: "500",           // Medium
  borderRadius: "200",         // 8px (2 × 4px)
  backgroundColor: "primary.9",
  color: "primary.contrast",
  cursor: "pointer"
}
\`\`\`

### Card Container
\`\`\`typescript
styleProps: {
  padding: "500",              // 20px (5 × 4px)
  borderRadius: "200",         // 8px (2 × 4px)
  backgroundColor: "neutral.1",
  boxShadow: "3",
  borderWidth: "25",           // 1px (NOT 4px-based)
  borderColor: "neutral.5"
}
\`\`\`

### Text Input
\`\`\`typescript
styleProps: {
  padding: "300",              // 12px (3 × 4px)
  fontSize: "400",             // 16px
  borderRadius: "150",         // 6px (1.5 × 4px)
  borderWidth: "25",           // 1px (NOT 4px-based)
  borderColor: "neutral.7",
  backgroundColor: "bg",
  color: "fg"
}
\`\`\`

### Flex Layout with Token-based Spacing
\`\`\`typescript
styleProps: {
  display: "flex",
  flexDirection: "column",
  gap: "400",                  // 16px (4 × 4px)
  padding: "500",              // 20px (5 × 4px)
  alignItems: "stretch"
}
\`\`\`

### Grid Layout
\`\`\`typescript
styleProps: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "400",                  // 16px (4 × 4px)
  padding: "500"               // 20px (5 × 4px)
}
\`\`\`

## Understanding the 4px Base Scale

The 4px-based scale makes spacing consistent and predictable:

| Token | Calculation | Value | Common Use |
|-------|-------------|-------|------------|
| 100   | 1 × 4px     | 4px   | Minimal spacing |
| 200   | 2 × 4px     | 8px   | Small spacing |
| 300   | 3 × 4px     | 12px  | Default spacing |
| 400   | 4 × 4px     | 16px  | Standard spacing (most common) |
| 500   | 5 × 4px     | 20px  | Medium spacing |
| 600   | 6 × 4px     | 24px  | Large spacing |

**Special tokens:**
- \`25 = 1px\` (spacing only, for micro-adjustments)
- \`50 = 2px\` (spacing only, for fine-tuning)

## Component Props: Top-Level vs styleProps

Many tools accept component-specific props at both top-level AND in styleProps for flexibility:

\`\`\`typescript
// Approach 1: Top-level (with validation)
createBadge({
  label: "New",
  variant: "solid",       // Top-level (enum validated)
  colorPalette: "primary", // Top-level (enum validated)
  size: "sm",             // Top-level (enum validated)
  styleProps: {
    margin: "300"         // CSS overrides here
  }
})

// Approach 2: All in styleProps (more flexible, no enum validation)
createBadge({
  label: "New",
  styleProps: {
    variant: "solid",
    colorPalette: "primary",
    size: "sm",
    margin: "300"         // Mix everything together
  }
})
\`\`\`

**Recommendation:** Use top-level for component configuration (variant, size, colorPalette), use styleProps for CSS overrides.

## Best Practices

1. **Always prefer design tokens over raw CSS values**
   - ✅ \`margin: "400"\` (design token, 4px-based)
   - ❌ \`margin: "16px"\` (raw CSS)

2. **Understand which scales are 4px-based**
   - ✅ 4px-based: spacing, borderRadius, blur
   - ❌ NOT 4px-based: borderWidth (1px increments), fontSize (custom scale), fontWeight (CSS standard)

3. **Use semantic colors for meaning**
   - ✅ \`color: "primary.11"\` (semantic)
   - ❌ \`color: "#1a73e8"\` (hardcoded hex)

4. **Use camelCase property names**
   - ✅ \`backgroundColor: "neutral.2"\`
   - ❌ \`background-color: "neutral.2"\`

5. **Leverage shorthand properties**
   - ✅ \`paddingX: "400"\` (horizontal padding)
   - ⚠️ \`paddingLeft: "400", paddingRight: "400"\` (verbose but explicit)

6. **Use contextual color scales**
   - Main color: \`.9\` (e.g., \`primary.9\`)
   - Text on that color: \`.contrast\`
   - Text on white: \`.11\` or \`.12\`
   - Borders: \`.6\` or \`.7\`
   - Subtle backgrounds: \`.2\` or \`.3\`

7. **Mix tokens and CSS when appropriate**
   - Use tokens for semantic properties
   - Use CSS values for specific measurements (e.g., \`width: "300px"\`)

## See Also
- \`nimbus://design-tokens\` - Complete list of token values with mappings in JSON format
- \`nimbus://component-tags\` - Valid element tag names for creating components
`,
        },
      ],
    })
  );
}
