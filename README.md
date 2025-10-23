# Nimbus Design System

![Nimbus Logo](./apps/docs/public/readme_cover.jpg)

> A modern, extensible design system for building consistent, accessible user
> interfaces.

## 📚 Table of Contents

- [Nimbus Design System](#nimbus-design-system)
  - [📚 Table of Contents](#-table-of-contents)
  - [🔍 Overview](#-overview)
  - [🏗️ Repository Structure](#️-repository-structure)
    - [Packages](#packages)
    - [Applications](#applications)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [💻 Development Workflow](#-development-workflow)
    - [Development Mode](#development-mode)
    - [Building the Project](#building-the-project)
      - [Complete Build](#complete-build)
      - [Targeted Builds](#targeted-builds)
    - [Creating New Components](#creating-new-components)
  - [🧪 Testing](#-testing)
    - [Test Types](#test-types)
    - [Running Tests](#running-tests)
    - [Testing Workflow (IMPORTANT)](#testing-workflow-important)
    - [Common Testing Patterns](#common-testing-patterns)
  - [🛠️ Project Management](#️-project-management)
    - [Initialize or Reset](#initialize-or-reset)
    - [Working with Tokens](#working-with-tokens)
  - [🔄 Integration Guide](#-integration-guide)
    - [Testing Local Nimbus Changes in Other Repositories](#testing-local-nimbus-changes-in-other-repositories)
  - [👥 Contributing](#-contributing)
  - [❓ Troubleshooting](#-troubleshooting)

## 🔍 Overview

Nimbus is a comprehensive design system that provides a collection of reusable
components, icons, and design tokens for building consistent user interfaces.
This monorepo contains multiple packages and applications that work together to
provide a cohesive design system experience.

## 🏗️ Repository Structure

### Packages

| Package                         | Description               | Purpose                                                |
| ------------------------------- | ------------------------- | ------------------------------------------------------ |
| **@commercetools/nimbus**       | Core UI component library | Provides React components for building user interfaces |
| **@commercetools/nimbus-icons** | Icon library              | SVG files wrapped as React components                  |
| **tokens**                      | Design tokens             | Color, spacing, typography, and other design variables |
| **color-tokens**                | Brand colors              | Brand-specific color definitions                       |

### Applications

| Application | Description        | Purpose                                                                                          |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| **docs**    | Documentation site | Interactive documentation for all Nimbus packages, auto-generated from MDX files in the packages |

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v22.14.0+
- **PNPM**: v9.12.3+

### Installation

All commands should be run from the repository root.

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/nimbus.git
   cd nimbus
   ```

2. Initialize the repository:

   ```bash
   pnpm nimbus:init
   ```

> [!TIP]  
> It is advisable to run the `repo:init` command after every branch-switch. The
> command gets rid of all `node_modules`- & `dist`-folders, reinstalls
> dependencies and rebuilds all packages.

## 💻 Development Workflow

### Development Mode

Start the development environment with the following command:

```bash
pnpm start
```

This will start both the documentation app and Storybook in parallel:

- Documentation app: http://localhost:5173/
- Storybook: http://localhost:6006/

If you prefer to run just one of the applications:

```bash
# Start only the documentation app
pnpm start:docs

# Start only Storybook
pnpm start:storybook
```

### Building the Project

#### Complete Build

Build all packages and applications:

```bash
pnpm build
```

#### Targeted Builds

Build only specific parts of the system:

```bash
# Build only the packages (not the docs application)
pnpm build:packages

# Build only the documentation application
pnpm build:docs

# Build only the design tokens
pnpm build:tokens
```

### Creating New Components

For detailed guidance on creating new components, see the
[Component Guidelines](./docs/component-guidelines.md).

## 🧪 Testing

Nimbus uses Vitest for testing with two distinct test types that serve different
purposes.

### Test Types

#### 1. Storybook Tests (Component Tests)

- **Purpose**: Test component behavior, interactions, and visual states
- **Environment**: Real browser (headless Chromium with Playwright)
- **Use for**: ALL component testing - buttons, forms, dialogs, menus, etc.
- **Location**: `*.stories.tsx` files with `play` functions
- **Speed**: Slower (~seconds per story)

#### 2. Unit Tests

- **Purpose**: Test utility functions and React hooks in isolation
- **Environment**: JSDOM (fast, simulated browser environment)
- **Use for**: Pure functions, custom hooks, validators, formatters
- **Location**: `*.spec.ts` or `*.spec.tsx` files
- **Speed**: Very fast (~milliseconds per test)

### Running Tests

```bash
# Run all tests (unit + Storybook)
pnpm test

# Run only unit tests (fast)
pnpm test:unit

# Run only Storybook tests (slower, browser-based)
pnpm test:storybook

# Run specific test file
pnpm test packages/nimbus/src/components/button/button.stories.tsx

# Run tests with minimal console output
pnpm test --silent

# Run tests in watch mode (unit tests only)
pnpm test:unit --watch

# Run with coverage
pnpm test --coverage
```

### Testing Workflow (IMPORTANT)

> [!IMPORTANT] **Storybook tests run against the BUILT bundle, not source
> files.**

#### Why Building is Required

The Storybook configuration operates in two distinct modes:

| Mode            | Command                | Imports From           | Purpose                   |
| --------------- | ---------------------- | ---------------------- | ------------------------- |
| **Development** | `pnpm start:storybook` | Source files (`src/`)  | Live editing with HMR     |
| **Testing**     | `pnpm test:storybook`  | Built bundle (`dist/`) | Test production-like code |

During testing, imports resolve to the built bundle in `packages/nimbus/dist/`.
This ensures:

- Tests validate actual published behavior
- Tests match how consumers use the package
- Tests catch build-related issues

#### Correct Testing Workflow

```bash
# ❌ WRONG - Tests will use stale code
# Make changes to component
pnpm test:storybook  # Tests old code!

# ✅ CORRECT - Build first, then test
# 1. Make changes to component
# 2. Build the package
pnpm build:packages

# 3. Run tests
pnpm test:storybook

# Or combine in one command
pnpm build:packages && pnpm test:storybook
```

#### Detection Logic

The system automatically detects test mode via:

- `configType === 'DEVELOPMENT'` - Set by Vite based on command
- `VITEST_WORKER_ID` - Set automatically by Vitest when running tests
- `VITEST=true` - Manual override for forcing test mode

**Manual Override Example:**
```bash
# Force test mode (use built bundle) even in development
VITEST=true pnpm start:storybook

# Normal development mode (use source files with HMR)
pnpm start:storybook
```

When test mode is detected, Storybook uses the built bundle instead of source files.

**Developer Visibility:**

Storybook logs which mode is active on startup:
- `[Storybook] Running in DEVELOPMENT (HMR enabled, using source files)` - Development mode with live reload
- `[Storybook] Running in PRODUCTION/TEST (using built bundle)` - Testing or production mode

This helps confirm whether your changes require a build before testing.

### Common Testing Patterns

```bash
# Quick iteration cycle for component changes
pnpm --filter @commercetools/nimbus build && pnpm test:storybook

# Test specific component
pnpm --filter @commercetools/nimbus build && pnpm test packages/nimbus/src/components/menu/menu.stories.tsx

# Unit tests don't need building (they import source directly)
pnpm test:unit --watch

# Full test suite
pnpm test
```

#### Common Pitfalls

| Issue                                | Solution                                    |
| ------------------------------------ | ------------------------------------------- |
| ❌ Tests pass but changes don't show | Build the package before testing            |
| ❌ Tests fail after working locally  | Ensure `pnpm build` was run                 |
| ❌ Expecting HMR during tests        | Use `pnpm start:storybook` for live preview |
| ✅ Build → Test → Iterate            | This is the correct workflow                |

## 🛠️ Project Management

### Initialize or Reset

To initialize or reset the entire project:

```bash
# Full initialization (reset, install dependencies, build)
pnpm nimbus:init

# Reset only (remove node_modules and dist folders)
pnpm nimbus:reset
```

### Working with Tokens

Generate design tokens for the system:

```bash
pnpm generate:tokens
```

This command processes the token source files and outputs them in multiple
formats:

- CSS custom properties
- TypeScript definitions
- Component-specific token files

## 🔄 Integration Guide

### Testing Local Nimbus Changes in Other Repositories

Want to test your local Nimbus code changes in another repo (like Merchant
Center) _before_ publishing? `pnpm link --global` lets you do this by creating a
direct connection (a symlink) between your local Nimbus and the other repo.

Follow these steps:

1.  **Build Nimbus:** Make sure Nimbus and its internal packages have been built
    recently with your latest changes. (Via `pnpm build` command in the Nimbus
    repo).

2.  **Register Nimbus Locally:** In your Nimbus design system repository (at the
    root folder), run:

    ```bash
    pnpm link --global
    ```

    - **What this does:** This tells your computer where your local Nimbus code
      lives and registers it globally under its package name (`nimbus`). Think
      of it like a temporary, local "publishing" step just for your machine.

3.  **Connect Your Project to Local Nimbus:** In the target repository where you
    want to _use_ your local Nimbus (such as Merchant Center), run:

    ```bash
    pnpm link --global nimbus
    ```

    - **Important:** You'll need to run this command within the application you
      want to use it in rather than at the root level - for example, in the
      `application-project-settings` directory in the Merchant Center repo.
    - **What this does:** This connects _this specific project_ to the local
      Nimbus you just registered. It creates a special link (symlink) inside
      this project's `node_modules` folder that points directly to your local
      Nimbus code.
    - _Verification:_ You can peek inside the target repo's `node_modules`
      folder; you should see `nimbus` listed (often visually indicated as a
      link).

4.  **Import and Use:** Now, in your target repo's code, you can import and use
    Nimbus components.

````typescript
    // Correct way to import after linking:
    import {
      Box,
      Avatar,
      NimbusProvider,
      Button,
      LoadingSpinner,
    } from '../../../node_modules/nimbus/packages/nimbus'; // <-- This is a relative path to the symlink - you'll have to adjust the depth as needed.
    // Use the components...
    function MyComponent() {
      return (
        <NimbusProvider>
          <Box>
            <Button>Hello Nimbus!</Button>
          </Box>
        </NimbusProvider>
      );
    }
    ```
5.  **Testing changes**: Make changes to your local Nimbus code, then run
    `pnpm build` in Nimbus to rebuild. You should now see changes reflected in
    the target repo.

6. **Unlink when finished**:

   ```bash
   # In the target project:
   pnpm unlink -g nimbus

   # In the Nimbus repository:
   pnpm unlink --global
````

## 👥 Contributing

We welcome contributions from all team members. To contribute:

1. Create a new branch for your feature or fix
2. Make your changes
3. Write or update tests
4. Update documentation
5. Submit a pull request

Please follow our coding standards and commit message conventions.

## ❓ Troubleshooting

| Problem                                       | Solution                                                        |
| --------------------------------------------- | --------------------------------------------------------------- |
| Component styles not updating                 | Make sure you've rebuilt the tokens with `pnpm build:tokens`    |
| Documentation site not showing latest changes | Restart the development server with `pnpm start`                |
| Build errors after pulling latest changes     | Try running `pnpm nimbus:init` to reset, reinstall, and rebuild |

For additional help, please contact the Nimbus team or submit an issue in our
repository.
