# Nimbus SSR Support Implementation Plan

## Executive Summary

**Goal**: Implement production-ready Server-Side Rendering (SSR) support for the
Nimbus design system using Traditional Vite SSR + Vitest SSR Testing.

**Timeline**: 6 weeks **Risk Level**: Medium **Approach**:
Incremental phases with backward compatibility

**Key Success Metrics**:

- ✅ Zero hydration mismatches in Next.js test app
- ✅ All components render correctly on server
- ✅ Color mode works without FOUC (flash of unstyled content)
- ✅ Component tree-shaking preserved
- ✅ Backward compatible (CSR-only apps continue working)

---

## Current State Analysis

### What Works (80% SSR-Ready)

- ✅ CSS variable-based theming (inherently SSR-friendly)
- ✅ Chakra UI v3 core architecture
- ✅ Component structure and patterns
- ✅ JSDOM polyfills exported for consumers
- ✅ Build configuration foundation

### Critical Issues (Must Fix)

| Priority     | Issue                             | Location                 | Impact                       |
| ------------ | --------------------------------- | ------------------------ | ---------------------------- |
| **CRITICAL** | Navigator.language crashes server | `nimbus-provider.tsx:25` | Complete SSR failure         |
| **CRITICAL** | Missing SSRProvider               | NimbusProvider           | React Aria ID mismatch       |
| **HIGH**     | No ColorModeScript                | Color mode setup         | Theme flash before hydration |
| **MEDIUM**   | No SSR testing                    | Testing infrastructure   | Can't validate SSR behavior  |
| **MEDIUM**   | No SSR documentation              | N/A                      | Users don't know setup       |

### Architecture Notes

- **Monorepo**: pnpm workspaces, packages/ and apps/ structure
- **Build**: Vite library mode, component-level chunks, ESM/CJS outputs
- **Testing**: Vitest with 2 projects (Storybook browser + Unit JSDOM)
- **Styling**: Chakra UI v3 with CSS variables (not runtime Emotion extraction
  needed)
- **Components**: ~300 components, mostly SSR-ready, need audit

---

## Implementation Phases

## Phase 1: Foundation & Provider Fixes (Week 1)

**Goal**: Make NimbusProvider SSR-ready and establish testing infrastructure

### Architecture Decision: Consolidated i18n Provider

**Key Change**: Consolidate all i18n concerns (SSRProvider, IntlProvider, React
Aria I18nProvider) into `NimbusI18nProvider` for cleaner architecture and better
encapsulation.

### Critical Changes

#### 1. Update NimbusI18nProvider (Consolidated i18n + SSR)

**File**:
`packages/nimbus/src/components/nimbus-i18n-provider/nimbus-i18n-provider.tsx`

**Current Problem**: i18n split across multiple providers, navigator.language
causes SSR crash

**Solution**: Consolidate all i18n layers into single provider

```typescript
import { SSRProvider } from "react-aria";
import { I18nProvider as RaI18nProvider } from "react-aria";
import { IntlProvider } from "react-intl";
import type { NimbusI18nProviderProps } from "./nimbus-i18n-provider.types";

/**
 * SSR-safe locale detection utility
 */
const getDefaultLocale = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language;
};

/**
 * Consolidated i18n provider with SSR support.
 * Wraps three critical layers:
 * - SSRProvider: React Aria SSR ID generation
 * - IntlProvider: react-intl message formatting
 * - I18nProvider: React Aria date/number formatting
 */
export const NimbusI18nProvider = ({
  locale,
  children,
}: NimbusI18nProviderProps) => {
  const effectiveLocale = locale ?? getDefaultLocale();

  return (
    <SSRProvider>
      <IntlProvider locale={effectiveLocale} defaultLocale="en">
        <RaI18nProvider locale={locale}>
          {children}
        </RaI18nProvider>
      </IntlProvider>
    </SSRProvider>
  );
};

NimbusI18nProvider.displayName = "NimbusI18nProvider";
```

#### 2. Simplify NimbusProvider

**File**: `packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx`

**Solution**: Remove IntlProvider nesting (now handled by NimbusI18nProvider)

```typescript
import { ChakraProvider } from "@chakra-ui/react/styled-system";
import { RouterProvider } from "react-aria";
import { NimbusI18nProvider } from "@/components/nimbus-i18n-provider";
import { system } from "@/theme";
import type { NimbusProviderProps } from "./nimbus-provider.types";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

export function NimbusProvider({
  children,
  locale,
  router,
  ...colorModeProps
}: NimbusProviderProps) {
  const content = (
    <ChakraProvider value={system}>
      <NimbusColorModeProvider enableSystem={false} {...colorModeProps}>
        <NimbusI18nProvider locale={locale}>
          {children}
        </NimbusI18nProvider>
      </NimbusColorModeProvider>
    </ChakraProvider>
  );

  if (router) {
    return <RouterProvider {...router}>{content}</RouterProvider>;
  }

  return content;
}
```

**Provider Hierarchy (Simplified)**:

```
NimbusProvider
└── ChakraProvider (theme system)
    └── NimbusColorModeProvider (dark/light mode)
        └── NimbusI18nProvider (consolidated i18n + SSR)
            ├── SSRProvider (React Aria SSR)
            ├── IntlProvider (react-intl)
            └── I18nProvider (React Aria i18n)
```

**Benefits**:

- ✅ Single responsibility - all i18n in one place
- ✅ SSR-safe by default - navigator.language handled once
- ✅ Cleaner nesting - fewer provider layers
- ✅ Better encapsulation - i18n details hidden
- ✅ Easier testing - test i18n independently

#### 3. Create ColorModeScript Component

**New File**:
`packages/nimbus/src/components/nimbus-provider/components/color-mode-script.tsx`

```typescript
export type ColorModeScriptProps = {
  defaultMode?: 'light' | 'dark' | 'system';
  storageKey?: string;
};

export function ColorModeScript({
  defaultMode = 'system',
  storageKey = 'nimbus-color-mode',
}: ColorModeScriptProps = {}) {
  const scriptContent = `
(function() {
  try {
    var storageKey = '${storageKey}';
    var defaultMode = '${defaultMode}';
    var stored = localStorage.getItem(storageKey);
    var mode = stored || defaultMode;

    if (mode === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);
  } catch (e) {}
})();
`.trim();

  return (
    <script
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      suppressHydrationWarning
    />
  );
}
```

