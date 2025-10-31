# Nimbus Docs App Architecture - Comprehensive Analysis

## Overview

The Nimbus documentation app is a sophisticated single-page application (SPA) built with React, React Router v7, Vite, and Jotai. It processes MDX files and TypeScript definitions at build time, generates JSON artifacts, and provides a dynamic documentation experience with features like fuzzy search, live code examples, and hot reload during development.

---

## 1. ROUTING SYSTEM

### Framework & Technology
- **React Router v7** with `createBrowserRouter` for client-side navigation
- **File**: `/Volumes/Code/nimbus/apps/docs/src/router/routes.tsx`

### Routing Architecture

**Route Configuration:**
```typescript
export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppWithRouter,
    children: [
      { path: "/", Component: HomeRoute, loader: homeLoader },
      { path: "/category/:category", Component: CategoryRoute, loader: categoryLoader },
      { path: "*", Component: ComponentDocRoute, loader: componentDocLoader }
    ]
  }
]);
```

### Key Routing Patterns

1. **Lazy Loading**: Routes code-split with React's `lazy()`:
   ```typescript
   const ComponentDocRoute = lazy(() => import("@/routes/component-doc"));
   const CategoryRoute = lazy(() => import("@/routes/category"));
   ```

2. **Dynamic Route Matching**: Catch-all route (`path: "*"`) handles all documentation pages
   - URL: `/components/feedback/alert`
   - Manifest lookup: `route-components-alert`
   - JSON loaded: `src/data/routes/components-alert.json`

3. **Data Loaders**: Preload data before route transition:
   ```typescript
   componentDocLoader: async ({ params }) => {
     const manifest = await import("./../data/route-manifest.json");
     const route = findRouteByPath(pathname, manifest);
     const routeData = await import(`/src/data/routes/${route.chunkName}.json`);
     return routeData;
   }
   ```

### Route Structure
```
/                           → Home page
/category/:category         → Category listing pages
/*                          → Catch-all for all doc pages
```

### Navigation Hierarchy
```
AppWithRouter (Router context + location sync)
    ↓
AppLayout (Holy Grail layout with breadcrumb, nav, content)
    ↓
Route Components (Home, Category, ComponentDoc)
```

---

## 2. DATA SOURCES & BUILD PIPELINE

### Multi-Layered Data Architecture

#### **Layer 1: Source Files** (Monorepo Packages)
```
packages/nimbus/src/
├── components/**/*.mdx      # Component documentation
└── **/*.ts(x)               # TypeScript source files
```

#### **Layer 2: Build-Time Processing**
**Script**: `/Volumes/Code/nimbus/apps/docs/scripts/build.ts`

**Build Process:**
```bash
pnpm build:docs
    ↓
1. Find all .mdx files recursively
2. Find all .ts/.tsx files recursively
3. Parse with specialized parsers:
   - parseMdx() → Extract frontmatter, generate TOC, validate
   - parseTypes() → Extract component props with react-docgen-typescript
4. Generate output artifacts:
   - src/data/docs.json           # All documentation metadata + MDX content
   - src/data/types.json          # Component prop definitions
   - src/data/route-manifest.json # Route index for navigation
   - src/data/routes/*.json       # Individual route chunks (lazy loading)
```

#### **Layer 3: MDX Parsing**
**File**: `/Volumes/Code/nimbus/apps/docs/scripts/doc-generation/parse-mdx.ts`

**Parser Stack:**
- `gray-matter` - YAML frontmatter extraction
- `remark-flexible-toc` - Table of contents generation
- `zod` - Schema validation

**MDX Processing Flow:**
```typescript
1. Read MDX file from disk
2. Extract frontmatter (YAML) with gray-matter
3. Generate Table of Contents from headings
4. Calculate route from menu array using sluggify
5. Validate with mdxDocumentSchema (Zod)
6. Store in observable object that auto-writes to docs.json
```

