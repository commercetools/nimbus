# Design

## Approach

Mechanical token-reference shift across all recipe files. Each spacing property
value is mapped through a shift table — no judgment calls per component, same
rule everywhere. This preserves relative visual hierarchy between components
(Card md is still visually between sm and lg) while compressing absolute values.

## Shift Rules

1. Look up the current token value in the shift map
2. Replace with the mapped value
3. If the value is at the floor (`"50"` or `"25"`), leave unchanged
4. Apply the same rule to:
   - Bare token values: `px: "400"` → `px: "300"`
   - CSS custom property values: `"spacing.400"` → `"spacing.300"`
   - Curly-brace interpolations: `{spacing.400}` → `{spacing.300}`
   - Negative values: `"-100"` → `"-50"`
5. For `calc()` expressions, shift each token reference independently

## Handling Patterns

### Pattern A: Bare numeric string

```typescript
// Before
px: "400",
gap: "200",

// After
px: "300",
gap: "150",
```

### Pattern B: CSS custom property assignment

```typescript
// Before
"--card-spacing": "spacing.400",

// After
"--card-spacing": "spacing.300",
```

### Pattern C: Curly-brace interpolation in calc()

```typescript
// Before
pl: "calc({spacing.200} + (var(--level) - 1) * var(--indent))",

// After
pl: "calc({spacing.150} + (var(--level) - 1) * var(--indent))",
```

### Pattern D: Negative spacing

```typescript
// Before
mr: "-100",

// After
mr: "-50",
```

## Component Groups

Recipes are updated in groups for reviewability:

1. **Page-level**: default-page, modal-page, dialog, drawer
2. **Containers**: card, accordion, chat-message, chat-message-list,
   rich-text-input
3. **Controls**: button, toggle-button, text-input, search-input, number-input,
   multiline-text-input, date-input, date-range-picker, combobox, checkbox,
   radio-input, switch
4. **Navigation**: tabs, tab-nav, breadcrumbs, steps, toolbar, tree
5. **Data display**: data-table, table, badge, alert, toast, tooltip,
   progress-bar, list, item, draggable-list
6. **Forms**: form-field, localized-field
7. **Misc**: calendar, range-calendar, code, kbd, drop-zone, page-content,
   scroll-area

## DataTable Density Reconciliation

The DataTable has a `condensed` variant with its own reduced cell padding. After
the default shift:
- Default cell padding: `"400"` → `"300"` (16px → 12px)
- Condensed cell padding: `"300"` → `"200"` (12px → 8px)

Both shift by the same rule, maintaining the relative difference.