**Usage Example** (Next.js):

```typescript
// app/layout.tsx
import { ColorModeScript, NimbusProvider } from '@commercetools/nimbus';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ColorModeScript />
      </head>
      <body>
        <NimbusProvider locale="en-US">{children}</NimbusProvider>
      </body>
    </html>
  );
}
```

#### 4. Add SSR Testing Infrastructure

**New File**: `packages/nimbus/vitest.ssr.config.ts`

```typescript
import { defineConfig, mergeConfig } from "vitest/config";
import createBaseConfig from "./vite.config";

export default defineConfig(async () => {
  const baseConfig = await createBaseConfig({
    command: "build",
    mode: "production",
  });

  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        name: "ssr",
        environment: "node",
        include: ["src/**/*.ssr.spec.{ts,tsx}"],
        exclude: ["src/**/*.stories.{ts,tsx}", "node_modules", "dist"],
        globals: true,
        setupFiles: ["./src/test/ssr-test-setup.ts"],
      },
    })
  );
});
```

**New File**: `packages/nimbus/src/test/ssr-test-setup.ts`

```typescript
import "./setup-jsdom-polyfills";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// Mark tests as SSR environment
global.IS_SSR_TEST = true;
```

**Update Root Config**: `vitest.config.ts`

```typescript
export default defineConfig({
  test: {
    projects: [
      "./vitest.storybook.config.ts",
      "./vitest.unit.config.ts",
      "./vitest.ssr.config.ts", // ADD THIS
    ],
  },
});
```

#### 5. Create Initial SSR Tests

**New File**:
`packages/nimbus/src/components/nimbus-i18n-provider/nimbus-i18n-provider.ssr.spec.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { NimbusI18nProvider } from './nimbus-i18n-provider';

describe('NimbusI18nProvider SSR', () => {
  it('renders without errors on server', () => {
    expect(() => {
      renderToString(
        <NimbusI18nProvider>
          <div>Test content</div>
        </NimbusI18nProvider>
      );
    }).not.toThrow();
  });

  it('uses default locale when none provided (server)', () => {
    const navigatorSpy = vi.spyOn(global, 'navigator', 'get');
    navigatorSpy.mockReturnValue(undefined as any);

    const html = renderToString(
      <NimbusI18nProvider>
        <div>Test</div>
      </NimbusI18nProvider>
    );

    expect(html).toContain('Test');
    navigatorSpy.mockRestore();
  });

  it('accepts explicit locale prop', () => {
    const html = renderToString(
      <NimbusI18nProvider locale="fr-FR">
        <div>Contenu</div>
      </NimbusI18nProvider>
    );

    expect(html).toContain('Contenu');
  });
});
```

**New File**:
`packages/nimbus/src/components/nimbus-provider/nimbus-provider.ssr.spec.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { NimbusProvider } from './nimbus-provider';

describe('NimbusProvider SSR', () => {
  it('renders without navigator.language crash', () => {
    expect(() => {
      renderToString(
        <NimbusProvider>
          <div>App content</div>
        </NimbusProvider>
      );
    }).not.toThrow();
  });

  it('renders with explicit locale', () => {
    const html = renderToString(
      <NimbusProvider locale="es-ES">
        <div>Contenido</div>
      </NimbusProvider>
    );

    expect(html).toContain('Contenido');
  });

  it('handles router prop without errors', () => {
    const mockRouter = {
      navigate: () => {},
      useHref: (href: string) => href,
    };

    expect(() => {
      renderToString(
        <NimbusProvider router={mockRouter}>
          <div>Routed content</div>
        </NimbusProvider>
      );
    }).not.toThrow();
  });
});
```

### Files to Modify/Create

- ✏️
  `packages/nimbus/src/components/nimbus-i18n-provider/nimbus-i18n-provider.tsx` -
  **Consolidate i18n + SSR**
- ✏️ `packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx` -
  **Simplify (remove IntlProvider)**
- ➕
  `packages/nimbus/src/components/nimbus-provider/components/color-mode-script.tsx` -
  NEW
- ➕ `packages/nimbus/vitest.ssr.config.ts` - NEW
- ➕ `packages/nimbus/src/test/ssr-test-setup.ts` - NEW
- ✏️ `vitest.config.ts` - Add SSR project
- ➕
  `packages/nimbus/src/components/nimbus-i18n-provider/nimbus-i18n-provider.ssr.spec.tsx` -
  NEW
- ➕
  `packages/nimbus/src/components/nimbus-provider/nimbus-provider.ssr.spec.tsx` -
  NEW

### Success Criteria

- [ ] NimbusI18nProvider consolidates SSRProvider, IntlProvider, and React Aria
      I18nProvider
- [ ] NimbusProvider simplified (no IntlProvider nesting)
- [ ] Both providers render on server without errors
- [ ] ColorModeScript component created and documented
- [ ] SSR test infrastructure configured
- [ ] All Phase 1 tests pass (pnpm test --project ssr)
- [ ] No console warnings or errors
- [ ] Backward compatible - no breaking changes to public API

---

## Phase 2: Component Audit & Browser API Fixes (Week 2)

**Goal**: Identify and fix all browser API usage in components

### Tasks

#### 1. Create Browser API Audit Script

**New File**: `packages/nimbus/scripts/audit-browser-apis.js`

```javascript
#!/usr/bin/env node
import { glob } from "glob";
import fs from "fs/promises";

const BROWSER_APIS = [
  "window.",
  "document.",
  "navigator.",
  "localStorage.",
  "sessionStorage.",
  "location.",
];

async function auditFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const issues = [];

  lines.forEach((line, index) => {
    BROWSER_APIS.forEach((api) => {
      if (
        line.includes(api) &&
        !line.includes("typeof") &&
        !line.trim().startsWith("//")
      ) {
        issues.push({
          file: filePath,
          line: index + 1,
          api,
          content: line.trim(),
        });
      }
    });
  });

  return issues;
}

async function main() {
  const files = await glob("packages/nimbus/src/components/**/*.{ts,tsx}", {
    ignore: ["**/*.spec.*", "**/*.stories.*"],
  });

  console.log(`🔍 Auditing ${files.length} component files...\n`);

  const allIssues = [];
  for (const file of files) {
    const issues = await auditFile(file);
    allIssues.push(...issues);
  }

  if (allIssues.length === 0) {
    console.log("✅ No unguarded browser API usage found!");
    return;
  }

  console.log(`⚠️  Found ${allIssues.length} potential SSR issues:\n`);

  const byFile = {};
  allIssues.forEach((issue) => {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  });

  Object.entries(byFile).forEach(([file, issues]) => {
    console.log(`📄 ${file}`);
    issues.forEach((issue) => {
      console.log(`   Line ${issue.line}: ${issue.content}`);
    });
    console.log("");
  });

  process.exit(1);
}

main();
```

