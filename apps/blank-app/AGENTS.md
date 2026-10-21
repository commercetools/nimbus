# Blank App - Nimbus Example

## App Overview

The `blank-app` is a minimal example application demonstrating:

- How to consume Nimbus components in a real application
- Basic setup and configuration requirements
- Example component usage and patterns
- IntlProvider setup for internationalization
- Chakra UI theme provider integration

**This is a reference implementation** - not meant for production use. It serves
as a template and testing ground for Nimbus components.

## Purpose

Use this app to:

- **Test Nimbus components** in a real application context
- **Provide examples** for consumers integrating Nimbus
- **Validate package exports** and imports work correctly
- **Quick prototyping** of new component combinations
- **Integration testing** of the full component library

## Development

### Running the App

```bash
# Start dev server from root
pnpm --filter blank-app dev

# Or from the app directory
cd apps/blank-app
pnpm dev
```

Runs at http://localhost:5174 (or next available port)

### Building

```bash
# Build from root
pnpm --filter blank-app build

# Preview production build
pnpm --filter blank-app preview
```

## Structure

```
apps/blank-app/
├── src/
│   ├── App.tsx        # Main app component with example usage
│   ├── main.tsx       # Entry point with providers
│   └── vite-env.d.ts  # Vite type definitions
├── index.html         # HTML entry point
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── package.json
```

## What It Demonstrates

### 1. Basic Setup

The app shows the minimal setup required to use Nimbus:

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react/provider'
import { nimbusTheme } from '@commercetools/nimbus'
import messages from '@commercetools/nimbus-i18n/compiled-data/core.json'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IntlProvider locale="en" messages={messages}>
      <ChakraProvider value={nimbusTheme}>
        <App />
      </ChakraProvider>
    </IntlProvider>
  </React.StrictMode>
)
```

### 2. Component Usage

The app demonstrates using Nimbus components:

```typescript
// src/App.tsx
import { Button, Input, Select, Menu } from '@commercetools/nimbus'
import { ArrowForward, Settings } from '@commercetools/nimbus-icons'

function App() {
  return (
    <div>
      <h1>Nimbus Example App</h1>

      {/* Button examples */}
      <Button variant="primary">
        Primary Action
        <ArrowForward width={16} height={16} />
      </Button>

      {/* Form examples */}
      <Input placeholder="Enter text..." />

      {/* Menu example */}
      <Menu>
        <Menu.Trigger asChild>
          <Button variant="secondary">
            <Settings width={16} height={16} />
            Settings
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item value="profile">Profile</Menu.Item>
          <Menu.Item value="settings">Settings</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  )
}
```

### 3. Theme Customization

Shows how to customize the Nimbus theme (optional):

```typescript
import { createSystem, defaultConfig } from "@chakra-ui/react/styled-system";
import { nimbusRecipes } from "@commercetools/nimbus";

// Extend or customize Nimbus theme
const customTheme = createSystem(defaultConfig, {
  theme: {
    recipes: {
      ...nimbusRecipes,
      // Add custom recipes or overrides
    },
  },
});
```

### 4. Icon Usage

Demonstrates importing and using icons from nimbus-icons:

```typescript
import {
  AccountCircle,
  ArrowForward,
  Delete,
  Settings
} from '@commercetools/nimbus-icons'

// Use with explicit sizing
<AccountCircle width={24} height={24} />
<Delete width={16} height={16} color="red" />
```

## Using as a Template

To create a new app based on blank-app:

1. **Copy the directory structure**
2. **Update package.json** with your app name
3. **Modify src/App.tsx** with your components
4. **Add routing** if needed (React Router, TanStack Router, etc.)
5. **Add state management** if needed (Zustand, Redux, etc.)

## Dependencies

### Required Nimbus Packages

```json
{
  "dependencies": {
    "@commercetools/nimbus": "workspace:*",
    "@commercetools/nimbus-icons": "workspace:*",
    "@commercetools/nimbus-i18n": "workspace:*",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@chakra-ui/react": "^3.0.0"
  }
}
```

### Dev Dependencies

```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

## Common Use Cases

### Testing a New Component

1. Import the component in `src/App.tsx`
2. Add an example with various props
3. Run `pnpm --filter blank-app dev`
4. Test interactions and visual appearance

### Prototyping a Feature

1. Add your feature code to `src/`
2. Use Nimbus components as needed
3. Test integration and behavior
4. Extract patterns back to main app

### Validating Package Changes

After making changes to Nimbus packages:

1. Rebuild packages: `pnpm build:packages`
2. Run blank-app: `pnpm --filter blank-app dev`
3. Verify changes work in application context
4. Check for console errors or warnings

## Customization

### Adding More Examples

Edit `src/App.tsx` to add more component examples:

```typescript
function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <section>
        <h2>Buttons</h2>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </section>

      <section>
        <h2>Forms</h2>
        <Input placeholder="Email" type="email" />
        <Select>
          <option>Option 1</option>
          <option>Option 2</option>
        </Select>
      </section>

      {/* Add more sections */}
    </div>
  )
}
```

### Adding Routing

Install React Router (or your preferred router):

```bash
pnpm --filter blank-app add react-router-dom
```

Add routes in `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components" element={<Components />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### Adding Global Styles

Create `src/styles.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  background: #f5f5f5;
}
```

Import in `src/main.tsx`:

```typescript
import "./styles.css";
```

## Troubleshooting

### Component Not Found

If imports fail:

1. Ensure packages are built: `pnpm build:packages`
2. Check component is exported from `@commercetools/nimbus`
3. Verify package.json dependencies are correct
4. Try `pnpm install` to refresh symlinks

### Styles Not Applying

If components look unstyled:

1. Verify ChakraProvider wraps the app
2. Check nimbusTheme is imported and passed
3. Ensure tokens package is built: `pnpm build:tokens`
4. Clear cache: `rm -rf node_modules/.vite`

### IntlProvider Errors

If translations fail:

1. Verify IntlProvider wraps the app
2. Check messages import path is correct
3. Ensure i18n package is built:
   `pnpm --filter @commercetools/nimbus-i18n build`
4. Verify locale prop matches available messages

## Notes

- This app uses Vite for fast development and HMR
- It imports from workspace packages (not npm)
- Changes to Nimbus packages require rebuild to reflect here
- Useful for quick testing without running full docs site
- Can serve as starter template for new applications