**Frontmatter Schema** (from `/Volumes/Code/nimbus/apps/docs/src/schemas/mdx-document.ts`):
```yaml
id: Components-Alert              # Unique identifier
title: Alert                      # Display name
description: "..."                # Brief description
lifecycleState: Stable            # Optional: Experimental|Alpha|Beta|Stable|Deprecated|EOL
order: 999                        # Menu ordering
menu:                             # Hierarchical menu placement
  - Components
  - Feedback
  - Alert
tags:                             # Search tags
  - component
  - feedback
figmaLink: https://...            # Optional: Figma design link

# Generated fields:
repoPath: packages/nimbus/...     # Source file path
route: components/feedback/alert  # Calculated URL path
toc: [...]                        # Table of contents
```

#### **Layer 4: Component Props Extraction**
**File**: `/Volumes/Code/nimbus/apps/docs/scripts/doc-generation/parse-types.ts`

**Technology**: `react-docgen-typescript`

**Props Extraction Flow:**
```typescript
1. Parse main entry: packages/nimbus/src/index.ts
2. Extract all exported component prop interfaces
3. Filter props (remove inherited HTML/React/Chakra/ARIA)
4. Enrich with @supportsStyleProps JSDoc tags
5. Save to types.json
```

**Props Filtering** (from `filter-props.ts`):
- Filters out inherited props using `shouldFilterProp()`
- Keeps only component-specific props
- Detects special JSDoc tags (`@supportsStyleProps`)

**Output Structure:**
```json
{
  "Alert": {
    "displayName": "Alert",
    "props": {
      "variant": {
        "type": "\"solid\" | \"outline\"",
        "defaultValue": "solid",
        "description": "Visual variant"
      }
    },
    "supportsStyleProps": true
  }
}
```

#### **Layer 5: Runtime Data Loading**
**File**: `/Volumes/Code/nimbus/apps/docs/src/atoms/documentation.ts`

**Jotai Async Atom Pattern:**
```typescript
export const documentationAtom = atom<Promise<DocumentationJson>>(async () => {
  const module = await import("./../data/docs.json");
  return module.default as DocumentationJson;
});
```

**Benefits:**
- Defers loading until needed
- Handles async data in Jotai's dependency graph
- Prevents race conditions during navigation
- Enables derived atoms to depend on documentation data

#### **Layer 6: Route Manifest**
**File**: `src/data/route-manifest.json`

**Purpose**: Maps URL paths to JSON chunks for lazy loading

**Example Entry:**
```json
{
  "path": "/components/feedback/alert",
  "id": "Components-Alert",
  "title": "Alert",
  "category": "Components",
  "tags": ["component", "feedback"],
  "chunkName": "route-components-alert"
}
```

**Usage**: Router loaders look up route in manifest, then dynamically import corresponding JSON chunk

---

## 3. SPECIAL MECHANISMS

### A. Breadcrumb Navigation
**Component**: `/Volumes/Code/nimbus/apps/docs/src/components/navigation/breadcrumb/breadcrumb.tsx`

**Data Flow:**
```typescript
Active document meta.menu: ["Components", "Feedback", "Alert"]
    ↓
For each menu segment, calculate cumulative path:
    ["Components"] → "components"
    ["Components", "Feedback"] → "components/feedback"
    ↓
Render as clickable links with Home icon at start
```

**Path Calculation**: Uses `menuToPath()` helper to convert menu arrays to URL paths

### B. Sidebar Menu Navigation
**Component**: `/Volumes/Code/nimbus/apps/docs/src/components/navigation/menu/menu.tsx`

**Data Source**: Jotai `menuAtom` (derived from `documentationAtom`)

**Menu Building Process** (from `/Volumes/Code/nimbus/apps/docs/src/atoms/menu.ts`):
```typescript
buildMenu(allDocs):
    1. addFirstLevelItems() - Find docs with 1-level menu arrays (root items)
    2. addNestedItems() - Recursively nest based on menu depth
    3. orderMenuItems() - Sort by order property and alphabetically
    ↓
Result: Hierarchical menu structure
```

**Smart Filtering**:
- Shows only sub-items of the active top-level category
- When on `/components/*`, only shows Components sub-menu
- Prevents overwhelming sidebar with entire doc tree