Add to `package.json`:

```json
{
  "scripts": {
    "audit:ssr": "node packages/nimbus/scripts/audit-browser-apis.js"
  }
}
```

#### 2. Create SSR-Safe Utility Hooks

**New File**: `packages/nimbus/src/hooks/use-is-client/use-is-client.ts`

````typescript
import { useEffect, useState } from "react";

/**
 * Returns true after component mounts (client-side only).
 *
 * Use this to conditionally render client-only content that would
 * cause hydration mismatches if rendered on the server.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isClient = useIsClient();
 *
 *   return (
 *     <div>
 *       {isClient ? <ClientOnlyContent /> : <ServerFallback />}
 *     </div>
 *   );
 * };
 * ```
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
````

**New File**:
`packages/nimbus/src/hooks/use-safe-layout-effect/use-safe-layout-effect.ts`

````typescript
import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect that doesn't warn during SSR.
 * Falls back to useEffect on the server.
 *
 * @example
 * ```tsx
 * useSafeLayoutEffect(() => {
 *   // Runs synchronously after DOM mutations on client
 *   // Runs as regular effect on server
 * }, [deps]);
 * ```
 */
export const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
````

**New File**: `packages/nimbus/src/hooks/use-is-client/use-is-client.spec.ts`

```typescript
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsClient } from "./use-is-client";

describe("useIsClient", () => {
  it("returns false on initial render", () => {
    const { result } = renderHook(() => useIsClient());
    expect(result.current).toBe(false);
  });

  it("returns true after mount", async () => {
    const { result } = renderHook(() => useIsClient());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current).toBe(true);
  });
});
```

#### 3. Export Hooks from Main Index

**Update File**: `packages/nimbus/src/hooks/index.ts`

```typescript
export { useIsClient } from "./use-is-client/use-is-client";
export { useSafeLayoutEffect } from "./use-safe-layout-effect/use-safe-layout-effect";
// ... other hooks
```

#### 4. Fix FormField and Card Layout Components (CRITICAL)

**Problem**: `FormField` and `Card` components currently use `useEffect` that
returns `null` for layout calculations. This causes SSR hydration mismatches
because:

- Server renders: `null` (useEffect doesn't run on server)
- Client hydrates: Actual content (useEffect runs and updates state)
- Result: **Hydration mismatch error**

**Solution**: Replace imperative layout (useEffect + state) with declarative CSS
Grid layout.

##### FormField Component Update

**Current Pattern** (causes SSR issues):

```typescript
// ❌ BEFORE - useEffect returns null on server
const FormField = ({ children }) => {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    // Calculate layout based on children
    setLayout(/* calculated layout */);
  }, [children]);

  if (!layout) return null; // Server renders null, client renders content

  return <div>{/* render with layout */}</div>;
};
```

**SSR-Safe Pattern** (using CSS Grid):

```typescript
// ✅ AFTER - CSS Grid handles layout declaratively
const FormField = ({ children }) => {
  return (
    <FormFieldSlot
      display="grid"
      gridTemplateColumns="auto 1fr"
      gap="200"
      alignItems="start"
    >
      {children}
    </FormFieldSlot>
  );
};
```

**Files to Update**:

- `packages/nimbus/src/components/form-field/components/form-field.input.tsx`
- `packages/nimbus/src/components/form-field/form-field.recipe.ts` (add grid
  layout to recipe)

##### Card Component Update

**Current Pattern** (causes SSR issues):

```typescript
// ❌ BEFORE - useEffect-based layout logic
const Card = ({ children }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Analyze children to determine layout
    setSections(/* analyzed sections */);
  }, [children]);

  if (sections.length === 0) return null; // Hydration mismatch

  return <div>{/* render sections */}</div>;
};
```

**SSR-Safe Pattern** (using CSS Grid):

```typescript
// ✅ AFTER - CSS Grid with defined areas
const Card = ({ children }) => {
  return (
    <CardSlot
      display="grid"
      gridTemplateRows="auto 1fr auto"
      gridTemplateAreas="'header' 'body' 'footer'"
    >
      {children}
    </CardSlot>
  );
};
```

**Files to Update**:

- `packages/nimbus/src/components/card/card.tsx`
- `packages/nimbus/src/components/card/card.recipe.ts` (add grid layout to
  recipe)

**Testing Strategy**:

```typescript
// Add SSR tests for both components
describe('FormField SSR', () => {
  it('renders children without useEffect', () => {
    const html = renderToString(
      <FormField>
        <FormField.Label>Label</FormField.Label>
        <FormField.Input />
      </FormField>
    );

    expect(html).toContain('Label');
    expect(html).not.toBe(''); // Ensure not returning null
  });
});
```

#### 5. Fix Components with Browser API Usage

Based on audit script results, fix each component following this pattern:

```typescript
// ❌ BEFORE (causes SSR crash)
const width = window.innerWidth;

// ✅ AFTER (SSR-safe)
import { useIsClient } from '@/hooks';

const MyComponent = () => {
  const isClient = useIsClient();
  const width = isClient ? window.innerWidth : 0;

  return <div>Width: {width}px</div>;
};
```

### Files to Modify/Create

- ➕ `packages/nimbus/scripts/audit-browser-apis.js` - NEW
- ➕ `packages/nimbus/src/hooks/use-is-client/use-is-client.ts` - NEW
- ➕ `packages/nimbus/src/hooks/use-is-client/use-is-client.spec.ts` - NEW
- ➕
  `packages/nimbus/src/hooks/use-safe-layout-effect/use-safe-layout-effect.ts` -
  NEW
- ✏️ `packages/nimbus/src/hooks/index.ts` - Export new hooks
- ✏️ `package.json` - Add audit:ssr script
- ✏️
  **`packages/nimbus/src/components/form-field/components/form-field.input.tsx` -
  Replace useEffect with CSS Grid**
- ✏️ **`packages/nimbus/src/components/form-field/form-field.recipe.ts` - Add
  grid layout**
- ✏️ **`packages/nimbus/src/components/card/card.tsx` - Replace useEffect with
  CSS Grid**
- ✏️ **`packages/nimbus/src/components/card/card.recipe.ts` - Add grid layout**
- ➕ **`packages/nimbus/src/components/form-field/form-field.ssr.spec.tsx` - SSR
  test**
- ➕ **`packages/nimbus/src/components/card/card.ssr.spec.tsx` - SSR test**
- ✏️ Components identified by audit script (likely minimal based on exploration)

### Success Criteria

- [ ] Audit script runs successfully
- [ ] All browser API usage identified
- [ ] SSR-safe hooks created and tested
- [ ] **FormField renders children with CSS Grid (no useEffect/null return)**
- [ ] **Card renders children with CSS Grid (no useEffect/null return)**
- [ ] **FormField SSR test passes (no hydration mismatch)**
- [ ] **Card SSR test passes (no hydration mismatch)**
- [ ] All flagged components fixed
- [ ] No unguarded browser API usage remains
- [ ] All component SSR tests pass

---

## Phase 3: Build Configuration & Package Exports (Week 3)

**Goal**: Configure package for SSR consumption and validate build output

### Tasks

#### 1. Update Package Exports for SSR

**Update File**: `packages/nimbus/package.json`

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.es.js",
      "require": "./dist/index.cjs"
    },
    "./server": {
      "types": "./dist/server.d.ts",
      "import": "./dist/server.es.js",
      "require": "./dist/server.cjs"
    },
    "./setup-jsdom-polyfills": {
      "import": "./dist/setup-jsdom-polyfills.es.js",
      "require": "./dist/setup-jsdom-polyfills.cjs"
    }
  }
}
```

#### 2. Create Server-Only Entry Point

**New File**: `packages/nimbus/src/server.ts`

````typescript
/**
 * Server-only exports for SSR usage.
 * Import these in your server components or SSR setup.
 *
 * @example
 * ```tsx
 * // Next.js app/layout.tsx
 * import { ColorModeScript, NimbusProvider } from '@commercetools/nimbus/server';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <ColorModeScript />
 *       </head>
 *       <body>
 *         <NimbusProvider>{children}</NimbusProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export { NimbusProvider } from "./components/nimbus-provider";
