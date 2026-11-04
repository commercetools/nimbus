# Nimbus Documentation Site

## App Overview

The `docs` app is a React SPA (Vite-based) providing:

- Interactive component documentation with live examples
- Auto-generated API references from TypeScript types
- Engineering documentation and guidelines
- Search functionality for components and content
- Full Storybook integration

## Development Commands

### Development Server

```bash
# Start docs dev server from root (recommended)
pnpm start:docs

# Or start directly from app
pnpm --filter docs dev
```

Runs at http://localhost:5173

### Building

```bash
# Build docs from root (recommended)
pnpm build:docs

# Or step-by-step from root
pnpm --filter docs build:docs    # Generate docs data
pnpm --filter docs build:app     # Build Vite app
pnpm --filter docs copy-index    # Copy for SPA routing
```

## Architecture

### Build Process

The docs site has a multi-step build process:

1. **Documentation Generation** (`build:docs` script)
   - Scans `packages/nimbus` for components
   - Extracts TypeScript types using `@commercetools/nimbus-docs-build`
   - Processes `.mdx` files for each component
   - Generates JSON data files for consumption by the app

2. **App Build** (`build:app` script)
   - Builds Vite React application
   - Bundles all assets and dependencies
   - Outputs static files to `dist/`
   - Applies production optimizations

3. **Post-Processing** (`copy-index` script)
   - Copies `index.html` to `404.html`
   - Enables SPA routing on static hosts
   - Ensures all routes work after deployment

### Directory Structure

```
apps/docs/
├── scripts/
│   ├── build.ts       # Documentation generation script
│   └── dev.ts         # Development server with watch mode
├── src/
│   ├── components/    # Doc site UI components
│   ├── pages/         # Page components and routes
│   ├── content/       # Static content and markdown
│   └── App.tsx        # Main app component
├── public/            # Static assets
├── dist/              # Build output (generated)
└── package.json
```

## Documentation Authoring

### Component Documentation

Component docs live in the component's directory in the nimbus package:

```
packages/nimbus/src/components/[component]/[component].mdx
```

Example: `packages/nimbus/src/components/button/button.mdx`

### MDX Format

A documentation page is an MDX file with front matter. The schema is in
`packages/nimbus-docs-build/src/schemas/mdx-document.ts`.

````mdx
---
id: Components-Button
title: Button
description: Buttons let people start an action.
order: 1
menu:
  - Components
  - Buttons
  - Button
tags:
  - component
---

The Button component starts an action.

```jsx live-dev
const App = () => <Button variant="solid">Save</Button>;
```
````

### Frontmatter Fields

Required fields:

- `id` - Unique id of the page; `related` refers to pages by id
- `title` - Page title; search gives it the most weight
- `description` - One sentence; shown in search results and overview cards
- `menu` - Path in the navigation; the route is the slug of this path
- `tags` - Search words

Optional fields (selection):

- `order` - Position among its siblings; a missing or `0` order becomes 999
- `illustration` - Name (or list of names) of `<name>.illustration.ts` files; an
  unknown name fails the build
- `related` - Ids of related pages; links work in both directions, and an
  unknown id fails the build
- `layout` - `app-frame` (default), `wide` or `no-sidebar`

### Live Code Examples

Use a `jsx live` or `jsx live-dev` code block for interactive examples. The
block defines an `App` component, and the editor renders it with react-live.
`live-dev` blocks have a switch between the preview and the code.

All Nimbus exports and `Icons` are in scope, so import lines are optional.
Import lines work as in an app, also over several lines and with `as` aliases:
the editor resolves them from the modules listed in
`components/document-renderer/components/live-code-editor/live-code-editor.tsx`
(`liveModules`). An import from any other module shows an error.

### Engineering Documentation

Engineering docs (like this file) live in `docs/` at repo root:

- `docs/component-guidelines.md` - Component development guide
- `docs/file-type-guidelines/*.md` - Standards for each file type
- `docs/component-templates/*.tsx` - Boilerplate templates
- `docs/file-review-protocol.md` - Review checklist

These are NOT processed by the docs site build - they're reference material for
developers and AI assistants.

## Dependencies

This app depends on ALL nimbus packages:

- `@commercetools/nimbus` - Components to document
- `@commercetools/nimbus-docs-build` - Documentation generation tooling
- `@commercetools/nimbus-icons` - Icons for doc site UI
- `@commercetools/nimbus-tokens` - Styling tokens
- `@commercetools/nimbus-i18n` - Translations for doc site

**Build order:** tokens → all packages → docs app

## Development Workflow

### 1. Start Development

```bash
# From root - starts both Storybook and docs
pnpm start

# Or just docs
pnpm start:docs
```

The dev server watches for changes and hot-reloads automatically.

The dev server also shows the [Agentation](https://www.agentation.com/) toolbar
(button at the bottom right). Use it to click on page elements, add notes, and
copy the result as context for an AI agent. It is loaded in `src/main.tsx` only
when `import.meta.env.DEV` is true, so production builds do not include it.

### 2. Add/Edit Documentation

#### For Existing Component

1. Edit MDX file in `packages/nimbus/src/components/[component]/[component].mdx`
2. Changes reflect immediately via HMR (no rebuild needed)

#### For New Component

1. Create component `.mdx` file in component directory
2. Add frontmatter with required fields
3. Build docs: `pnpm --filter docs build:docs`
4. Component appears in docs site navigation

### 3. Verify Documentation

- **Props table**: Auto-generated from TypeScript interfaces
- **Type info**: Extracted from component `.types.ts` file
- **Live examples**: Test in browser to ensure they work

### 4. Build for Production

```bash
pnpm build:docs
```

Verify build output in `apps/docs/dist/`.

## Search Functionality

Search uses Fuse.js for fuzzy searching across:

- Component names and descriptions
- Documentation content
- API references and prop types

Search index is generated during `build:docs` step.

## Common Tasks

### Add a New Doc Page

1. Create MDX file in appropriate component directory
2. Add frontmatter metadata
3. Run `pnpm --filter docs build:docs`
4. Page appears in navigation

### Update Component Props Documentation

Props are auto-extracted from TypeScript types:

1. Update component `.types.ts` file with JSDoc comments
2. Run `pnpm --filter docs build:docs`
3. Props table updates automatically

Example:

```typescript
export interface ButtonProps {
  /**
   * The button variant style
   * @default "secondary"
   */
  variant?: "primary" | "secondary" | "danger";
}
```

### Debug Documentation Build

If documentation doesn't appear:

1. Check MDX file exists with correct frontmatter
2. Run `pnpm --filter docs build:docs` to regenerate
3. Check console for build errors
4. Verify component is exported from `packages/nimbus/src/index.ts`

### Preview Production Build Locally

```bash
# Build the docs
pnpm build:docs

# Serve the dist folder (use any static server)
cd apps/docs
npx serve dist
```

## Deployment

Docs are deployed via Vercel:

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests

Each PR gets a preview deployment URL for review.