**Route Handling**:
- Uses `meta.route` field as single source of truth
- Prevents broken links from menu-to-route mismatches

### C. Table of Contents (TOC)
**Component**: `/Volumes/Code/nimbus/apps/docs/src/components/navigation/toc/toc.tsx`

**TOC Generation Pipeline:**
```
Build Time:
    MDX headings → remark-flexible-toc → Extract structure
    ↓
Runtime:
    Stored in meta.toc array in docs.json
    ↓
    tocAtom filters for active document
    ↓
    Rendered in right sidebar
```

**TOC Item Structure:**
```typescript
{
  value: "Overview",           // Heading text
  href: "#overview",           // Anchor link
  depth: 2,                    // h1=1, h2=2, h3=3, etc.
  numbering: [1, 2],          // For outline numbering
  parent: "Introduction"       // Parent heading
}
```

**Active Heading Detection**:
- `useClosestHeading()` hook
- Intersection Observer API
- Detects which heading is currently visible in viewport
- Highlights active section in TOC

### D. Search System
**Component**: `/Volumes/Code/nimbus/apps/docs/src/components/navigation/app-nav-bar/components/app-nav-bar-search`

**Search Technology**: Fuse.js (fuzzy search library)

**Search Index Building:**
```typescript
searchableDocItemsAtom (derived from documentationAtom):
    1. For each doc, extract:
       - meta (title, description, tags)
       - content (MDX with markdown stripped)
    2. Weight fields:
       - title: 3x weight
       - description: 2x weight
       - tags: 1.5x weight
       - content: 1x weight
    ↓
Fuse.js initializes with threshold 0.4 (fuzzy matching)
```

**Features:**
- Fuzzy matching with configurable threshold
- Search history persisted to localStorage via `atomWithStorage`
- Search analytics logging
- Tag and category filtering
- Keyboard navigation (↑/↓ arrows)

**Search Result Structure:**
```typescript
{
  item: SearchableDocItem,
  score: number,            // Relevance score
  matches: [               // Matched text segments
    { indices: [[0, 5]], value: "Alert" }
  ]
}
```

### E. Development Hot Reload
**File**: `/Volumes/Code/nimbus/apps/docs/scripts/doc-generation/watcher.tsx`

**Technology**: Chokidar file watcher

**Dev Workflow:**
```
1. Watch patterns: /packages/**/*.{mdx,ts,tsx}
    ↓
2. On file change detected:
    - .mdx files → parseMdx()
    - .ts/.tsx files → parseTypes()
    ↓
3. Observable proxy pattern triggers debounced write
    ↓
4. Vite HMR detects JSON changes
    ↓
5. Jotai atoms recompute derived data
    ↓
6. Components re-render with fresh data
```

**Benefits:**
- Instant feedback during documentation writing
- No manual rebuild needed
- Preserves application state during reload

### F. DevOnly Tools
**Component**: `/Volumes/Code/nimbus/apps/docs/src/components/document-meta-settings/`

**Features** (development mode only):
- Edit document frontmatter in browser
- Create new documents
- Delete documents
- File system API calls via Vite plugin

**Guard**: Only rendered when `import.meta.env.DEV === true`

### G. File System API (Development)
**Plugin**: `/Volumes/Code/nimbus/apps/docs/vite-plugins/vite-plugin-fs-api.ts`

**Purpose**: Allow browser to interact with file system during development

**HTTP Endpoints:**
```typescript
POST   /api/fs              # Create file
GET    /api/fs?repoPath=... # Read file
PUT    /api/fs              # Update file
DELETE /api/fs              # Delete file
```

**Security:**
- Rate limiting (1000 req/100ms)
- Path traversal prevention
- Only active in dev mode

---

## 4. MDX CONTENT RENDERING

### Runtime MDX Processing
**Component**: `/Volumes/Code/nimbus/apps/docs/src/components/document-renderer/mdx-string-renderer.tsx`

