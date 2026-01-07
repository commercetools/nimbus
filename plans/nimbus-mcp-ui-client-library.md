# Nimbus MCP-UI Client Library

## Overview

This document outlines the design for a client-side library that enables consuming applications to render Nimbus components from an MCP-UI server with minimal configuration.

**Goal:** Start with a batteries-included Option A (pre-wired Nimbus components) while architecting to avoid breaking changes when implementing Option B (custom component support) in the future.

---

## Current POC Architecture

The MCP-UI POC in `apps/mcp-ui-poc/` demonstrates the full pattern:

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. AI invokes tool (e.g., createButton)                                     │
│ 2. Server creates Remote DOM element with properties                        │
│ 3. Remote DOM environment detects mutations, serializes them                │
│ 4. WebSocket broadcasts mutations to connected clients                      │
│ 5. Client receives mutations, updates RemoteReceiver state                  │
│ 6. React components re-render with new props                                │
│ 7. User interacts (click, input, etc.)                                      │
│ 8. Client sends event back to server via WebSocket                          │
│ 9. Server processes event, may trigger new tool calls                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| Protocol | `@modelcontextprotocol/sdk` | MCP protocol implementation |
| Serialization | `@remote-dom/core` | Server-side DOM mutation tracking |
| Rendering | `@remote-dom/react` | Client-side React integration |
| Components | `@commercetools/nimbus` | Design system components |
| Transport | WebSocket | Real-time mutation streaming |

---

## Current Client Implementation Patterns

### Component Registry

Located in `remote-dom-renderer.tsx`, the registry maps HTML custom element names to React components:

```typescript
const componentRegistry: Record<string, React.ComponentType> = {
  "nimbus-badge": Nimbus.Badge,
  "nimbus-text": Nimbus.Text,
  "nimbus-button": ButtonWrapper,      // Custom wrapper for events
  "nimbus-data-table": DataTableWrapper, // Custom wrapper for events
  "nimbus-form-field-root": FormFieldRootWrapper, // Prop injection
  // ... etc
};
```

### Two-Level Wrapper System

1. **Simple wrapper** - Spreads `styleProps` onto component
2. **Custom wrapper** - Handles events, data transformation, or prop injection

```typescript
// Simple wrapper pattern
const simple = (Component, isVoid = false) => (props) => {
  const { styleProps, children, ...rest } = props;
  const merged = { ...rest, ...styleProps };
  return isVoid ? <Component {...merged} /> : <Component {...merged}>{children}</Component>;
};

// Custom wrapper pattern (Button example)
const ButtonWrapper = (props) => {
  const uri = useUri();
  const { styleProps, id, onPress, ...rest } = props;

  const handlePress = id
    ? () => {
        const formData = extractFormData(buttonRef.current);
        sendClientEvent("buttonClick", uri, { buttonId: id, formData }, false);
        onPress?.();
      }
    : onPress;

  return <Nimbus.Button {...rest} {...styleProps} onPress={handlePress} ref={buttonRef} />;
};
```

### Event System

Events are sent via WebSocket using a generic message format:

```typescript
interface ClientEventMessage {
  type: 'tool';
  payload: {
    toolName: string;  // e.g., "buttonClick", "dataTableRowClick"
    params: {
      uri: string;
      // event-specific data
      buttonId?: string;
      formData?: Record<string, string>;
      rowId?: string;
    };
  };
  messageId?: string;  // For request-response pattern
}
```

### Prop Injection System

For compound components that use React context (like FormField), children must be reconstructed inside the parent's context:

```typescript
const FormFieldRootWrapper = (props) => {
  const { styleProps, children, ...rest } = props;
  const componentMap = createComponentMapForPropInjection();

  // Reconstruct children through renderElement() so they can
  // receive props injected via React.cloneElement from FormField.Root
  const reconstructed = React.Children.map(children, (child, index) => {
    const element = child.props.element;
    return element ? renderElement(element, index, componentMap, {}) : child;
  });

  return (
    <Nimbus.FormField.Root {...rest} {...styleProps}>
      {reconstructed}
    </Nimbus.FormField.Root>
  );
};
```

