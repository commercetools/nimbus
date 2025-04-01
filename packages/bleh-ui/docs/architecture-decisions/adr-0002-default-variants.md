# ADR: Removing defaultVariants from Chakra Recipes

## Context

We're currently defining UI component recipes using Chakra's `defineRecipe` API,
which allows us to specify variants, base styles, and defaultVariants. While
defaultVariants seem helpful for setting sensible defaults, we've encountered
several issues that suggest they may cause more problems than they solve.

In our current implementation, components like Button specify defaultVariants:

```js
defaultVariants: {
  size: "md",
  variant: "subtle",
  tone: "neutral",
}
```

This approach seemed logical to ensure components have reasonable styling
without requiring explicit variant props. However, as our component library
grows and components become more interconnected, we're discovering limitations
and potential pitfalls.

## Problem Statement

There are several issues with specifying defaultVariants in component recipes:

1. **Component Inheritance Complexity**: When components use other components
   (e.g., Dropdown using Button), the inheritance chain can create unexpected
   styling conflicts. Default variants from parent components may clash with or
   override those of child components.

2. **Premature Optimization**: We're setting defaults before fully understanding
   how components will be used across the application. This leads to arbitrary
   decisions that may not align with actual usage patterns.

3. **Inconsistent Mental Model**: Developers must remember which defaults are
   applied to which components, creating cognitive overhead when using the
   component library.

4. **Reduced Flexibility**: Default variants can mask the need for more flexible
   composition patterns, leading to unnecessary prop overrides.

5. **Testing Complexity**: When testing components, we must account for default
   variants, which can complicate test setup and make tests less clear.

## Early Approaches Considered

### Approach A: Comprehensive Default Variants

Initially, we considered providing extensive defaultVariants for all components
to ensure a consistent look and feel without requiring explicit variant props:

```js
defaultVariants: {
  size: "md",
  variant: "subtle",
  tone: "neutral",
  // Additional variants as needed
}
```

**Issue**: This approach created inflexible components that required explicit
overrides for common use cases and became problematic when components were
nested inside each other.

### Approach B: Minimal Default Variants

We then considered a minimal approach where only the most essential defaults
would be specified:

```js
defaultVariants: {
  size: "md",
  // Only include size as default
}
```

**Issue**: Even minimal defaults can cause problems in nested component
scenarios, and it was difficult to determine which variants were truly
"essential" across different contexts.

## Decision

We will **remove defaultVariants from all Chakra recipes** and instead:

1. Document recommended variant combinations for different use cases
2. Provide composition patterns that make setting variants explicit and clear
3. Consider higher-level components for common use cases that apply appropriate
   variants

Example implementation without defaultVariants:

```jsx
import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  className: "bleh-ui-button",
  base: {
    // Base styles remain unchanged
    borderRadius: "200",
    display: "inline-flex",
    // ... other base styles
  },
  variants: {
    // Variants remain unchanged
    size: {
      /* ... */
    },
    variant: {
      /* ... */
    },
    tone: {
      /* ... */
    },
  },
  // No defaultVariants specified
});
```

## Rationale

Removing defaultVariants offers several advantages:

1. **Explicitness Over Implicitness**: Developers will explicitly choose
   variants, making component usage more predictable and transparent.

2. **Better Composition**: Components can be composed without worrying about
   inherited default variants causing unexpected styling.

3. **Future-Proofing**: As our understanding of component usage evolves, we
   won't need to change defaults that might break existing implementations.

4. **Cleaner Mental Model**: One less thing for consumers to remember when using
   the component library.

## Consequences

### Positive

- More predictable component behavior, especially in nested scenarios
- Simplified component recipes
- Clearer component documentation (no need to list default variants)
- More flexibility for different contexts and use cases

### Negative

- Developers will need to explicitly specify variants more often
- More verbose component usage in some cases
- Potentially more repetitive variant props in component JSX

### Neutral

- We'll need to update existing component usage to explicitly set variants
- Documentation will need to provide clear examples of recommended variant
  combinations

## Examples in Practice

### Before (with defaultVariants)

```jsx
// Button with implicit defaultVariants (size: "md", variant: "subtle", tone: "neutral")
<Button>Click me</Button>

// Must override defaults explicitly
<Button size="xs" variant="solid" tone="primary">Click me</Button>
```

### After (without defaultVariants)

```jsx
// Need to specify all variants explicitly
<Button size="md" variant="subtle" tone="neutral">Click me</Button>

// No defaults to override, just set what you need
<Button size="xs" variant="solid" tone="primary">Click me</Button>
```
