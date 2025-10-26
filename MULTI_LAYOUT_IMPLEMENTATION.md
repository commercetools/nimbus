# Multi-Layout System Implementation Summary

## Overview

Successfully implemented a multi-layout system for the docs app that allows MDX
files to specify their layout via frontmatter.

## Changes Made

### 1. Schema Updates

**File:** `/apps/docs/src/schemas/mdx-document.ts`

- Added `layoutTypes` constant with available layouts:
  `["app-frame", "no-sidebar"]`
- Added optional `layout` property to MDX document schema (defaults to
  "app-frame")

### 2. New Layout Component

**File:** `/apps/docs/src/layouts/no-sidebar-layout.tsx`

- Created new layout component without left and right sidebars
- Maintains top bar and breadcrumb navigation
- Provides full-width content area

### 3. Dynamic Layout Router

**File:** `/apps/docs/src/layouts/dynamic-layout.tsx`

- Created router component that selects layout based on active document metadata
- Uses `useActiveDoc()` hook to read layout property from MDX frontmatter
- Falls back to default `app-frame` layout if not specified

### 4. App Routing Update

**File:** `/apps/docs/src/app.tsx`

- Replaced hardcoded `AppLayout` with `DynamicLayout` component
- Enables runtime layout selection based on route

### 5. Type Exports

**File:** `/apps/docs/src/types/index.ts`

- Added `LayoutType` type export for TypeScript support
- Types are automatically inferred from Zod schema

### 6. Barrel Exports

**File:** `/apps/docs/src/layouts/index.ts`

- Created central export point for all layout components

### 7. Documentation

**Files:**

- `/docs/layouts-guide.md` - Comprehensive guide on using the multi-layout
  system
- `/packages/nimbus/src/docs/layout-example-no-sidebar.mdx` - Working example

## Usage

Add the `layout` property to any MDX file's frontmatter:

```yaml
---
id: MyPage
title: My Page
description: Description
order: 1
menu:
  - Category
  - Page
layout: no-sidebar # Options: "app-frame" (default) | "no-sidebar"
tags:
  - example
---
```

## Available Layouts

### app-frame (Default)

Full application frame with left sidebar (menu), right sidebar (TOC), top bar,
and breadcrumbs.

### no-sidebar

Simplified layout with only top bar, breadcrumbs, and full-width content area.

## Testing

To test the implementation:

1. Start the dev server:

   ```bash
   pnpm run dev
   ```

2. Navigate to the example page at `/examples/no-sidebar-layout`

3. Create your own MDX files with different layout values

## Adding New Layouts

To add a new layout type:

1. Add the layout name to `layoutTypes` in
   `/apps/docs/src/schemas/mdx-document.ts`
2. Create a new layout component in `/apps/docs/src/layouts/`
3. Add the layout case to the switch statement in
   `/apps/docs/src/layouts/dynamic-layout.tsx`
4. Export the layout from `/apps/docs/src/layouts/index.ts`

## Technical Details

- Layout selection happens at runtime based on the current route
- The schema validates layout values using Zod
- TypeScript types are automatically generated from the schema
- The build process (`pnpm run build:docs`) will validate all MDX files
- Development mode watches for changes and automatically reprocesses files
- No linter errors introduced

## Files Modified/Created

**Modified:**

- `/apps/docs/src/schemas/mdx-document.ts`
- `/apps/docs/src/app.tsx`
- `/apps/docs/src/types/index.ts`

**Created:**

- `/apps/docs/src/layouts/no-sidebar-layout.tsx`
- `/apps/docs/src/layouts/dynamic-layout.tsx`
- `/apps/docs/src/layouts/index.ts`
- `/docs/layouts-guide.md`
- `/packages/nimbus/src/docs/layout-example-no-sidebar.mdx`
- `/MULTI_LAYOUT_IMPLEMENTATION.md` (this file)