**Technology Stack:**
- `@mdx-js/mdx` - Runtime MDX evaluation
- `remarkGfm` - GitHub-flavored markdown
- `remarkMark` - Highlight syntax (==text==)

**Rendering Flow:**
```typescript
MDX string (from docs.json)
    ↓
@mdx-js/mdx evaluates to React component
    ↓
Apply custom component mappings (MDXComponents)
    ↓
Render with Nimbus components
```

### Custom MDX Components
**File**: `/Volumes/Code/nimbus/apps/docs/src/components/document-renderer/components/index.tsx`

**Component Mappings:**
```typescript
export const MDXComponents = {
  // Base HTML tags
  h1: Heading,
  h2: Heading,
  p: Paragraph,
  code: Code,

  // Nimbus components (available globally)
  Button, Stack, Icons, Grid, Box,

  // Custom documentation components
  PropsTable,        // Auto-generates component API tables
  ColorScales,       // Design token demonstrations
  IconSearch,        // Icon browser
  Frontpage,         // Home page layout

  // Code rendering
  "jsx-live": LiveCode  // Interactive code examples
};
```

### PropsTable Component Deep Dive
**File**: `/Volumes/Code/nimbus/apps/docs/src/components/document-renderer/components/props-table/props-table.tsx`

**Runtime Component Detection:**
```typescript
1. Receive id prop (e.g., "Button" or "Menu")
2. Access live Nimbus exports: nimbus[id]
3. Detect component type:
   - typeof === "function" → Function component
   - Has $$typeof → React element
   - Object without React markers → Compound component
4. For compound components:
   - Generate tabs for each sub-component (Root, Trigger, etc.)
   - Load props for each from types.json
5. Display in formatted table
```

**Compound Component Handling:**
```typescript
Menu compound component detected
    ↓
Enumerate keys: ["Root", "Trigger", "Content", "Item"]
    ↓
Create tabs for each part
    ↓
Load "Menu.Root", "Menu.Trigger", etc. from types.json
    ↓
Render ComponentPropsTable for each tab
```

### Live Code Examples
**Component**: `jsx-live` code blocks in MDX

**Technology**: `react-live` library

**Example:**
```markdown
```jsx-live
const App = () => {
  const [count, setCount] = useState(0);
  return (
    <Stack direction="column" gap="400">
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </Stack>
  );
};
```
```

**Features:**
- Live editing in browser
- Instant preview
- All Nimbus components available globally (no imports needed)
- Syntax highlighting with Prism

---

## 5. BUILD PROCESS & CODE SPLITTING

### Build Commands
**From**: `/Volumes/Code/nimbus/apps/docs/package.json`

```bash
pnpm build:
  1. pnpm build:docs        # Generate JSON artifacts
  2. pnpm build:app         # Vite build
  3. pnpm copy-index        # Copy index.html to 404.html for SPA routing
```

### Vite Configuration
**File**: `/Volumes/Code/nimbus/apps/docs/vite.config.ts`

**Advanced Manual Chunking Strategy:**
```typescript
manualChunks: (id) => {
  // Route-based code splitting
  if (id.includes("/routes/")) return `route-${extractRouteName(id)}`;

  // Vendor libraries
  if (id.includes("react") || id.includes("react-dom")) return "react-vendor";
  if (id.includes("@mdx-js")) return "mdx-runtime";
  if (id.includes("@commercetools/nimbus/")) return "nimbus-ui";
  if (id.includes("@commercetools/nimbus-icons")) return "nimbus-icons";
  if (id.includes("prism-react-renderer")) return "syntax-highlighter";
  if (id.includes("react-live")) return "live-editor";
  if (id.includes("jotai")) return "state-vendor";
  if (id.includes("fuse.js")) return "search-vendor";
  if (id.includes("lodash")) return "utils-vendor";

  // Default vendor chunk
  return "vendor";
}
```

**Benefits:**
- Parallel loading of independent chunks
- Efficient caching (vendor chunks rarely change)
- Reduced initial bundle size
- Faster page transitions

