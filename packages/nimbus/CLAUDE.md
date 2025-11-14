# Nimbus Component Library

React component library built with React Aria Components and Chakra UI v3, providing accessible, themeable UI components for commercetools applications.

## RFC 2119 Compliance

**This file and all Nimbus documentation MUST be interpreted according to [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).**

Key words: **MUST** / **MUST NOT** / **SHOULD** / **SHOULD NOT** / **MAY** (see root CLAUDE.md for definitions)

## Quick Commands

```bash
# Development
pnpm --filter @commercetools/nimbus start:storybook  # Start Storybook dev server
pnpm --filter @commercetools/nimbus build            # Build package
pnpm --filter @commercetools/nimbus typecheck        # Type checking
pnpm --filter @commercetools/nimbus lint             # Lint code

# Testing
pnpm --filter @commercetools/nimbus test             # Run all tests
pnpm --filter @commercetools/nimbus test:unit        # Unit tests only
pnpm --filter @commercetools/nimbus test:storybook   # Storybook tests only

# Build artifacts
pnpm --filter @commercetools/nimbus build-theme-typings  # Generate theme types
```

## Package Overview

**Purpose:** Core UI component library with 70+ accessible React components

**Key Technologies:**
- React 18
- React Aria Components (accessibility primitives)
- Chakra UI v3 (styling system)
- TypeScript (strict mode)
- Vitest (testing)
- Storybook (development + testing)

**Build Outputs:**
- ESM bundle (`dist/index.es.js`)
- TypeScript declarations (`dist/**/*.d.ts`)
- CSS bundle (embedded in components)

## Critical Development Patterns

### 1. Recipe Registration (⚠️ CRITICAL)

⚠️ **YOU MUST manually register ALL recipes or no styles will be applied:**

```typescript
// src/theme/recipes/index.ts (standard recipes)
export { buttonRecipe } from "@/components/button/button.recipe";

// src/theme/slot-recipes/index.ts (slot recipes)
export { menuSlotRecipe } from "@/components/menu/menu.recipe";
```

**No automated validation exists!** After registration: `pnpm --filter @commercetools/nimbus build-theme-typings`

### 2. Cross-Chunk Imports (⚠️ CRITICAL)

**YOU MUST import directly from implementation files when crossing component directories:**

```typescript
// ❌ MUST NOT - Barrel exports cause circular dependencies
import { IconToggleButton } from "@/components/icon-toggle-button";
import type { ToggleButtonProps } from "../toggle-button";

// ✅ MUST - Direct file imports
import { IconToggleButton } from "@/components/icon-toggle-button/icon-toggle-button";
import type { ToggleButtonProps } from "../toggle-button/toggle-button.types";
```

**Why:** Vite creates separate chunks per `index.ts`. Barrel imports create chunk-to-chunk dependencies.

### 3. Storybook Testing Modes

**YOU MUST build before running tests:**

- **Dev Mode** (`pnpm start:storybook`): Uses source with HMR
- **Test Mode** (`pnpm test:storybook`): Uses built `dist/` bundle
- **Workflow:** `pnpm --filter @commercetools/nimbus build && pnpm test:storybook`

### 4. Component Testing Strategy

**YOU MUST test ALL component behavior in Storybook stories (`.stories.tsx`):**
- Interactive behavior, state changes, accessibility, edge cases

**YOU MUST NOT use unit tests for components:**
- Unit tests (`.spec.ts`) are ONLY for utilities and hooks

### 5. React Aria Integration

**YOU MUST use "Ra" prefix for React Aria imports:**

```typescript
import { Button as RaButton } from "react-aria-components";
```

### 6. Compound Component Pattern

**YOU MUST export `.Root` as the FIRST property:**

```typescript
export const Menu = {
  Root: MenuRoot,  // MUST be first
  Trigger: MenuTrigger,
  Content: MenuContent,
};
```

## Quick Decision Matrix

**Creating a component? Answer these:**
- Multiple parts (trigger, content, item)? → [Compound Component](../../docs/nimbus/file-type-guidelines/compound-components.md)
- Needs accessibility primitives? → Use React Aria Components ([Architecture Decisions](../../docs/nimbus/file-type-guidelines/architecture-decisions.md))
- Visual variants (sizes, colors)? → Create recipe ([Recipes Guide](../../docs/nimbus/file-type-guidelines/recipes.md))
- User-facing text? → Add i18n support ([i18n Guide](../../docs/nimbus/file-type-guidelines/i18n.md))
- Testing new feature? → MUST build first, then test ([Stories Guide](../../docs/nimbus/file-type-guidelines/stories.md))