---

## Library Design

### Package Structure

```
@mcp-ui/core          # Connection, types, event protocol (no React, no components)
@mcp-ui/react         # React renderer, provider, hooks (component-agnostic)
@mcp-ui/nimbus        # Pre-wired Nimbus registry (batteries-included for Option A)
```

### Option A Consumer Usage

```tsx
import { McpUiProvider, RemoteRenderer } from '@mcp-ui/nimbus';

function App() {
  return (
    <McpUiProvider serverUrl="http://localhost:3001">
      <RemoteRenderer uri="/my-ui" />
    </McpUiProvider>
  );
}
```

### Future Option B Consumer Usage

```tsx
import { McpUiProvider, RemoteRenderer, registerComponent } from '@mcp-ui/react';
import { nimbusRegistry } from '@mcp-ui/nimbus';

// Use Nimbus components
Object.entries(nimbusRegistry).forEach(([name, config]) => {
  registerComponent(name, config);
});

// Add custom components (requires matching server-side element/tool definitions)
registerComponent('my-custom-widget', {
  component: MyCustomWidget,
  events: [{ eventName: 'widgetAction', propName: 'onAction' }],
});

function App() {
  return (
    <McpUiProvider serverUrl="http://localhost:3001">
      <RemoteRenderer uri="/my-ui" />
    </McpUiProvider>
  );
}
```

---

## Key Decisions for Forward Compatibility

### 1. Internal Registry from Day One

Use a registry internally even if not exposed in Option A:

```typescript
// @mcp-ui/react (internal)
const componentRegistry = new Map<string, ComponentConfig>();

export function registerComponent(name: string, config: ComponentConfig): void {
  componentRegistry.set(name, config);
}
```

When Option B is needed, simply export `registerComponent`.

### 2. Generic Event System in Core

Event names come from component config, not hardcoded:

```typescript
// @mcp-ui/core
export function sendClientEvent(
  eventName: string,              // Generic - passed from component config
  uri: string,
  params: Record<string, unknown>,
  waitForResponse?: boolean
): void | Promise<unknown> { ... }
```

### 3. Scalable Component Config Interface

Design the full interface now, even if not all features are exposed:

```typescript
interface ComponentConfig {
  /** The React component to render */
  component: React.ComponentType;

  /** Whether this is a void element (no children) */
  isVoid?: boolean;

  /** Declarative event handlers */
  events?: Array<{
    eventName: string;
    propName: string;
    extractPayload?: (event: unknown, props: unknown) => Record<string, unknown>;
    waitForResponse?: boolean;
  }>;

  /** Custom wrapper for complex cases */
  wrapper?: React.ComponentType;

  /** Prop injection config for compound components */
  propInjection?: {
    enabled: boolean;
    injectableChildren?: string[];
  };
}
```

### 4. Extensible Provider Props

Start minimal, add optional props later:

```typescript
interface McpUiProviderProps {
  serverUrl: string;
  children: React.ReactNode;
  // Future additions (non-breaking):
  sessionId?: string;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
  components?: Record<string, ComponentConfig>;  // Option B
}
```

### 5. Nimbus Package as Thin Wrapper

`@mcp-ui/nimbus` should be minimal - just wiring:

```typescript
// @mcp-ui/nimbus/index.ts

// Re-export core functionality
export { RemoteRenderer, useUri } from '@mcp-ui/react';

// Pre-configured provider
export { NimbusMcpProvider as McpUiProvider } from './provider';

// Export registry for Option B users who want to extend
export { nimbusRegistry } from './registry';
```

