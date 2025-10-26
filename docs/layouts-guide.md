# Multi-Layout System Guide

The docs app now supports multiple layout configurations that can be specified
on a per-document basis in MDX files.

## Available Layouts

### 1. `app-frame` (Default)

The full application frame with:

- Top navigation bar
- Breadcrumb navigation
- Left sidebar (main navigation menu)
- Main content area
- Right sidebar (table of contents)

This is the default layout that will be used if no `layout` property is
specified.

### 2. `no-sidebar`

A simplified layout without sidebars:

- Top navigation bar
- Breadcrumb navigation
- Main content area (full width, no sidebars)

Perfect for full-width content, landing pages, or documentation that doesn't
need navigation context.

## Usage

Add the `layout` property to your MDX file's frontmatter:

```mdx
---
id: MyDocument
title: My Document Title
description: A brief description
order: 1
menu:
  - Category
  - Page Name
layout: no-sidebar
tags:
  - example
---

Your content here...
```

## Examples

### Using the default layout (app-frame)

```mdx
---
id: ComponentDocs
title: Component Documentation
description: Detailed component documentation
order: 10
menu:
  - Components
  - Button
# layout property omitted - defaults to 'app-frame'
tags:
  - components
---

Component documentation with full navigation...
```

### Using the no-sidebar layout

```mdx
---
id: LandingPage
title: Welcome
description: Landing page
order: 1
menu:
  - Home
layout: no-sidebar
tags:
  - landing
---

Full-width landing page content...
```

## Adding New Layouts

To add a new layout type:

1. Add the layout name to `layoutTypes` in
   `/apps/docs/src/schemas/mdx-document.ts`
2. Create a new layout component in `/apps/docs/src/layouts/`
3. Add the layout case to the switch statement in
   `/apps/docs/src/layouts/dynamic-layout.tsx`
4. Export the layout from `/apps/docs/src/layouts/index.ts`

## Technical Details

- Layout selection happens dynamically at runtime based on the current route
- The `DynamicLayout` component reads the active document's metadata and renders
  the appropriate layout
- All layouts use the same content rendering system (DocumentRenderer)
- The layout property is optional and validated by Zod schema
- TypeScript types are automatically generated from the schema