export {
  ColorModeScript,
  type ColorModeScriptProps,
} from "./components/nimbus-provider/components/color-mode-script";
export { system as defaultTheme } from "./theme";
````

#### 3. Update Vite Config for Server Entry

**Update File**: `packages/nimbus/vite.config.ts`

Add to lib entry points:

```typescript
build: {
  lib: {
    entry: {
      index: resolve(__dirname, 'src/index.ts'),
      server: resolve(__dirname, 'src/server.ts'), // ADD THIS
      'setup-jsdom-polyfills': resolve(__dirname, 'src/test/setup-jsdom-polyfills.ts'),
    },
    formats: ['es', 'cjs'],
  },
  // ... rest of config
}
```

#### 4. Create Build Validation Script

**New File**: `packages/nimbus/scripts/validate-ssr-build.js`

```javascript
#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";

const REQUIRED_FILES = [
  "dist/server.es.js",
  "dist/server.cjs",
  "dist/server.d.ts",
  "dist/index.es.js",
  "dist/index.cjs",
];

async function validateBuild() {
  console.log("🔍 Validating SSR build outputs...\n");

  let hasErrors = false;

  for (const file of REQUIRED_FILES) {
    const filePath = path.join("packages/nimbus", file);
    try {
      await fs.access(filePath);
      console.log(`✅ ${file}`);
    } catch (error) {
      console.log(`❌ ${file} - MISSING`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.log("\n❌ Build validation failed");
    process.exit(1);
  }

  console.log("\n✅ Build validation passed");
}

validateBuild();
```

Add to `package.json`:

```json
{
  "scripts": {
    "validate:ssr": "node packages/nimbus/scripts/validate-ssr-build.js"
  }
}
```

### Files to Modify/Create

- ➕ `packages/nimbus/src/server.ts` - NEW
- ✏️ `packages/nimbus/vite.config.ts` - Add server entry
- ✏️ `packages/nimbus/package.json` - Update exports
- ➕ `packages/nimbus/scripts/validate-ssr-build.js` - NEW
- ✏️ `package.json` - Add validate:ssr script

### Success Criteria

- [ ] Server entry point created with proper exports
- [ ] Build produces server.es.js and server.cjs
- [ ] Type definitions generated (server.d.ts)
- [ ] Validation script passes
- [ ] Package exports work in Node.js and ESM environments
- [ ] Tree-shaking still functions correctly

---

## Phase 4: Test Application & Real-World Validation (Week 4)

**Goal**: Create Next.js test app and validate real SSR usage

### Create Next.js 15 Test App

**Directory**: `apps/ssr-test-next/`

**File**: `apps/ssr-test-next/package.json`

```json
{
  "name": "@commercetools/ssr-test-next",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@commercetools/nimbus": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

**File**: `apps/ssr-test-next/app/layout.tsx`

```typescript
import { ColorModeScript, NimbusProvider } from '@commercetools/nimbus/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nimbus SSR Test',
  description: 'Testing Nimbus components with Next.js 15 SSR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorModeScript defaultMode="system" />
      </head>
      <body>
        <NimbusProvider locale="en-US">
          {children}
        </NimbusProvider>
      </body>
    </html>
  );
}
```

**File**: `apps/ssr-test-next/app/page.tsx`

```typescript
import {
  Box,
  Stack,
  Heading,
  Button,
  Card,
  Menu,
  TextInput,
  Badge,
} from '@commercetools/nimbus';