**Additional Optimizations:**
- CSS code splitting enabled
- Brotli + Gzip compression
- Tree shaking for dead code elimination
- Bundle analyzer for size monitoring

---

## 6. STATE MANAGEMENT

### Jotai Atom Architecture
**Library**: Jotai (atomic state management)

**Atoms Directory**: `/Volumes/Code/nimbus/apps/docs/src/atoms/`

### Core Atoms

| Atom | Type | Purpose |
|------|------|---------|
| `documentationAtom` | Async | Loads docs.json with all documentation |
| `menuAtom` | Async Derived | Builds hierarchical menu from docs |
| `activeRouteAtom` | Sync | Current browser route (normalized) |
| `tocAtom` | Async Derived | TOC for active document |
| `searchableDocItemsAtom` | Async Derived | Search index with stripped markdown |
| `searchQueryAtom` | Sync | Current search input |
| `searchHistoryAtom` | Sync + Storage | Persisted search history |
| `brandNameAtom` | Sync | Brand name for page titles |

### Atom Dependency Graph
```
documentationAtom (async load docs.json)
    ↓
    ├→ menuAtom (derive hierarchical menu)
    ├→ tocAtom (derive TOC for active doc)
    └→ searchableDocItemsAtom (derive search index)
          ↓
          searchQueryAtom → search results
```

### Key Pattern: Async Atoms
**Purpose**: Prevent race conditions during navigation

```typescript
// ❌ Bad: Synchronous import causes race conditions
export const documentationAtom = atom(docs);

// ✅ Good: Async atom properly handles loading state
export const documentationAtom = atom<Promise<DocumentationJson>>(async () => {
  const module = await import("./../data/docs.json");
  return module.default;
});
```

**Benefits:**
- Components suspend during load
- Proper loading state handling
- Derived atoms wait for parent data
- No manual loading state management

---

## 7. APPLICATION LAYOUT

### Holy Grail Layout
**Component**: `/Volumes/Code/nimbus/apps/docs/src/layouts/app-layout.tsx`

**Layout Structure** (AppFrame compound component):
```
┌─────────────────────────────────────────────┐
│  BreadcrumbBar                              │
│  (Home > Components > Feedback > Alert)     │
├──────────┬──────────────────┬───────────────┤
│          │                  │               │
│  TopBar (full width)        │               │
│  (Logo, Search, Settings)   │               │
├──────────┼──────────────────┼───────────────┤
│          │                  │               │
│ LeftNav  │  MainContent     │  RightAside   │
│ (Menu)   │  (Router Outlet) │  (TOC)        │
│          │                  │               │
│          │  Document        │  • Overview   │
│          │  Rendered Here   │  • Usage      │
│          │                  │  • Props      │
│          │                  │               │
└──────────┴──────────────────┴───────────────┘
```

### Layout Sections

1. **BreadcrumbBar** (top-most)
   - Navigation trail from home to current page
   - Clickable segments for quick navigation

2. **TopBar** (full width)
   - Brand logo and name
   - Search input
   - Settings menu
   - Current time display
   - Performance monitor (dev only)

3. **LeftNav** (left sidebar)
   - Hierarchical menu
   - Filtered to active top-level category
   - Collapsible sections
   - Active route highlighting

4. **MainContent** (center)
   - Router Outlet renders active route
   - Document content with live code examples
   - Props tables and component demos

5. **RightAside** (right sidebar)
   - Table of contents for current document
   - DevOnly meta settings (dev mode)
   - Sticky positioning for scroll

---

## 8. DEVELOPMENT WORKFLOW

### Dev Server Process
**Script**: `/Volumes/Code/nimbus/apps/docs/scripts/dev.ts`

**Command**: `pnpm start:docs`

**Process:**
```typescript
1. Spawn two concurrent processes:
   - Vite dev server (port 5173)
     • Serves application
     • Hot Module Replacement (HMR)

   - MDX watcher (background)
     • Monitors /packages/**/*.{mdx,ts,tsx}
     • Auto-rebuilds docs.json on changes

2. Developer workflow:
   - Edit component in packages/nimbus/src/components/
   - Watcher detects change
   - Parser runs (parseMdx or parseTypes)
   - Observable proxy writes to docs.json
   - Vite HMR triggers
   - Jotai atoms recompute
   - UI updates instantly

3. No manual rebuild needed
```

