# Props Table Component

## Overview

The Props Table component automatically generates documentation tables for component props with intelligent grouping and filtering.

## Directory Structure

```
props-table/
├── components/          # React components
│   ├── component-props-table.tsx    # Main logic component
│   ├── props-category-table.tsx     # Category table renderer
│   ├── style-props-banner.tsx       # Style props support banner
│   ├── default-value.tsx            # Default value renderer
│   └── index.ts                     # Component exports
├── constants/           # Static configuration
│   ├── prop-groups.ts               # Prop group definitions
│   └── index.ts                     # Constants exports
├── types/              # TypeScript definitions
│   ├── prop-types.ts                # PropItem, PropCategory, GroupedProps
│   └── index.ts                     # Type exports
├── utils/              # Pure utility functions
│   ├── categorize-props.ts          # Prop categorization logic
│   ├── group-props.ts               # Prop grouping logic
│   └── index.ts                     # Utils exports
├── props-table.tsx     # Root component (compound component selector)
├── index.ts            # Public API export
└── README.md           # This file
```

## Features

### 1. **Prop Grouping (React Aria Style)**
Props are automatically categorized into 12 groups based on React Aria's grouping system:

- **Content**: Content-related props (children, items, columns, loadingState, etc.)
- **Selection**: Selection management props (selectionMode, selectedKeys, disabledKeys, etc.)
- **Value**: Value and change handling props (value, defaultValue, onChange, etc.)
- **Labeling**: Label and description props (label, labelPosition, contextualHelp, etc.)
- **Validation**: Validation and constraints (minValue, maxValue, isRequired, isInvalid, etc.)
- **Overlay**: Overlay and positioning (isOpen, placement, offset, shouldFlip, etc.)
- **Events**: All event handler props (matching /^on[A-Z]/ pattern)
- **Links**: Link-related props (href, target, rel, download, etc.)
- **Styling**: Styling props (style, className)
- **Forms**: Form-related props (name, type, autoComplete, form, etc.)
- **Accessibility**: Accessibility props (aria-*, role, id, tabIndex, etc.)
- **Advanced**: Advanced/unsafe props (UNSAFE_className, UNSAFE_style, slot)

Each category is collapsible with smooth animations. Empty categories are automatically hidden.

### 2. **Collapsible Categories**
- Categories can be expanded/collapsed for better readability
- Shows prop count badge when collapsed
- Smooth expand/collapse animations using CollapsibleMotion
- Default expanded categories: Content, Selection, Value
- User preferences persist during session

### 3. **Chakra UI Style Props Detection**
- Automatically detects if a component supports Chakra UI style props via `@supportsStyleProps` JSDoc tag
- Displays a visual banner when style props are supported
- Chakra style props (~200+) are filtered at documentation generation time to avoid clutter
- Provides a clear indicator without listing every CSS property

### 4. **Modular Architecture**
The component is split into focused modules:

- **Types**: TypeScript interfaces and type definitions (PropCategory, GroupedProps, PropMatcher, PropGroupConfig)
- **Constants**: Static configuration (prop groups, default expansion state)
- **Utils**: Pure functions for categorization and grouping
- **Components**: React components for rendering (ComponentPropsTable, CollapsiblePropsCategory, PropsCategoryTable)

## Usage

```tsx
import { PropsTable } from './props-table';

// Display props for a single component
<PropsTable id="Button" />

// Display props for a compound component (with sub-component selector)
<PropsTable id="Menu" />
```

## Customization

### Adding New Prop Categories

The prop grouping system is configuration-driven. To add a new category:

1. Update `types/prop-types.ts` to add the new category:
   ```typescript
   export type PropCategory =
     | "content"
     | "selection"
     // ... existing categories
     | "myNewCategory";  // Add here

   export interface GroupedProps {
     content: PropItem[];
     selection: PropItem[];
     // ... existing categories
     myNewCategory: PropItem[];  // Add here
   }
   ```

2. Update `constants/prop-groups.ts` to define the new category:
   ```typescript
   export const PROP_GROUPS: PropGroupConfig[] = [
     // ... existing groups
     {
       category: "myNewCategory",
       displayName: "My New Category",
       order: 13,  // Display order (higher numbers appear later)
       matchers: [
         "propName1",
         "propName2",
         /^pattern/,  // Can use RegExp for pattern matching
       ],
     },
   ];
   ```

3. **That's it!** The system will automatically:
   - Categorize props based on your matchers
   - Initialize the category in the grouped object
   - Render the collapsible section with the correct order
   - Handle empty categories (won't render if no props match)

### Modifying Default Expanded State

Update `constants/prop-groups.ts`:

```typescript
export const DEFAULT_EXPANDED = new Set<PropCategory>([
  "content",
  "selection",
  "value",
  "myNewCategory",  // Add your category here to expand by default
]);
```

### Filtering Additional Props

Chakra style props are filtered at documentation generation time in `scripts/doc-generation/filter-props.ts`. To filter additional prop types, update the filtering logic there rather than at runtime.

## Component Hierarchy

```
PropsTable (selector for compound components)
└── ComponentPropsTable (main logic)
    ├── StylePropsSupportBanner (conditional)
    └── CollapsiblePropsCategory (for each category)
        └── CollapsibleMotion.Root
            ├── CollapsibleMotion.Trigger (category header with count badge)
            └── CollapsibleMotion.Content
                └── PropsCategoryTable (props table)
                    └── DefaultValue (for default values)
```

## File Navigation Guide

### Need to modify...

- **Type definitions?** → `types/prop-types.ts`
- **Prop group configuration?** → `constants/prop-groups.ts` (add/modify categories here)
- **Default expanded categories?** → `constants/prop-groups.ts` (modify DEFAULT_EXPANDED)
- **Prop categorization logic?** → `utils/categorize-props.ts` (rarely needed - uses config)
- **Prop filtering at generation time?** → `scripts/doc-generation/filter-props.ts`
- **Grouping logic?** → `utils/group-props.ts` (rarely needed - uses config)
- **Banner appearance?** → `components/style-props-banner.tsx`
- **Category collapsible UI?** → `components/collapsible-props-category.tsx`
- **Table rendering?** → `components/props-category-table.tsx`
- **Main logic?** → `components/component-props-table.tsx`
- **Compound component selector?** → `props-table.tsx`

## Technical Details

- Uses `jotai` for global type definitions state
- Leverages `react-docgen-typescript` data for prop extraction
- Memoizes expensive computations (prop grouping, style prop detection)
- Automatically filters and categorizes props without configuration
- Maintains separation of concerns with focused modules