export default function Home() {
  return (
    <Box padding="600">
      <Stack direction="column" gap="600">
        <Heading as="h1" size="2xl">Nimbus SSR Test Suite</Heading>

        {/* Simple Components */}
        <Card.Root>
          <Card.Header>
            <Card.Title>Simple Components</Card.Title>
          </Card.Header>
          <Card.Body>
            <Stack direction="row" gap="400" alignItems="center">
              <Button variant="solid">Solid Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Badge colorPalette="primary">Badge</Badge>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Form Inputs */}
        <Card.Root>
          <Card.Header>
            <Card.Title>Form Inputs</Card.Title>
          </Card.Header>
          <Card.Body>
            <Stack direction="column" gap="400">
              <TextInput
                label="Text Input"
                placeholder="Enter text..."
              />
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Compound Components */}
        <Card.Root>
          <Card.Header>
            <Card.Title>Compound Components</Card.Title>
          </Card.Header>
          <Card.Body>
            <Menu.Root>
              <Menu.Trigger>Open Menu</Menu.Trigger>
              <Menu.Content>
                <Menu.Item>Option 1</Menu.Item>
                <Menu.Item>Option 2</Menu.Item>
                <Menu.Item>Option 3</Menu.Item>
              </Menu.Content>
            </Menu.Root>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Box>
  );
}
```

#### Create Automated Test Suite

**File**: `apps/ssr-test-next/tests/ssr-validation.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("SSR Validation", () => {
  test("should render HTML on server", async ({ page }) => {
    // Disable JavaScript to test pure SSR
    await page.context().route("**/*.js", (route) => route.abort());

    await page.goto("http://localhost:3000");

    // Verify critical content is in HTML
    await expect(
      page.getByRole("heading", { name: "Nimbus SSR Test Suite" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Solid Button" })
    ).toBeVisible();
  });

  test("should not have hydration errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    const hydrationErrors = errors.filter(
      (e) => e.includes("Hydration") || e.includes("did not match")
    );

    expect(hydrationErrors).toHaveLength(0);
  });

  test("should preserve color mode across refresh", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Get initial theme
    const initialClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    // Refresh page
    await page.reload();

    // Verify theme persists
    const afterClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    expect(afterClass).toBe(initialClass);
  });

  test("should have interactive components after hydration", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    // Click button
    const button = page.getByRole("button", { name: "Solid Button" });
    await button.click();

    // Open menu
    const menuTrigger = page.getByRole("button", { name: "Open Menu" });
    await menuTrigger.click();

    // Verify menu opened
    await expect(page.getByRole("menu")).toBeVisible();
  });
});
```

### Manual Testing Checklist

Create a testing checklist document:

**File**: `apps/ssr-test-next/TESTING.md`

```markdown
# SSR Testing Checklist

## Pre-Hydration Tests (JavaScript Disabled)

- [ ] Page renders with content visible
- [ ] All text content is present in HTML source
- [ ] Buttons and links are visible (even if not interactive)
- [ ] Styles are applied correctly
- [ ] No FOUC (flash of unstyled content)
- [ ] Color mode is correct on first load

## Post-Hydration Tests (JavaScript Enabled)

- [ ] No console errors
- [ ] No hydration warnings
- [ ] Buttons are clickable
- [ ] Forms are interactive
- [ ] Menus open/close correctly
- [ ] Color mode toggle works
- [ ] All animations work

## Performance Tests

- [ ] View page source - HTML content is substantial (not empty)
- [ ] First Contentful Paint < 1s
- [ ] Time to Interactive < 3s
- [ ] No layout shift during hydration
- [ ] Bundle size reasonable

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Responsive Tests

- [ ] Mobile viewport
- [ ] Tablet viewport
- [ ] Desktop viewport
```

### Files to Create

- ➕ `apps/ssr-test-next/package.json` - NEW
- ➕ `apps/ssr-test-next/next.config.js` - NEW
- ➕ `apps/ssr-test-next/tsconfig.json` - NEW
- ➕ `apps/ssr-test-next/app/layout.tsx` - NEW
- ➕ `apps/ssr-test-next/app/page.tsx` - NEW
- ➕ `apps/ssr-test-next/tests/ssr-validation.spec.ts` - NEW
- ➕ `apps/ssr-test-next/TESTING.md` - NEW

### Success Criteria

- [ ] Next.js app builds successfully (`pnpm build`)
- [ ] No hydration mismatches in console
- [ ] ColorModeScript prevents FOUC
- [ ] All automated tests pass
- [ ] Manual testing checklist complete
- [ ] Performance metrics acceptable
- [ ] Works in all target browsers

---

## Phase 5: Documentation & Release (Week 5)

**Goal**: Complete documentation for SSR usage and prepare for release

### Documentation Files to Create

#### 1. SSR Setup Guide

**New File**: `docs/ssr-guide.md`

```markdown
# Nimbus SSR Setup Guide

## Overview

Nimbus fully supports Server-Side Rendering (SSR) with Next.js, Remix, and other
React SSR frameworks.

## Quick Start (Next.js 15 App Router)

### 1. Install Nimbus

\`\`\`bash pnpm add @commercetools/nimbus \`\`\`

### 2. Configure Root Layout

\`\`\`tsx // app/layout.tsx import { ColorModeScript, NimbusProvider } from
'@commercetools/nimbus/server';

export default function RootLayout({ children }) { return (

<html lang="en" suppressHydrationWarning> <head>
<ColorModeScript defaultMode="system" /> </head> <body>
<NimbusProvider locale="en-US"> {children} </NimbusProvider> </body> </html> );
} \`\`\`

### 3. Use Components

\`\`\`tsx // app/page.tsx import { Button, Card, Stack } from
'@commercetools/nimbus';

export default function Page() { return ( <Stack direction="column" gap="400">
<Card.Root> <Card.Header> <Card.Title>Hello Nimbus</Card.Title> </Card.Header>
<Card.Body> <Button>Click me</Button> </Card.Body> </Card.Root> </Stack> ); }
\`\`\`

## Framework-Specific Guides

### Next.js Pages Router

[Detailed setup for Pages Router]

### Remix

[Detailed setup for Remix]

### Custom SSR Setup

[Manual setup instructions]

## API Reference

### ColorModeScript

### NimbusProvider SSR Props

## Common Patterns

### Progressive Enhancement

### Responsive Values with SSR

### Client-Only Components

## Troubleshooting

### Hydration Mismatches

### FOUC (Flash of Unstyled Content)

### Bundle Size

## Performance Best Practices
```

#### 2. Migration Guide

**New File**: `docs/ssr-migration.md`

```markdown
# SSR Migration Guide

## Overview

This guide helps you add SSR support to existing Nimbus applications.

## Prerequisites

- Nimbus v[VERSION]+ required
- Next.js 15+ or Remix v2+ recommended

## Migration Steps

### Step 1: Update Dependencies

\`\`\`bash pnpm update @commercetools/nimbus \`\`\`

### Step 2: Add ColorModeScript

[Instructions]

### Step 3: Update Provider

[Instructions]

### Step 4: Test for Hydration Issues

[Instructions]

### Step 5: Deploy

[Instructions]

## Breaking Changes

**None** - This update is backward compatible. CSR-only apps continue to work
without changes.

## Verification Checklist

- [ ] No console errors
- [ ] No hydration warnings
- [ ] Color mode works correctly
- [ ] All components render on server
```