```typescript
// @mcp-ui/nimbus/provider.tsx
import { McpUiProvider as BaseProvider, registerComponent } from '@mcp-ui/react';
import { nimbusRegistry } from './registry';

let initialized = false;

export function NimbusMcpProvider(props: McpUiProviderProps) {
  if (!initialized) {
    Object.entries(nimbusRegistry).forEach(([name, config]) => {
      registerComponent(name, config);
    });
    initialized = true;
  }

  return <BaseProvider {...props} />;
}
```

---

## Files to Extract from POC

### To `@mcp-ui/core`

| Source File | Notes |
|-------------|-------|
| `use-remote-connection.ts` | Extract connection logic, remove React dependencies |
| `use-mutation-stream.ts` | WebSocket handling, message parsing |
| Types | `ClientEventMessage`, `ActionQueuedMessage`, etc. |

### To `@mcp-ui/react`

| Source File | Notes |
|-------------|-------|
| `remote-dom-renderer.tsx` | Keep generic renderer, extract component registry |
| `prop-injector.tsx` | Keep as-is |
| Provider component | New file |
| `useUri` hook | Context for URI access |

### To `@mcp-ui/nimbus`

| Source | Notes |
|--------|-------|
| Component wrappers | `ButtonWrapper`, `DataTableWrapper`, `FormFieldRootWrapper`, etc. |
| Registry definition | Map of element names to `ComponentConfig` |
| `NimbusMcpProvider` | Auto-registering provider wrapper |

---

## Migration Path

| Scenario | Import From | Breaking Change? |
|----------|-------------|------------------|
| Option A today | `@mcp-ui/nimbus` | - |
| Option B (custom + Nimbus) | `@mcp-ui/react` + `@mcp-ui/nimbus` | No |
| Option B (custom only) | `@mcp-ui/react` | No |
| Extend Nimbus registry | Import `nimbusRegistry`, add entries | No |

---

## Important Constraint

**Custom components require server-side definitions.** A client-side component registration is useless without:

1. Server-side element definition (custom HTML element)
2. Server-side tool definition (MCP tool that creates the element)

The library cannot provide custom component support in isolation - it requires either:
- A plugin system for the MCP-UI server
- Consumers running their own MCP-UI server

This is why Option A focuses solely on pre-wired Nimbus components where both sides are already defined.

---

## Component Support Matrix (Option A)

### Simple Components (styleProps spreading only)

- `nimbus-badge` → `Badge`
- `nimbus-text` → `Text`
- `nimbus-heading` → `Heading`
- `nimbus-stack` → `Stack`
- `nimbus-flex` → `Flex`
- `nimbus-image` → `Image` (void element)

### Interactive Components (event handling)

- `nimbus-button` → `ButtonWrapper` (buttonClick event, form data extraction)
- `nimbus-data-table` → `DataTableWrapper` (rowClick event, data parsing)
- `nimbus-drawer-root` → `DrawerRootWrapper` (drawerClose event)
- `nimbus-alert-dismiss-button` → `AlertDismissButtonWrapper` (dismiss event)

### Compound Components

- Card: `nimbus-card-root`, `nimbus-card-header`, `nimbus-card-body`, `nimbus-card-footer`
- Alert: `nimbus-alert-root`, `nimbus-alert-title`, `nimbus-alert-description`, `nimbus-alert-dismiss-button`
- Drawer: `nimbus-drawer-root`, `nimbus-drawer-content`, `nimbus-drawer-header`, etc.
- FormField: `nimbus-form-field-root` (prop injection), `nimbus-form-field-label`, `nimbus-form-field-input`, etc.

### Data Transformation Components

- `nimbus-money-input` → `MoneyInputWrapper` (value object construction)
- `nimbus-data-table` → `DataTableWrapper` (JSON parsing for columns/rows)

---

## Open Questions

1. **Versioning strategy** - How to handle Nimbus version compatibility?
2. **Server package** - Should `@mcp-ui/server` be part of this effort or separate?
3. **Testing** - How to test the library in isolation from a running server?
4. **Documentation** - Storybook integration for demonstrating components?