### File Change Detection Flow
```
File saved: packages/nimbus/src/components/alert/alert.mdx
    ↓
Chokidar emits 'change' event
    ↓
parseMdx(filePath) executes
    ↓
Observable proxy detects mutation
    ↓
Debounced write to docs.json (300ms delay)
    ↓
Vite sees JSON change
    ↓
import("./../data/docs.json") invalidated
    ↓
documentationAtom refetches
    ↓
Derived atoms recompute (menuAtom, tocAtom, etc.)
    ↓
Components re-render
    ↓
Developer sees updated content
```

---

## 9. KEY FILES REFERENCE

### Entry Points
| File | Purpose |
|------|---------|
| `src/main.tsx` | Application entry point, mounts to DOM |
| `src/app.tsx` | Router provider wrapper |

### Routing
| File | Purpose |
|------|---------|
| `src/router/routes.tsx` | Route definitions with loaders |
| `src/routes/component-doc.tsx` | Component documentation page |
| `src/routes/category.tsx` | Category listing page |
| `src/routes/home.tsx` | Home page |

### Layout
| File | Purpose |
|------|---------|
| `src/layouts/app-layout.tsx` | Main application shell (Holy Grail) |
| `src/components/navigation/breadcrumb/` | Breadcrumb navigation |
| `src/components/navigation/menu/` | Left sidebar menu |
| `src/components/navigation/toc/` | Right sidebar table of contents |

### State Management
| File | Purpose |
|------|---------|
| `src/atoms/documentation.ts` | Loads docs.json async atom |
| `src/atoms/menu.ts` | Menu structure builder |
| `src/atoms/route.ts` | Active route tracker |
| `src/atoms/toc.ts` | TOC for active document |

### Rendering
| File | Purpose |
|------|---------|
| `src/components/document-renderer/` | MDX rendering engine |
| `src/components/document-renderer/mdx-string-renderer.tsx` | Runtime MDX evaluator |
| `src/components/document-renderer/components/` | Custom MDX components |
| `src/components/document-renderer/components/props-table/` | Component API table generator |

### Build Pipeline
| File | Purpose |
|------|---------|
| `scripts/build.ts` | Build orchestrator |
| `scripts/doc-generation/parse-mdx.ts` | MDX parser with frontmatter |
| `scripts/doc-generation/parse-types.ts` | TypeScript props extractor |
| `scripts/doc-generation/filter-props.ts` | Props filtering logic |
| `scripts/doc-generation/watcher.tsx` | Development file watcher |

### Configuration
| File | Purpose |
|------|---------|
| `vite.config.ts` | Build configuration and chunking strategy |
| `vite-plugins/vite-plugin-fs-api.ts` | Dev file system API |
| `package.json` | Scripts and dependencies |

---

## 10. DATA FLOW DIAGRAMS

### Build Time Flow
```
Source Files
├── packages/**/*.mdx
│   ↓ parseMdx()
│   ├→ Extract frontmatter (gray-matter)
│   ├→ Generate TOC (remark-flexible-toc)
│   ├→ Calculate route (menuToPath)
│   └→ Validate (Zod)
│
├── packages/**/*.ts(x)
│   ↓ parseTypes()
│   ├→ Parse with react-docgen-typescript
│   ├→ Filter props (shouldFilterProp)
│   └→ Enrich with JSDoc tags
│
└── Generated Artifacts
    ├── src/data/docs.json              # All documentation
    ├── src/data/types.json             # Component props
    ├── src/data/route-manifest.json    # Route index
    └── src/data/routes/*.json          # Individual routes
```