#### 3. Update CLAUDE.md

**Update File**: `CLAUDE.md`

Add new section:

```markdown
## SSR (Server-Side Rendering) Support

Nimbus fully supports SSR with Next.js, Remix, and other React frameworks.

### Key SSR Files

- `packages/nimbus/src/server.ts` - Server-only exports
- `packages/nimbus/src/components/nimbus-provider/components/color-mode-script.tsx` -
  Color mode script

### SSR Testing

\`\`\`bash

# Run SSR-specific tests

pnpm test --project ssr

# Audit components for browser API usage

pnpm audit:ssr

# Validate SSR build

pnpm validate:ssr \`\`\`

### SSR Test App

The `apps/ssr-test-next/` directory contains a Next.js 15 test application for
validating SSR functionality.

### Common SSR Patterns

**SSR-safe locale detection:** \`\`\`typescript const locale = typeof navigator
!== 'undefined' ? navigator.language : 'en'; \`\`\`

**Client-only rendering:** \`\`\`typescript import { useIsClient } from
'@commercetools/nimbus';

const MyComponent = () => { const isClient = useIsClient(); return isClient ?
<ClientContent /> : <ServerContent />; }; \`\`\`

For complete SSR documentation, see [SSR Guide](./docs/ssr-guide.md).
```

#### 4. Update Component Documentation

Update relevant component `.mdx` files to include SSR notes where applicable.

#### 5. Create Changelog Entry

**Update File**: `packages/nimbus/CHANGELOG.md`

```markdown
## [VERSION] - YYYY-MM-DD

### Added

- **SSR Support**: Full server-side rendering support for Next.js, Remix, and
  other React SSR frameworks
  - New `ColorModeScript` component to prevent FOUC (flash of unstyled content)
  - SSR-safe `NimbusProvider` with React Aria `SSRProvider` integration
  - Server entry point at `@commercetools/nimbus/server`
  - SSR testing infrastructure with Vitest
  - New utility hooks: `useIsClient`, `useSafeLayoutEffect`
  - Comprehensive SSR documentation and migration guide

### Fixed

- Fixed `NimbusProvider` crash when `navigator.language` is unavailable (SSR
  environments)
- Fixed potential hydration mismatches in responsive components

### Documentation

- Added complete SSR setup guide
- Added SSR migration guide for existing applications
- Added Next.js 15 example application
- Updated CLAUDE.md with SSR development patterns

### Testing

- Added SSR test suite with Vitest Node environment
- Added browser API audit script
- Added SSR build validation script
```

### Files to Create/Update

- ➕ `docs/ssr-guide.md` - NEW
- ➕ `docs/ssr-migration.md` - NEW
- ✏️ `CLAUDE.md` - Add SSR section
- ✏️ Relevant component `.mdx` files - Add SSR notes
- ✏️ `packages/nimbus/CHANGELOG.md` - Add release notes
- ➕ `docs/ssr-troubleshooting.md` - NEW

### Success Criteria

- [ ] SSR guide complete and accurate
- [ ] Migration guide tested with real app
- [ ] CLAUDE.md updated with SSR patterns
- [ ] Component docs updated where relevant
- [ ] Changelog entry complete
- [ ] All documentation reviewed and approved
- [ ] Examples tested and working

---

## Phase 6: Framework Validation - Gatsby/Next/Remix (Week 6)

**Goal**: Validate SSR compatibility with Gatsby (priority 1), Next.js (priority 2), and Remix (priority 3)

### Priority Order Rationale

1. **Gatsby** - Highest priority due to static site generation (SSG) and build-time rendering requirements
2. **Next.js** - Already validated in Phase 4, expand coverage
3. **Remix** - Server-side focus, validate data loading patterns

### Tasks

#### 1. Gatsby SSR/SSG Validation

**Goal**: Ensure Nimbus components work in Gatsby's unique SSR/SSG environment

**Challenges**:
- Gatsby renders at build time (SSG), not request time
- `gatsby-ssr.js` and `gatsby-browser.js` setup required
- Plugin ecosystem integration

**New Directory**: `apps/ssr-test-gatsby/`

**File**: `apps/ssr-test-gatsby/gatsby-config.ts`

```typescript
import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Nimbus Gatsby SSR Test',
    siteUrl: 'https://www.yourdomain.tld',
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
  ],
};

export default config;
```

**File**: `apps/ssr-test-gatsby/gatsby-ssr.tsx`

```typescript
import React from 'react';
import { GatsbySSR } from 'gatsby';
import { NimbusProvider, ColorModeScript } from '@commercetools/nimbus/server';

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => {
  return <NimbusProvider locale="en-US">{element}</NimbusProvider>;
};

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ setHeadComponents }) => {
  setHeadComponents([
    <ColorModeScript key="color-mode-script" defaultMode="system" />,
  ]);
};
```

**File**: `apps/ssr-test-gatsby/gatsby-browser.tsx`

```typescript
import React from 'react';
import { GatsbyBrowser } from 'gatsby';
import { NimbusProvider } from '@commercetools/nimbus';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({ element }) => {
  return <NimbusProvider locale="en-US">{element}</NimbusProvider>;
};
```

**File**: `apps/ssr-test-gatsby/src/pages/index.tsx`

```tsx
import React from 'react';
import { HeadFC, PageProps } from 'gatsby';
import {
  Box,
  Stack,
  Heading,
  Button,
  Card,
  Badge,
  TextInput,
} from '@commercetools/nimbus';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Box padding="600">
      <Stack direction="column" gap="600">
        <Heading as="h1" size="2xl">
          Nimbus Gatsby SSR Test
        </Heading>

        <Card.Root>
          <Card.Header>
            <Card.Title>SSR Validation</Card.Title>
          </Card.Header>
          <Card.Body>
            <Stack direction="column" gap="400">
              <TextInput label="Test Input" placeholder="Type here..." />
              <Stack direction="row" gap="400">
                <Button variant="solid">Solid</Button>
                <Button variant="outline">Outline</Button>
                <Badge colorPalette="primary">Badge</Badge>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Box>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Nimbus Gatsby Test</title>;
```