## Component Development Workflow

### Creating a New Component

1. Plan architecture (single vs compound, React Aria needs)
2. Create file structure
3. Define types (`{component}.types.ts`)
4. Add i18n if user-facing text
5. Create recipes (`{component}.recipe.ts`)
6. Build slots (`{component}.slots.tsx`)
7. Implement component (`{component}.tsx`)
8. Write stories with play functions
9. Create MDX documentation
10. Export in `index.ts`
11. ⚠️ **CRITICAL:** Register recipe in theme config

### Updating an Existing Component

1. Modify files
2. Update types if needed
3. Update tests (play functions)
4. **MUST build:** `pnpm --filter @commercetools/nimbus build`
5. **MUST test:** `pnpm test:storybook`
6. Update docs if needed

## Detailed Guidelines

For comprehensive component development guidelines, see **[docs/nimbus/](../../docs/nimbus/)**:

### Core Documentation
- **[Component Guidelines](../../docs/nimbus/component-guidelines.md)** - Main navigation hub
- **[File Review Protocol](../../docs/nimbus/file-review-protocol.md)** - Review process

### File Type Guidelines
- **[Architecture Decisions](../../docs/nimbus/file-type-guidelines/architecture-decisions.md)** - Component design patterns
- **[Main Component](../../docs/nimbus/file-type-guidelines/main-component.md)** - Implementation patterns
- **[Types](../../docs/nimbus/file-type-guidelines/types.md)** - TypeScript definitions
- **[Recipes](../../docs/nimbus/file-type-guidelines/recipes.md)** - Chakra UI styling
- **[Slots](../../docs/nimbus/file-type-guidelines/slots.md)** - Styled wrapper components
- **[Stories](../../docs/nimbus/file-type-guidelines/stories.md)** - Storybook tests
- **[Documentation](../../docs/nimbus/file-type-guidelines/documentation.md)** - MDX docs
- **[i18n](../../docs/nimbus/file-type-guidelines/i18n.md)** - Internationalization
- **[Compound Components](../../docs/nimbus/file-type-guidelines/compound-components.md)** - Multi-part components
- **[Hooks](../../docs/nimbus/file-type-guidelines/hooks.md)** - Custom React hooks
- **[Unit Testing](../../docs/nimbus/file-type-guidelines/unit-testing.md)** - Testing utilities/hooks

### Component Templates
- **[Component Templates](../../docs/nimbus/component-templates/)** - Boilerplate code

## Common Tasks

### Adding a New Recipe

1. Create `{component}.recipe.ts`
2. Define with `defineRecipe` or `defineSlotRecipe`
3. ⚠️ **YOU MUST register:** `src/theme/recipes/index.ts` (standard) or `src/theme/slot-recipes/index.ts` (slot)
4. Build typings: `pnpm --filter @commercetools/nimbus build-theme-typings`

### Extracting i18n Messages

```bash
cd packages/i18n && pnpm build
```

Extracts from `*.i18n.ts` files and compiles.

## Component File Structure

Each component in `src/components/{name}/`:
- `index.ts` - Barrel export
- `{name}.tsx` - Implementation
- `{name}.types.ts` - TypeScript types
- `{name}.recipe.ts` - Styling recipe (MUST register in theme!)
- `{name}.slots.tsx` - Slot components
- `{name}.i18n.ts` - Translations (if needed)
- `{name}.stories.tsx` - Storybook tests
- `{name}.mdx` - Documentation

## Related Documentation

- **[Root CLAUDE.md](../../CLAUDE.md)** - Monorepo overview and workspace commands
- **[docs/nimbus/](../../docs/nimbus/)** - Comprehensive component guidelines
- **[Nimbus README](./README.md)** - Package-level information

## Common Issues

### Styles Not Applied
**YOU MUST:**
1. Verify recipe is registered in `src/theme/recipes/` or `src/theme/slot-recipes/`
2. Rebuild theme typings: `pnpm --filter @commercetools/nimbus build-theme-typings`

### Tests Failing After Changes
**YOU MUST build first:**
```bash
pnpm --filter @commercetools/nimbus build && pnpm test:storybook
```
Tests run against `dist/`, not source.

### Circular Chunk Dependencies Warning
**YOU MUST use direct file imports** for cross-component imports (see section 2 above).

### Recipe Variants Not Working
**YOU MUST:**
1. Verify recipe registration in theme
2. Verify variant exists in recipe definition
3. Rebuild theme typings

---

For detailed development patterns, architecture decisions, and comprehensive guidelines, see the **[docs/nimbus/](../../docs/nimbus/)** directory.