### Runtime Navigation Flow
```
User clicks link or types URL
    ↓
Browser location changes
    ↓
React Router detects route change
    ↓
Route loader executes (componentDocLoader)
    ↓
Loader looks up route in manifest
    ↓
Dynamic import of route JSON chunk
    ↓
activeRouteAtom syncs with location
    ↓
useActiveDoc() looks up in documentationAtom
    ↓
DocumentRenderer receives:
    - meta (frontmatter)
    - content (MDX string)
    ↓
MDXStringRenderer evaluates MDX
    ↓
Components render with custom mappings
    ↓
Page displayed to user
```

### Search Flow
```
documentationAtom loaded
    ↓
searchableDocItemsAtom derives index:
    - Extract meta fields
    - Strip markdown from MDX
    - Weight fields (title 3x, description 2x, etc.)
    ↓
Fuse.js initializes with index
    ↓
User types in search input
    ↓
searchQueryAtom updates
    ↓
useSearch() hook executes Fuse.js query
    ↓
Results filtered by relevance score
    ↓
Search dropdown displays results
    ↓
User clicks result → Navigate to route
```

### State Dependency Graph
```
documentationAtom (async import docs.json)
    ├→ menuAtom
    │   └→ buildMenu()
    │       ├→ addFirstLevelItems()
    │       ├→ addNestedItems()
    │       └→ orderMenuItems()
    │
    ├→ tocAtom
    │   └→ activeDoc.meta.toc
    │
    └→ searchableDocItemsAtom
        └→ stripMarkdown(content)

activeRouteAtom (sync with location)
    └→ useActiveDoc()
        └→ Find doc matching route
```

---

## 11. PERFORMANCE OPTIMIZATIONS

### Code Splitting Strategy
1. **Route-based splitting**: Each route is a separate chunk
2. **Vendor chunking**: Large libraries separated (React, Nimbus, MDX, etc.)
3. **Lazy loading**: Routes loaded on demand
4. **Parallel loading**: Independent chunks loaded simultaneously

### Data Loading
1. **Route loaders**: Prefetch data before navigation
2. **Async atoms**: Lazy load JSON artifacts
3. **JSON chunking**: Individual route data separated
4. **Memoization**: Derived atoms cached until dependencies change

### Runtime Performance
1. **Intersection Observer**: Efficient TOC active heading tracking
2. **Debounced writes**: File watcher batches updates (300ms)
3. **Virtual scrolling**: Large lists (future enhancement)
4. **Search indexing**: Built once, reused for all searches

### Build Optimizations
1. **Tree shaking**: Dead code elimination
2. **Minification**: Terser for JS, cssnano for CSS
3. **Compression**: Brotli + Gzip
4. **CSS splitting**: Separate CSS chunks per route
5. **Bundle analysis**: Size monitoring with rollup-plugin-visualizer

---

## 12. SUMMARY

The Nimbus docs app is a sophisticated documentation system that demonstrates:

### Key Architectural Decisions

1. **Build-time Processing**
   - MDX parsing with frontmatter extraction
   - TypeScript props extraction with react-docgen-typescript
   - JSON artifact generation for runtime consumption

2. **Runtime Optimization**
   - React Router v7 with data loaders
   - Jotai atomic state management
   - Code splitting and lazy loading
   - Fuzzy search with Fuse.js

3. **Developer Experience**
   - Hot reload during development
   - File system API for in-browser editing
   - Live code examples with react-live
   - Observable proxy pattern for automatic rebuilds

4. **User Experience**
   - Instant search across all documentation
   - Hierarchical navigation with breadcrumbs
   - Table of contents with active heading tracking
   - Responsive layout with sidebar navigation

### Technology Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Framework** | React 18, TypeScript |
| **Routing** | React Router v7 |
| **State** | Jotai (atomic state) |
| **Build** | Vite, Rollup |
| **MDX** | @mdx-js/mdx, gray-matter, remark |
| **Search** | Fuse.js |
| **Type Extraction** | react-docgen-typescript |
| **File Watching** | Chokidar |
| **Live Code** | react-live |
| **Styling** | Chakra UI v3, Nimbus components |

This architecture provides a robust, performant, and maintainable documentation system that scales with the Nimbus design system.