**Gatsby-Specific Tests**:

**File**: `apps/ssr-test-gatsby/tests/gatsby-ssr.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Gatsby SSR Validation', () => {
  test('should have content in built HTML', async ({ page }) => {
    // Test against built site (gatsby build output)
    await page.goto('http://localhost:9000');

    // Verify content exists in static HTML
    const heading = await page.getByRole('heading', { name: 'Nimbus Gatsby SSR Test' });
    await expect(heading).toBeVisible();
  });

  test('should not have hydration errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:9000');
    await page.waitForLoadState('networkidle');

    const hydrationErrors = errors.filter((e) =>
      e.includes('Hydration') || e.includes('did not match')
    );

    expect(hydrationErrors).toHaveLength(0);
  });

  test('should work with Gatsby Link navigation', async ({ page }) => {
    await page.goto('http://localhost:9000');

    // Test client-side navigation
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/about/);

    // Verify components still work after navigation
    const button = page.getByRole('button', { name: 'Solid' });
    await expect(button).toBeVisible();
  });
});
```

#### 2. Next.js Extended Validation

**Goal**: Expand Phase 4 testing with App Router, Pages Router, and advanced patterns

**File**: `apps/ssr-test-next/app/app-router-test/page.tsx`

```tsx
import { Button, Card, Stack } from '@commercetools/nimbus';

// Server Component
export default function AppRouterTest() {
  return (
    <Stack direction="column" gap="600">
      <Card.Root>
        <Card.Header>
          <Card.Title>App Router Server Component</Card.Title>
        </Card.Header>
        <Card.Body>
          <Button variant="solid">Server Rendered</Button>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
```

**File**: `apps/ssr-test-next/app/app-router-test/client-component.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Button, Badge } from '@commercetools/nimbus';

export function ClientComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Badge colorPalette="primary">Count: {count}</Badge>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

#### 3. Remix Validation

**New Directory**: `apps/ssr-test-remix/`

**File**: `apps/ssr-test-remix/app/root.tsx`

```tsx
import { Links, LiveReload, Meta, Outlet, Scripts } from '@remix-run/react';
import { NimbusProvider, ColorModeScript } from '@commercetools/nimbus/server';

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorModeScript defaultMode="system" />
      </head>
      <body>
        <NimbusProvider locale="en-US">
          <Outlet />
        </NimbusProvider>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

**File**: `apps/ssr-test-remix/app/routes/_index.tsx`

```tsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button, Card, Stack, Heading } from '@commercetools/nimbus';

export const loader = async () => {
  return json({
    title: 'Nimbus Remix SSR Test',
    items: ['Item 1', 'Item 2', 'Item 3'],
  });
};

export default function Index() {
  const { title, items } = useLoaderData<typeof loader>();

  return (
    <Stack direction="column" gap="600" padding="600">
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
      <Card.Root>
        <Card.Header>
          <Card.Title>Data Loaded from Loader</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack direction="column" gap="300">
            {items.map((item) => (
              <Button key={item} variant="outline">
                {item}
              </Button>
            ))}
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
```

### Files to Create

#### Gatsby
- ➕ `apps/ssr-test-gatsby/` - NEW (entire directory)
- ➕ `apps/ssr-test-gatsby/gatsby-config.ts`
- ➕ `apps/ssr-test-gatsby/gatsby-ssr.tsx`
- ➕ `apps/ssr-test-gatsby/gatsby-browser.tsx`
- ➕ `apps/ssr-test-gatsby/src/pages/index.tsx`
- ➕ `apps/ssr-test-gatsby/tests/gatsby-ssr.spec.ts`

#### Next.js (Extended)
- ➕ `apps/ssr-test-next/app/app-router-test/page.tsx`
- ➕ `apps/ssr-test-next/app/app-router-test/client-component.tsx`
- ➕ `apps/ssr-test-next/pages/pages-router-test.tsx`

#### Remix
- ➕ `apps/ssr-test-remix/` - NEW (entire directory)
- ➕ `apps/ssr-test-remix/app/root.tsx`
- ➕ `apps/ssr-test-remix/app/routes/_index.tsx`
- ➕ `apps/ssr-test-remix/tests/remix-ssr.spec.ts`

### Success Criteria

#### Gatsby (Priority 1)
- [ ] `gatsby build` completes without errors
- [ ] Components render in static HTML output
- [ ] No hydration mismatches
- [ ] `gatsby-ssr.js` and `gatsby-browser.js` setup working
- [ ] ColorModeScript prevents FOUC
- [ ] Client-side navigation works with Gatsby Link

#### Next.js (Priority 2)
- [ ] App Router server components work
- [ ] App Router client components work
- [ ] Pages Router still works (backward compatibility)
- [ ] No hydration mismatches in either router
- [ ] Data fetching patterns work (getServerSideProps, Server Components)

#### Remix (Priority 3)
- [ ] `remix build` completes without errors
- [ ] Components render on server
- [ ] No hydration mismatches
- [ ] Loader data integrates with components
- [ ] ColorModeScript works in Remix

---

## Critical Files Summary

### Phase 1 (Week 1)

- ✏️
  `packages/nimbus/src/components/nimbus-i18n-provider/nimbus-i18n-provider.tsx` -
  **Consolidate i18n**
- ✏️ `packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx` -
  **Simplify**
- ➕
  `packages/nimbus/src/components/nimbus-provider/components/color-mode-script.tsx`
- ➕ `packages/nimbus/vitest.ssr.config.ts`
- ➕ `packages/nimbus/src/test/ssr-test-setup.ts`
- ✏️ `vitest.config.ts`
- ➕
  `packages/nimbus/src/components/nimbus-i18n-provider/nimbus-i18n-provider.ssr.spec.tsx`
- ➕
  `packages/nimbus/src/components/nimbus-provider/nimbus-provider.ssr.spec.tsx`

### Phase 2 (Week 2)

- ➕ `packages/nimbus/scripts/audit-browser-apis.js`
- ➕ `packages/nimbus/src/hooks/use-is-client/use-is-client.ts`
- ➕
  `packages/nimbus/src/hooks/use-safe-layout-effect/use-safe-layout-effect.ts`
- ✏️
  **`packages/nimbus/src/components/form-field/components/form-field.input.tsx` -
  CSS Grid layout**
