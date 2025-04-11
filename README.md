# Nimbus Design System

![Nimbus Logo](https://placehold.co/840x270?text=Nimbus)

> A modern, extensible design system for building consistent, accessible user
> interfaces.

## 📚 Table of Contents

- [Overview](#-overview)
- [Repository Structure](#%EF%B8%8F-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development Workflow](#-development-workflow)
  - [Development Mode](#development-mode)
  - [Building the Project](#building-the-project)
  - [Creating New Components](#creating-new-components)
- [Project Management](#%EF%B8%8F-project-management)
  - [Initialize or Reset](#initialize-or-reset)
  - [Working with Tokens](#working-with-tokens)
- [Integration Guide](#-integration-guide)
  - [Testing Local Changes](#testing-local-changes)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

## 🔍 Overview

Nimbus is a comprehensive design system that provides a collection of reusable
components, icons, and design tokens for building consistent user interfaces.
This monorepo contains multiple packages and applications that work together to
provide a cohesive design system experience.

## 🏗️ Repository Structure

### Packages

| Package           | Description               | Purpose                                                |
| ----------------- | ------------------------- | ------------------------------------------------------ |
| **@nimbus/react** | Core UI component library | Provides React components for building user interfaces |
| **@nimbus/icons** | Icon library              | SVG files wrapped as React components                  |
| **tokens**        | Design tokens             | Color, spacing, typography, and other design variables |
| **color-tokens**  | Brand colors              | Brand-specific color definitions                       |

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
> It is advisable to run the `repo:init` command after every
> branch-switch. The command gets rid of all `node_modules`- & `dist`-folders,
> reinstalls dependencies and rebuilds all packages.

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

Nimbus provides a scaffolding tool to generate new component templates:

```bash
pnpm component:new
```

This interactive command will:

1. Prompt you for the component name
2. Generate all necessary files with appropriate templates
3. Set up the component structure following our best practices

The generated files include:

- Component implementation
- TypeScript types
- Documentation (MDX)
- Story files for visual testing
- Index exports

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

### Testing Local Changes

To test your local Nimbus changes in another repository before publishing:

1. **Build Nimbus locally**:

   ```bash
   pnpm build
   ```

2. **Create a global link**:

   ```bash
   pnpm link --global
   ```

3. **Connect the target project to your local Nimbus**:

   Navigate to the target repository and run:

   ```bash
   pnpm link --global nimbus
   ```

   > **Important**: In a monorepo target, run this command within the specific
   > application directory where you want to use Nimbus.

4. **Import and use Nimbus components**:

   ```typescript
   import {
     Box,
     Button,
     NimbusProvider,
   } from 'nimbus'; // After linking, this will use your local version

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

5. **Update your local Nimbus**: After making changes to Nimbus, rebuild:

   ```bash
   pnpm build
   ```

   Changes will be immediately reflected in the consuming application.

6. **Unlink when finished**:

   ```bash
   # In the target project:
   pnpm unlink nimbus

   # In the Nimbus repository:
   pnpm unlink --global
   ```

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
