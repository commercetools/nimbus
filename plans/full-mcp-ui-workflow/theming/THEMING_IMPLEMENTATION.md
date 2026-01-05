# Nimbus Custom Theme Implementation Plan

## Executive Summary

This document outlines the implementation plan for adding consumer-generated theme support to Nimbus, with a focus on custom color palettes following Radix UI's 12-step color scale methodology.

**Approach**: Configuration-based static generation (Option 4) with build-time tooling.

**Target**: Enable consumers to define custom brand color palettes that integrate seamlessly with Nimbus's existing token system while maintaining accessibility, type safety, and performance.

---

## Table of Contents

1. [Goals and Requirements](#goals-and-requirements)
2. [Technical Architecture](#technical-architecture)
3. [API Design](#api-design)
4. [Implementation Phases](#implementation-phases)
5. [File Structure](#file-structure)
6. [Integration Points](#integration-points)
7. [Testing Strategy](#testing-strategy)
8. [Documentation Requirements](#documentation-requirements)
9. [Migration Path](#migration-path)
10. [Future Enhancements](#future-enhancements)

---

## Goals and Requirements

### Primary Goals

1. **Enable Custom Palettes**: Allow consumers to generate Radix-compatible 12-step color scales from base colors
2. **Maintain Type Safety**: Generate TypeScript definitions for all custom palettes
3. **Preserve Accessibility**: Ensure all generated colors meet WCAG 2.1 AA contrast requirements
4. **Seamless Integration**: Work naturally with existing `pnpm build:tokens` workflow
5. **Developer Experience**: Provide clear, declarative configuration with validation

### Extended Goals (Phase 5)

- Runtime theme generation via service API
- Dynamic theme application without page reload
- Browser-based color generation (optional)
- Theme caching and optimization

### Non-Goals

- Support for gradient or complex color patterns
- Complete theme system overhaul (only color palettes for now)
- Built-in theme marketplace (future consideration)

### Requirements

#### Functional Requirements

**Build-Time (Phase 1-4)**:
- FR1: Support generating color scales from single base color
- FR2: Support manually defining full 12-step scales
- FR3: Support importing Radix preset palettes
- FR4: Generate both light and dark mode variants
- FR5: Support semantic color mapping (primary, critical, etc.)
- FR6: Validate color contrast ratios
- FR7: Generate TypeScript type definitions
- FR8: Integrate with existing Chakra UI token system

**Runtime (Phase 5)**:
- FR9: Isomorphic color generation engine (works in Node.js and browser)
- FR10: Runtime theme application utilities
- FR11: Apply themes dynamically without page reload
- FR12: Support system prop updates in NimbusProvider
- FR13: Client-side theme generation (browser-based)
- FR14: Service-based theme generation (API integration examples)

#### Non-Functional Requirements

**Build-Time**:
- NFR1: Zero runtime performance overhead (for static themes)
- NFR2: Build time < 5 seconds for typical configs
- NFR3: Clear error messages for invalid configs
- NFR4: Support for monorepo setups
- NFR5: Compatible with existing Nimbus component library

**Runtime**:
- NFR6: Theme service response time < 200ms
- NFR7: Runtime bundle size increase < 15kb (gzipped)
- NFR8: Theme application without visible flicker
- NFR9: Support concurrent theme generation requests
- NFR10: Graceful degradation if service unavailable

---

## Technical Architecture

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Consumer Application                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         nimbus.theme.config.ts                      │    │
│  │  - Define custom palettes                           │    │
│  │  - Configure semantic mappings                      │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │         @commercetools/nimbus-theme-cli             │    │
│  │  - Load and validate config                         │    │
│  │  - Generate color scales                            │    │
│  │  - Output token files                               │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Generated Files (git-committed)                │    │
│  │  - custom-palettes.tokens.ts                        │    │
│  │  - custom-palettes.types.ts                         │    │
│  │  - semantic-colors.config.ts                        │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Existing build:tokens Workflow              │    │
│  │  - Merge custom + default tokens                    │    │
│  │  - Generate Chakra UI theme                         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Theme Configuration Schema (`@commercetools/nimbus/theme`)

- TypeScript schema for `nimbus.theme.config.ts`
- Runtime validation using Zod or similar
- Type inference for autocomplete

#### 2. Color Generation Engine (`@commercetools/nimbus-theme-generator`)

- Leverage `@radix-ui/colors` for preset palettes
- Use color manipulation library (e.g., `culori`, `chroma-js`) for custom generation
- Implement Radix-compatible scale generation algorithm
- Generate contrast colors for each scale

#### 3. CLI Tool (`@commercetools/nimbus-theme-cli`)

- Command: `pnpm nimbus generate-theme`
- Load and validate configuration
- Generate token files
- Generate TypeScript types
- Integrate with existing build pipeline

#### 4. Token Generator

- Output Chakra UI-compatible token format
- Support CSS custom properties
- Generate both light and dark mode variants
- Include semantic color mappings

### Technology Stack

- **Configuration Validation**: Zod
- **Color Manipulation**: `culori` (comprehensive, tree-shakeable)
- **Radix Colors**: `@radix-ui/colors` (for presets and reference)
- **CLI Framework**: Commander.js
- **File Generation**: Prettier (for formatting output)
- **Testing**: Vitest (consistency with Nimbus)

---

## API Design

### Configuration File Schema

```typescript
// nimbus.theme.config.ts
import { defineThemeConfig } from '@commercetools/nimbus/theme';

export default defineThemeConfig({
  /**
   * Custom color palettes
   */
  palettes: {
    // Option 1: Generate from base color
    brandPrimary: {
      type: 'generated',
      baseColor: '#FF5733',
      mode: 'auto', // 'auto' | 'light' | 'dark'
      algorithm: 'radix', // 'radix' | 'hsl' | 'oklch'
      options: {
        // Optional fine-tuning
        lightness: 'default', // 'lighter' | 'default' | 'darker'
        saturation: 'default', // 'lower' | 'default' | 'higher'
      }
    },

    // Option 2: Define complete scale manually
    brandSecondary: {
      type: 'manual',
      light: {
        '1': '#fef8f4',
        '2': '#fef0e7',
        '3': '#fde5d3',
        '4': '#fcd9bd',
        '5': '#facda5',
        '6': '#f7be8a',
        '7': '#f4ab6a',
        '8': '#ef9340',
        '9': '#FF5733',
        '10': '#e54d2a',
        '11': '#cc3d1a',
        '12': '#5c1d0d',
        contrast: '#ffffff',
      },
      dark: {
        '1': '#1f1511',
        '2': '#2a1e19',
        '3': '#3a2820',
        '4': '#4a3327',
        '5': '#5c3f2e',
        '6': '#714c36',
        '7': '#8b5d3f',
        '8': '#a8734a',
        '9': '#FF5733',
        '10': '#ff6d48',
        '11': '#ff8c6f',
        '12': '#fef8f4',
        contrast: '#1a0f0a',
      }
    },

    // Option 3: Use Radix preset
    brandAccent: {
      type: 'preset',
      preset: 'violet', // Any Radix color name
    },

    // Option 4: Extend existing palette
    brandInfo: {
      type: 'extend',
      base: 'blue', // Existing Nimbus palette
      overrides: {
        light: {
          '9': '#0066CC', // Override specific steps
          '10': '#0052A3',
        }
      }
    }
  },

  /**
   * Semantic color mappings
   */
  semantic: {
    primary: 'brandPrimary',
    secondary: 'brandSecondary',
    accent: 'brandAccent',
    // Keep existing semantics or override
    critical: 'red',
    positive: 'green',
    warning: 'yellow',
    info: 'brandInfo',
    neutral: 'gray',
  },

  /**
   * Validation options
   */
  validation: {
    enforceContrast: true, // Warn if contrast ratios don't meet WCAG AA
    minContrast: 4.5, // WCAG AA for normal text
    warnOnSimilarColors: true, // Warn if colors are too similar
  },

  /**
   * Output options
   */
  output: {
    path: './src/theme/custom', // Where to generate files
    format: 'typescript', // 'typescript' | 'javascript'
    includeTypes: true, // Generate TypeScript types
    includeCss: true, // Generate CSS custom properties
  }
});
```

### Generated Token File Structure

```typescript
// Generated: src/theme/custom/custom-palettes.tokens.ts
import { defineSemanticTokens } from '@chakra-ui/react';

export const customPalettes = defineSemanticTokens({
  colors: {
    // Brand Primary palette
    'brandPrimary.1': {
      value: {
        _light: '#fef9f8',
        _dark: '#1f1210',
      }
    },
    'brandPrimary.2': {
      value: {
        _light: '#fef0ed',
        _dark: '#2a1917',
      }
    },
    // ... steps 3-12
    'brandPrimary.contrast': {
      value: {
        _light: '#ffffff',
        _dark: '#1a0e0c',
      }
    },

    // Brand Secondary palette
    // ... similar structure

    // Semantic mappings
    'primary.1': { value: '{colors.brandPrimary.1}' },
    'primary.2': { value: '{colors.brandPrimary.2}' },
    // ... etc
  }
});
```

### Generated Type Definitions

```typescript
// Generated: src/theme/custom/custom-palettes.types.ts

/**
 * Custom color palettes defined in nimbus.theme.config.ts
 */
export type CustomPalette =
  | 'brandPrimary'
  | 'brandSecondary'
  | 'brandAccent'
  | 'brandInfo';

/**
 * All available color palettes (default + custom)
 */
export type ColorPalette =
  | CustomPalette
  | 'red' | 'blue' | 'green' // ... existing palettes
  | 'primary' | 'secondary' | 'critical'; // semantics

/**
 * Color steps for any palette
 */
export type ColorStep =
  | '1' | '2' | '3' | '4' | '5' | '6'
  | '7' | '8' | '9' | '10' | '11' | '12'
  | 'contrast';

/**
 * Full color token reference
 */
export type ColorToken = `${ColorPalette}.${ColorStep}`;

// Augment Chakra UI types
declare module '@chakra-ui/react' {
  interface ColorPaletteOverride {
    brandPrimary: true;
    brandSecondary: true;
    brandAccent: true;
    brandInfo: true;
  }
}
```

### CLI Commands

```bash
# Generate theme from config
pnpm nimbus generate-theme

# Generate with specific config file
pnpm nimbus generate-theme --config ./custom.theme.config.ts

# Validate config without generating
pnpm nimbus validate-theme

# Generate with watch mode for development
pnpm nimbus generate-theme --watch

# Generate and automatically update imports
pnpm nimbus generate-theme --update-imports

# Output preview in terminal
pnpm nimbus preview-theme

# Generate documentation for custom palettes
pnpm nimbus document-theme
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Establish core infrastructure and configuration schema.

#### Tasks

1. **Create new packages**
   - `packages/nimbus-theme-generator/` - Core generation logic
   - `packages/nimbus-theme-cli/` - CLI tool
   - Update `packages/nimbus/` to export theme utilities

2. **Define configuration schema**
   - Create TypeScript types for config
   - Implement Zod validation schema
   - Write `defineThemeConfig` helper

3. **Set up color generation engine**
   - Install dependencies (`culori`, `@radix-ui/colors`)
   - Implement base color → 12-step scale algorithm
   - Add contrast color generation
   - Create unit tests for color generation

4. **Deliverables**
   - ✅ Configuration schema with types
   - ✅ Color generation algorithm
   - ✅ Unit tests for generation
   - ✅ Initial documentation

### Phase 2: CLI Tool (Week 2)

**Goal**: Build functional CLI tool for theme generation.

#### Tasks

1. **Implement CLI framework**
   - Set up Commander.js
   - Add command definitions
   - Implement config file loading

2. **Build token generator**
   - Generate Chakra UI token format
   - Support light/dark mode output
   - Generate semantic mappings
   - Format output with Prettier

3. **Add TypeScript type generation**
   - Generate palette type unions
   - Generate color token types
   - Create Chakra UI type augmentation
   - Generate JSDoc comments

4. **Implement validation**
   - Check contrast ratios
   - Warn on accessibility issues
   - Validate color format
   - Check for naming conflicts

5. **Deliverables**
   - ✅ Functional CLI tool
   - ✅ Token file generation
   - ✅ Type file generation
   - ✅ Validation with clear errors

### Phase 3: Integration (Week 3)

**Goal**: Integrate with existing Nimbus build workflow.

#### Tasks

1. **Update build:tokens workflow**
   - Modify token build script to include custom palettes
   - Ensure proper merge of default + custom tokens
   - Update theme generation to use custom palettes

2. **Update component recipes**
   - Ensure recipes support custom palette names
   - Test with all existing components
   - Add examples using custom palettes

3. **Update documentation site**
   - Add theme configuration page
   - Create interactive color palette examples
   - Show custom palette usage in components

4. **Create migration utilities**
   - Tool to scan codebase for color usage
   - Helper to map old colors to new custom palettes
   - Migration guide document

5. **Deliverables**
   - ✅ Integrated build workflow
   - ✅ All components support custom palettes
   - ✅ Updated documentation site
   - ✅ Migration tooling

### Phase 4: Polish & Release (Week 4)

**Goal**: Final testing, documentation, and release preparation.

#### Tasks

1. **Comprehensive testing**
   - Integration tests for full workflow
   - Test with multiple consumer scenarios
   - Accessibility audit of generated palettes
   - Performance benchmarking

2. **Complete documentation**
   - API reference for all configuration options
   - Step-by-step tutorials
   - Real-world examples
   - Troubleshooting guide
   - Video walkthrough (optional)

3. **Developer experience improvements**
   - Better error messages
   - Config file templates
   - VS Code extension for config validation (optional)
   - Online theme preview tool (future)

4. **Release preparation**
   - Write changelog
   - Create migration guide
   - Prepare release notes
   - Update main Nimbus README

5. **Deliverables**
   - ✅ Complete test coverage
   - ✅ Comprehensive documentation
   - ✅ Release notes and migration guide
   - ✅ Published packages

---

### Phase 5: Runtime Generation & Theme Switcher (Week 5-6)

**Goal**: Enable runtime theme generation and provide a theme switcher component for easy theme management.

#### Tasks

1. **Make generation engine isomorphic**
   - Refactor color generation to work in browser
   - Remove Node.js-specific dependencies from core
   - Add browser-compatible polyfills where needed
   - Tree-shakable exports for optimal bundle size

2. **Build runtime theme utilities**
   - `generateThemeClient()` - Client-side generation
   - `applyThemeRuntime()` - Apply themes dynamically
   - `loadThemeFromService()` - Fetch from API
   - CSS custom property management
   - System prop update support in NimbusProvider

3. **Create ThemeSwitcher component**
   - Dropdown/menu for theme selection
   - Color palette preview swatches
   - Support for static and dynamic themes
   - Current theme indicator
   - Custom theme generation interface
   - Keyboard navigation support
   - Accessible labels and announcements

4. **Add theme management utilities**
   - Theme registry for available themes
   - Local storage persistence
   - Theme validation helpers
   - Error boundary for theme loading failures

5. **Update NimbusProvider**
   - Accept `system` prop for custom systems
   - Support dynamic system updates
   - Proper re-rendering on theme change
   - Export `createNimbusSystem` helper

6. **Documentation and examples**
   - Client-side generation guide
   - Service integration examples (Next.js, Express)
   - ThemeSwitcher component documentation
   - Multi-tenant theming patterns
   - Performance optimization guide

7. **Testing**
   - Browser compatibility testing
   - Theme switcher interaction tests
   - Performance benchmarks for runtime generation
   - Bundle size validation

8. **Deliverables**
   - ✅ Isomorphic generation engine
   - ✅ Runtime theme utilities
   - ✅ ThemeSwitcher component
   - ✅ Updated NimbusProvider with system prop
   - ✅ Comprehensive runtime documentation
   - ✅ Example implementations

---

## File Structure

### New Package Structure

```
packages/
├── nimbus-theme-generator/       # NEW: Core generation logic
│   ├── src/
│   │   ├── generator/
│   │   │   ├── color-scale.ts          # Generate 12-step scales
│   │   │   ├── contrast.ts             # Generate contrast colors
│   │   │   ├── presets.ts              # Load Radix presets
│   │   │   └── algorithms/
│   │   │       ├── radix.ts            # Radix algorithm
│   │   │       ├── hsl.ts              # HSL-based generation
│   │   │       └── oklch.ts            # OKLCH-based generation
│   │   ├── validator/
│   │   │   ├── contrast-checker.ts     # WCAG contrast validation
│   │   │   ├── color-similarity.ts     # Detect similar colors
│   │   │   └── config-validator.ts     # Validate config schema
│   │   ├── output/
│   │   │   ├── token-generator.ts      # Generate token files
│   │   │   ├── type-generator.ts       # Generate TypeScript types
│   │   │   └── css-generator.ts        # Generate CSS custom properties
│   │   ├── schema.ts                    # Zod configuration schema
│   │   ├── types.ts                     # TypeScript types
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── nimbus-theme-cli/              # NEW: CLI tool
│   ├── src/
│   │   ├── commands/
│   │   │   ├── generate.ts             # generate-theme command
│   │   │   ├── validate.ts             # validate-theme command
│   │   │   ├── preview.ts              # preview-theme command
│   │   │   └── document.ts             # document-theme command
│   │   ├── utils/
│   │   │   ├── config-loader.ts        # Load config file
│   │   │   ├── file-writer.ts          # Write generated files
│   │   │   └── logger.ts               # Colored CLI output
│   │   ├── cli.ts                       # Main CLI entry
│   │   └── index.ts
│   ├── bin/
│   │   └── nimbus-theme              # Executable
│   ├── package.json
│   └── tsconfig.json
│
└── nimbus/                         # UPDATED: Core package
    ├── src/
    │   ├── theme/
    │   │   ├── config/                  # UPDATED: Include custom palettes
    │   │   ├── helpers/
    │   │   │   └── define-theme-config.ts  # NEW: Config helper
    │   │   └── index.ts
    │   └── index.ts                     # Export theme utilities
    └── package.json
```

### Consumer Project Structure (After Generation)

```
consumer-app/
├── nimbus.theme.config.ts          # Theme configuration
├── src/
│   └── theme/
│       └── custom/                  # Generated files (git-committed)
│           ├── custom-palettes.tokens.ts
│           ├── custom-palettes.types.ts
│           ├── semantic-colors.config.ts
│           └── custom-palettes.css  # Optional CSS vars
└── package.json
```

---

## Integration Points

### 1. Configuration Loading

```typescript
// packages/nimbus-theme-cli/src/utils/config-loader.ts
import { build } from 'esbuild';
import { validate } from '../schema';

export async function loadConfig(configPath: string) {
  // Use esbuild to load TypeScript config
  const result = await build({
    entryPoints: [configPath],
    bundle: true,
    platform: 'node',
    write: false,
  });

  // Load and validate
  const config = result.outputFiles[0].text;
  const validated = validate(config);

  return validated;
}
```

### 2. Token System Integration

```typescript
// packages/nimbus/src/theme/index.ts (UPDATED)
import { defaultTokens } from './tokens';
import { customPalettes } from './custom/custom-palettes.tokens'; // Generated

export const tokens = {
  ...defaultTokens,
  colors: {
    ...defaultTokens.colors,
    ...customPalettes.colors, // Merge custom palettes
  }
};
```

### 3. Chakra UI Theme Integration

```typescript
// Consumer app theme setup
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { customPalettes } from './theme/custom/custom-palettes.tokens';

const system = defaultSystem.extend({
  semanticTokens: {
    colors: customPalettes.colors,
  }
});

function App() {
  return (
    <ChakraProvider value={system}>
      {/* App content */}
    </ChakraProvider>
  );
}
```

### 4. Component Recipe Integration

No changes needed to existing recipes - they already support dynamic palette names:

```typescript
// Existing button recipe already works with custom palettes
export const buttonRecipe = defineRecipe({
  variants: {
    colorPalette: {
      // Works with any palette name, including custom ones
      solid: {
        backgroundColor: 'colorPalette.9',
        color: 'colorPalette.contrast',
      }
    }
  }
});

// Usage with custom palette
<Button colorPalette="brandPrimary" variant="solid">
  Click me
</Button>
```

---

## Testing Strategy

### Unit Tests

```typescript
// packages/nimbus-theme-generator/src/generator/color-scale.spec.ts
describe('generateColorScale', () => {
  it('generates 12 steps from base color', () => {
    const result = generateColorScale('#FF5733');

    expect(result).toHaveProperty('light');
    expect(result).toHaveProperty('dark');
    expect(Object.keys(result.light)).toHaveLength(13); // 12 steps + contrast
  });

  it('maintains proper lightness progression', () => {
    const result = generateColorScale('#FF5733');
    const lightnesses = Object.values(result.light)
      .map(color => getLightness(color));

    // Each step should be darker than the previous
    for (let i = 1; i < lightnesses.length - 1; i++) {
      expect(lightnesses[i]).toBeLessThan(lightnesses[i - 1]);
    }
  });

  it('ensures step 9 matches base color', () => {
    const baseColor = '#FF5733';
    const result = generateColorScale(baseColor);

    expect(result.light['9']).toBe(baseColor);
  });
});

// packages/nimbus-theme-generator/src/validator/contrast-checker.spec.ts
describe('checkContrast', () => {
  it('passes for WCAG AA compliant colors', () => {
    const result = checkContrast('#000000', '#FFFFFF');

    expect(result.ratio).toBeGreaterThan(4.5);
    expect(result.passes.AA).toBe(true);
  });

  it('fails for low contrast colors', () => {
    const result = checkContrast('#AAAAAA', '#BBBBBB');

    expect(result.passes.AA).toBe(false);
  });
});
```

### Integration Tests

```typescript
// packages/nimbus-theme-cli/src/commands/generate.spec.ts
describe('generate-theme command', () => {
  it('generates valid token files from config', async () => {
    const config = {
      palettes: {
        brandPrimary: {
          type: 'generated',
          baseColor: '#FF5733',
        }
      }
    };

    await generateTheme(config, { output: tempDir });

    // Check generated files exist
    expect(fs.existsSync(`${tempDir}/custom-palettes.tokens.ts`)).toBe(true);
    expect(fs.existsSync(`${tempDir}/custom-palettes.types.ts`)).toBe(true);

    // Verify token structure
    const tokens = await import(`${tempDir}/custom-palettes.tokens.ts`);
    expect(tokens.customPalettes.colors).toHaveProperty('brandPrimary.1');
    expect(tokens.customPalettes.colors).toHaveProperty('brandPrimary.9');
  });

  it('validates contrast ratios', async () => {
    const config = {
      palettes: {
        badContrast: {
          type: 'manual',
          light: {
            '9': '#AAAAAA',
            contrast: '#BBBBBB', // Poor contrast
          }
        }
      },
      validation: {
        enforceContrast: true,
      }
    };

    await expect(generateTheme(config)).rejects.toThrow(/contrast ratio/i);
  });
});
```

### End-to-End Tests

```typescript
// e2e/theme-generation.spec.ts
describe('Theme Generation E2E', () => {
  it('generates theme and components render correctly', async () => {
    // 1. Create config file
    fs.writeFileSync('nimbus.theme.config.ts', `
      export default {
        palettes: {
          testBrand: { baseColor: '#FF5733' }
        }
      }
    `);

    // 2. Run generation
    await exec('pnpm nimbus generate-theme');

    // 3. Build tokens
    await exec('pnpm build:tokens');

    // 4. Render component with custom palette
    render(
      <Button colorPalette="testBrand" variant="solid">
        Test Button
      </Button>
    );

    // 5. Verify styles applied
    const button = screen.getByRole('button');
    const styles = window.getComputedStyle(button);
    expect(styles.backgroundColor).toMatch(/rgb\(255, 87, 51\)/);
  });
});
```

### Accessibility Testing

```typescript
// packages/nimbus-theme-generator/src/validator/accessibility.spec.ts
describe('Accessibility Validation', () => {
  it('ensures all generated scales meet WCAG AA', () => {
    const palette = generateColorScale('#FF5733');

    // Check contrast between each step and contrast color
    for (let i = 1; i <= 12; i++) {
      const stepColor = palette.light[i];
      const contrastColor = palette.light.contrast;
      const ratio = getContrastRatio(stepColor, contrastColor);

      // Steps 9-12 used for colored backgrounds, need good contrast
      if (i >= 9) {
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
```

---

## Documentation Requirements

### 1. Configuration Reference

**File**: `docs/theming/configuration.md`

**Content**:
- Complete config schema documentation
- All available options with examples
- Type definitions with explanations
- Default values and behavior
- Validation rules

### 2. Getting Started Guide

**File**: `docs/theming/getting-started.md`

**Content**:
- Quick start example
- Installation steps
- First custom palette creation
- Integration with existing project
- Common pitfalls and solutions

### 3. Color Generation Guide

**File**: `docs/theming/color-generation.md`

**Content**:
- Understanding Radix color scales
- How the generation algorithm works
- Choosing base colors effectively
- Fine-tuning generated scales
- When to use manual scales vs generated

### 4. CLI Reference

**File**: `docs/theming/cli-reference.md`

**Content**:
- All available commands
- Command options and flags
- Usage examples
- Troubleshooting command errors

### 5. Migration Guide

**File**: `docs/theming/migration.md`

**Content**:
- Migrating from hardcoded colors
- Converting existing brand colors
- Updating component usage
- Breaking changes (if any)
- Before/after code examples

### 6. API Documentation

**File**: `docs/theming/api.md`

**Content**:
- `defineThemeConfig` API
- Color generation functions
- Validation utilities
- Type definitions
- Advanced usage patterns

### 7. Examples

**Directory**: `docs/theming/examples/`

**Examples**:
- Basic single color palette
- Multiple brand colors
- Extending Radix presets
- Manual palette definition
- Semantic color mapping
- Monorepo setup
- Migration from v1

### 8. Storybook Integration

**File**: `apps/docs/stories/theming/CustomPalettes.stories.tsx`

**Stories**:
- Generated palette showcase
- Color scale visualization
- Contrast checker
- Component examples with custom palettes
- Interactive palette builder (future)

---

## Migration Path

### For Existing Nimbus Consumers

#### Step 1: Install New Packages

```bash
pnpm add @commercetools/nimbus-theme-cli@latest
pnpm add -D @commercetools/nimbus-theme-generator@latest
```

#### Step 2: Create Configuration File

```typescript
// nimbus.theme.config.ts
import { defineThemeConfig } from '@commercetools/nimbus/theme';

export default defineThemeConfig({
  palettes: {
    // Map existing brand colors to custom palettes
    brandPrimary: {
      type: 'generated',
      baseColor: '#YOUR_BRAND_COLOR',
    }
  },
  semantic: {
    primary: 'brandPrimary',
    // Keep other semantics as default
  }
});
```

#### Step 3: Generate Theme

```bash
pnpm nimbus generate-theme
```

#### Step 4: Update Theme Setup

```typescript
// Before
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

// After
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { customPalettes } from './theme/custom/custom-palettes.tokens';

const system = defaultSystem.extend({
  semanticTokens: {
    colors: customPalettes.colors,
  }
});
```

#### Step 5: Update Component Usage (Optional)

```typescript
// Before: Using default palette
<Button colorPalette="primary" variant="solid">
  Click me
</Button>

// After: Using custom palette directly
<Button colorPalette="brandPrimary" variant="solid">
  Click me
</Button>

// Or: Keep using semantic mapping
<Button colorPalette="primary" variant="solid">
  Click me
</Button>
```

### Breaking Changes

**None anticipated** - This is an additive feature. Existing code continues to work without changes.

### Deprecations

**None** - No existing APIs are being deprecated.

---

## Future Enhancements

### Phase 2 Features (Post-Launch)

1. **Runtime Theme Generation**
   - Browser-based color scale generation
   - Dynamic theme switching without rebuilds
   - API: `generatePalette()` and `applyTheme()`

2. **Interactive Theme Builder**
   - Web-based UI for creating themes
   - Live preview of components
   - Export configuration file
   - Share themes via URL

3. **Advanced Color Algorithms**
   - OKLCH-based generation (better perceptual uniformity)
   - Cubehelix algorithm option
   - Custom interpolation spaces
   - AI-assisted palette generation

4. **Theme Marketplace**
   - Share and discover custom themes
   - Community-contributed palettes
   - Import themes by URL or package
   - Rate and review themes

5. **Enhanced Validation**
   - Colorblindness simulation
   - Accessibility scoring
   - Brand consistency checker
   - Automatic contrast fixing

6. **Design Tool Integration**
   - Figma plugin to export palettes
   - Sketch plugin support
   - Adobe XD integration
   - Import from design tokens

7. **Advanced Semantic Mappings**
   - Context-aware semantic colors
   - Component-specific color overrides
   - Gradient support
   - Pattern/texture support

### VS Code Extension

- Autocomplete for palette names
- Inline color preview
- Config validation
- Quick actions (generate, validate)
- Color picker integration

### Monitoring & Analytics

- Usage tracking for custom palettes
- Performance metrics
- Error reporting
- Community feedback collection

---

## Success Metrics

### Technical Metrics

- ✅ Build time increase < 5 seconds
- ✅ Zero runtime performance impact
- ✅ 100% type safety for custom palettes
- ✅ All generated scales pass WCAG AA contrast
- ✅ < 5% increase in bundle size

### Adoption Metrics

- Target: 25% of Nimbus consumers use custom palettes within 3 months
- Target: 50% adoption within 6 months
- Measure: Number of custom palette configs in production

### Developer Experience Metrics

- Time to first custom palette: < 15 minutes
- Config file creation: < 5 minutes
- Documentation satisfaction: > 4/5 rating
- Support ticket volume: < 10/month

### Quality Metrics

- Zero critical bugs in first month
- Accessibility compliance: 100%
- Test coverage: > 90%
- Documentation completeness: 100%

---

## Risks and Mitigations

### Risk 1: Color Generation Algorithm Quality

**Risk**: Generated scales don't match Radix quality or accessibility standards.

**Mitigation**:
- Use Radix algorithms as reference implementation
- Extensive testing against Radix scales
- Automated accessibility validation
- Manual review of common color inputs
- Provide escape hatch (manual scale definition)

### Risk 2: Breaking Changes to Existing Tokens

**Risk**: Integration breaks existing component styling.

**Mitigation**:
- Additive changes only, no modifications to existing tokens
- Comprehensive integration testing
- Beta period with early adopters
- Clear migration guide
- Rollback plan

### Risk 3: Complex Configuration

**Risk**: Configuration schema too complex for users.

**Mitigation**:
- Start with simple, common use cases
- Provide templates and examples
- Progressive disclosure of advanced options
- Interactive documentation
- CLI wizard for guided setup

### Risk 4: Performance Degradation

**Risk**: Token generation slows down build times significantly.

**Mitigation**:
- Optimize generation algorithm
- Cache generated scales
- Parallel processing where possible
- Benchmark against baseline
- Only regenerate on config change

### Risk 5: Type Generation Issues

**Risk**: Generated types cause TypeScript errors or IDE issues.

**Mitigation**:
- Test with various TypeScript versions
- Follow Chakra UI type patterns exactly
- Validate generated types in CI
- Provide manual type definitions fallback
- Clear error messages for type issues

---

## Open Questions

### Question 1: Default Algorithm Choice

**Q**: Should we default to HSL-based or OKLCH-based color generation?

**Options**:
- HSL: More widely understood, simpler
- OKLCH: Better perceptual uniformity, future-proof

**Recommendation**: Start with HSL (simpler, proven), add OKLCH as opt-in.

### Question 2: Configuration File Location

**Q**: Where should `nimbus.theme.config.ts` live in consumer projects?

**Options**:
- Project root (simple, discoverable)
- `src/theme/` (organized, but deeper)
- Configurable (flexible, but inconsistent)

**Recommendation**: Project root by default, allow override via CLI flag.

### Question 3: Git Commit Generated Files?

**Q**: Should generated token files be committed to git?

**Pros (commit)**:
- Easier code review
- Visible changes
- No build step needed for consumers of the consumer

**Cons (don't commit)**:
- Generated files in git
- Potential for manual edits
- Merge conflicts

**Recommendation**: **Commit generated files** - They're part of the source of truth for the consumer's theme. Add clear comments indicating they're generated.

### Question 4: CSS Custom Properties

**Q**: Should we also generate CSS custom properties for direct stylesheet usage?

**Recommendation**: Yes, but optional. Some consumers may want to use tokens in raw CSS.

### Question 5: Versioning Strategy

**Q**: How to version custom themes relative to Nimbus versions?

**Recommendation**: Custom themes are decoupled from Nimbus version. Config schema has its own version that evolves separately.

---

## Appendices

### Appendix A: Color Generation Algorithm Details

**Radix-Compatible Scale Generation**:

1. Start with base color (user input)
2. Convert to OKLCH color space
3. Generate 12 steps with varying lightness:
   - Steps 1-2: Very light (backgrounds)
   - Steps 3-5: Light (subtle)
   - Steps 6-8: Medium (borders, secondary)
   - Steps 9: Base color (primary action)
   - Steps 10-11: Darker (hover states)
   - Step 12: Very dark (high contrast text)
4. Generate contrast color (for text on colored backgrounds)
5. Validate contrast ratios
6. Output in hex format

**Lightness Distribution** (approximate):
```
Step  | Lightness (L in OKLCH)
------|----------------------
1     | 99%
2     | 97%
3     | 94%
4     | 91%
5     | 87%
6     | 82%
7     | 75%
8     | 65%
9     | 50% (base)
10    | 45%
11    | 40%
12    | 20%
```

### Appendix B: Example Configurations

**Minimal Configuration**:
```typescript
export default {
  palettes: {
    brand: { baseColor: '#FF5733' }
  }
};
```

**Production Configuration**:
```typescript
export default {
  palettes: {
    brandPrimary: {
      type: 'generated',
      baseColor: '#0066CC',
      algorithm: 'oklch',
    },
    brandSecondary: {
      type: 'generated',
      baseColor: '#FF5733',
    },
    brandNeutral: {
      type: 'preset',
      preset: 'slate',
    },
  },
  semantic: {
    primary: 'brandPrimary',
    secondary: 'brandSecondary',
    neutral: 'brandNeutral',
  },
  validation: {
    enforceContrast: true,
    minContrast: 4.5,
  },
  output: {
    path: './src/theme/custom',
    includeCss: true,
  }
};
```

### Appendix C: Comparison with Other Solutions

| Feature | Nimbus Theming | Tailwind | Panda CSS | Theme UI |
|---------|---------------|----------|-----------|----------|
| Build-time generation | ✅ | ✅ | ✅ | ❌ |
| Runtime generation | 🔄 Future | ❌ | ❌ | ✅ |
| Type safety | ✅ | ⚠️ Partial | ✅ | ⚠️ Partial |
| Radix colors | ✅ | ❌ | ❌ | ❌ |
| Accessibility validation | ✅ | ❌ | ❌ | ❌ |
| Design system focus | ✅ | ❌ | ✅ | ⚠️ |

### Appendix D: Resources

**Color Theory & Accessibility**:
- [Radix Colors Documentation](https://www.radix-ui.com/colors)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [OKLCH Color Space](https://oklch.com/)

**Technical References**:
- [Chakra UI Tokens](https://chakra-ui.com/docs/theming/tokens)
- [Culori Color Library](https://culorijs.org/)
- [Zod Validation](https://zod.dev/)

**Similar Implementations**:
- [Tailwind Color Palette Generator](https://uicolors.app/)
- [Panda CSS Theme Configuration](https://panda-css.com/docs/theming/overview)
- [Material UI Theme Creator](https://material-ui.com/customization/color/)

---

## Approval & Sign-off

### Stakeholders

- [ ] Design System Lead
- [ ] Frontend Architecture Team
- [ ] Product Team
- [ ] Documentation Team

### Review Checklist

- [ ] Technical approach validated
- [ ] API design reviewed
- [ ] Resource allocation confirmed
- [ ] Timeline approved
- [ ] Success metrics agreed
- [ ] Risk mitigation strategies accepted

### Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-01-XX | 1.0 | Claude | Initial draft |

---

**Document Status**: Draft
**Last Updated**: 2025-01-XX
**Next Review**: After Phase 1 completion