- ✏️ **`packages/nimbus/src/components/form-field/form-field.recipe.ts` - Grid
  styles**
- ✏️ **`packages/nimbus/src/components/card/card.tsx` - CSS Grid layout**
- ✏️ **`packages/nimbus/src/components/card/card.recipe.ts` - Grid styles**
- ➕ **`packages/nimbus/src/components/form-field/form-field.ssr.spec.tsx` - SSR
  test**
- ➕ **`packages/nimbus/src/components/card/card.ssr.spec.tsx` - SSR test**
- ✏️ Components identified by audit (expected: minimal)

### Phase 3 (Week 3)

- ➕ `packages/nimbus/src/server.ts`
- ✏️ `packages/nimbus/vite.config.ts`
- ✏️ `packages/nimbus/package.json`
- ➕ `packages/nimbus/scripts/validate-ssr-build.js`

### Phase 4 (Week 4)

- ➕ `apps/ssr-test-next/` (entire directory)
- ➕ `apps/ssr-test-next/tests/ssr-validation.spec.ts`

### Phase 5 (Week 5)

- ➕ `docs/ssr-guide.md`
- ➕ `docs/ssr-migration.md`
- ✏️ `CLAUDE.md`
- ✏️ `packages/nimbus/CHANGELOG.md`

### Phase 6 (Week 6)

#### Gatsby
- ➕ `apps/ssr-test-gatsby/` - NEW (entire directory)
- ➕ `apps/ssr-test-gatsby/gatsby-config.ts`
- ➕ `apps/ssr-test-gatsby/gatsby-ssr.tsx`
- ➕ `apps/ssr-test-gatsby/gatsby-browser.tsx`
- ➕ `apps/ssr-test-gatsby/src/pages/index.tsx`
- ➕ `apps/ssr-test-gatsby/tests/gatsby-ssr.spec.ts`

#### Next.js (Extended)
- ➕ `apps/ssr-test-next/app/app-router-test/page.tsx`
- ➕ `apps/ssr-test-next/app/app-router-test/client-component.tsx`
- ➕ `apps/ssr-test-next/pages/pages-router-test.tsx`

#### Remix
- ➕ `apps/ssr-test-remix/` - NEW (entire directory)
- ➕ `apps/ssr-test-remix/app/root.tsx`
- ➕ `apps/ssr-test-remix/app/routes/_index.tsx`
- ➕ `apps/ssr-test-remix/tests/remix-ssr.spec.ts`

---

## Risk Mitigation

### Risk 1: Hydration Mismatches (HIGH)

**Risk**: Components render differently on server vs. client

**Mitigation**:

- Comprehensive SSR tests for all components
- Automated hydration testing in CI/CD
- Clear documentation on SSR-safe patterns
- Use `useIsClient` hook for client-only code

**Rollback Plan**:

- Fix component causing mismatch
- Add test to prevent regression
- Release patch version

### Risk 2: Breaking Changes (MEDIUM)

**Risk**: SSR changes break existing CSR-only apps

**Mitigation**:

- All changes backward compatible
- Existing apps continue to work without modification
- SSR setup is opt-in via new imports
- Comprehensive testing of both SSR and CSR modes

**Rollback Plan**:

- Document workaround
- Release patch with fix
- Update migration guide

### Risk 3: Performance Degradation (MEDIUM)

**Risk**: SSR adds overhead to bundle size or runtime performance

**Mitigation**:

- Monitor bundle size in CI
- Benchmark SSR render time
- Tree-shaking preserved
- Server entry point separate from main

**Rollback Plan**:

- Optimize specific bottlenecks
- Document performance best practices
- Consider code splitting if needed

### Risk 4: Documentation Quality (LOW)

**Risk**: Users struggle with SSR setup despite documentation

**Mitigation**:

- Working example applications
- Step-by-step guides with code samples
- Troubleshooting section
- Video walkthrough (optional)

**Rollback Plan**:

- Gather user feedback
- Update documentation iteratively
- Add more examples

---

## Success Metrics

### Technical Metrics

- ✅ Zero hydration errors in test suite
- ✅ All components render on server
- ✅ Build size increase < 5%
- ✅ SSR test coverage > 80%
- ✅ No console warnings

### User Experience Metrics

- ✅ Time to First Byte (TTFB) < 200ms
- ✅ First Contentful Paint (FCP) < 1s
- ✅ No FOUC with ColorModeScript
- ✅ Smooth hydration (no layout shift)

### Developer Experience Metrics

- ✅ Setup time < 10 minutes
- ✅ Documentation clarity score > 4/5
- ✅ Example app builds successfully
- ✅ Clear error messages for common issues

---

## Timeline Summary

| Phase       | Duration | Key Deliverables                       | Risk Level |
| ----------- | -------- | -------------------------------------- | ---------- |
| **Phase 1** | Week 1   | Provider fixes, testing infrastructure | Low        |
| **Phase 2** | Week 2   | Component audit, browser API fixes     | Medium     |
| **Phase 3** | Week 3   | Build config, package exports          | Low        |
| **Phase 4** | Week 4   | Test app, validation                   | Medium     |
| **Phase 5** | Week 5   | Documentation, release prep            | Low        |
| **Phase 6** | Week 6   | Framework validation (Gatsby/Next/Remix)| Low       |

**Total Duration**: 6 weeks

---

## Post-Implementation Tasks

### Immediate (Week 7)

- [ ] Release announcement blog post
- [ ] Update marketing materials
- [ ] Community support for early adopters

### Short-term (1-3 months)

- [ ] Gather feedback from production users
- [ ] Iterate on documentation based on common questions
- [ ] Performance optimizations if needed
- [ ] Add more framework examples (Astro, SolidStart)

### Long-term (3-6 months)

- [ ] React Server Components (RSC) investigation
- [ ] Edge runtime support
- [ ] Streaming SSR optimization
- [ ] Framework-specific plugins/integrations

---

## Conclusion

This plan provides a clear, incremental path to SSR support for Nimbus with:

✅ **Low Risk**: Backward compatible, well-tested approach
✅ **High Quality**: Comprehensive testing and documentation
✅ **Clear Timeline**: 6 weeks with defined milestones
✅ **Maintainable**: Clean separation of concerns, good patterns
✅ **Future-Proof**: Foundation for React Server Components

The foundation is solid—Nimbus is already 80% SSR-ready. This plan addresses the
critical 20% systematically with clear success criteria at each phase.
