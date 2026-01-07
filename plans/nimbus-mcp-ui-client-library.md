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
@mcp-ui/langchain     # LangChain/LangGraph integration adapter (optional)
```

### Package Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                        Consumer App                              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ @mcp-ui/nimbus│    │@mcp-ui/lang-  │    │  (Custom)     │
│               │    │  chain        │    │               │
│ - Registry    │    │               │    │ - onAction    │
│ - Wrappers    │    │ - Helpers     │    │   handler     │
│ - Provider    │    │ - Stream hook │    │               │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └─────────┬──────────┴────────────────────┘
                  │
                  ▼
        ┌───────────────────┐
        │   @mcp-ui/react   │
        │                   │
        │ - McpUiProvider   │
        │ - RemoteRenderer  │
        │ - useActionDispatch│
        │ - Wrapper factory │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │   @mcp-ui/core    │
        │                   │
        │ - Types           │
        │ - Connection      │
        │ - Protocol        │
        └───────────────────┘
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

## Event Handling Architecture

The library uses a **dual-path event system** that separates:
1. **Agent Actions** - User interactions that need LLM/orchestrator processing (button clicks, form submissions)
2. **Internal DOM Sync** - Automatic state synchronization that doesn't require LLM involvement (drawer close, accordion expand)

### Action Types

Actions are typed per-component to ensure type safety and enable proper payload handling:

```typescript
// @mcp-ui/core - Base action interface
export interface BaseAction {
  type: string;
  componentId: string;
  uri: string;
  timestamp: number;
}

// @mcp-ui/nimbus - Typed actions for each component
export interface ButtonAction extends BaseAction {
  type: 'button.click';
  payload: {
    buttonId: string;
    formData?: Record<string, string>;
  };
}

export interface RowSelectAction extends BaseAction {
  type: 'dataTable.rowSelect';
  payload: {
    rowId: string;
    rowData: Record<string, unknown>;
  };
}

export interface FormSubmitAction extends BaseAction {
  type: 'form.submit';
  payload: {
    formId: string;
    formData: Record<string, string>;
  };
}

export interface AlertDismissAction extends BaseAction {
  type: 'alert.dismiss';
  payload: {
    alertId: string;
  };
}

// Union type for all Nimbus actions
export type NimbusAction =
  | ButtonAction
  | RowSelectAction
  | FormSubmitAction
  | AlertDismissAction;
```

### Updated ComponentConfig Interface

The `ComponentConfig` interface defines actions declaratively, enabling the generic wrapper factory to create event handlers automatically:

```typescript
// @mcp-ui/react
interface ComponentConfig<TAction extends BaseAction = BaseAction> {
  /** The React component to render */
  component: React.ComponentType;

  /** Whether this is a void element (no children) */
  isVoid?: boolean;

  /** Declarative action definitions */
  actions?: Array<{
    /** Action type for discrimination (e.g., 'button.click') */
    actionType: TAction['type'];
    /** React prop name that triggers this action (e.g., 'onPress') */
    triggerProp: string;
    /** Extract typed payload from event and props */
    extractPayload: (event: unknown, props: Record<string, unknown>) => TAction['payload'];
    /** Whether this action requires orchestrator response */
    requiresResponse?: boolean;
  }>;

  /** Internal events that sync DOM state (don't go to orchestrator) */
  internalEvents?: Array<{
    propName: string;
    eventName: string;
  }>;

  /** Prop injection config for compound components */
  propInjection?: {
    enabled: boolean;
    injectableChildren?: string[];
  };
}
```

### Nimbus Registry with Typed Actions

```typescript
// @mcp-ui/nimbus/registry.ts
import * as Nimbus from '@commercetools/nimbus';
import type { ComponentConfig, NimbusAction } from '@mcp-ui/react';

export const nimbusRegistry: Record<string, ComponentConfig<NimbusAction>> = {
  'nimbus-button': {
    component: Nimbus.Button,
    actions: [{
      actionType: 'button.click',
      triggerProp: 'onPress',
      extractPayload: (_, props) => ({
        buttonId: props.id as string,
        formData: extractFormDataFromButton(props),
      }),
    }],
  },

  'nimbus-data-table': {
    component: Nimbus.DataTable,
    actions: [{
      actionType: 'dataTable.rowSelect',
      triggerProp: 'onRowClick',
      extractPayload: (event) => ({
        rowId: (event as { id: string }).id,
        rowData: event as Record<string, unknown>,
      }),
    }],
  },

  'nimbus-drawer-root': {
    component: Nimbus.Drawer.Root,
    // Drawer close is internal (just sync state), not an agent action
    internalEvents: [{
      propName: 'onOpenChange',
      eventName: 'drawerClose',
    }],
  },

  'nimbus-alert-dismiss-button': {
    component: Nimbus.Alert.DismissButton,
    actions: [{
      actionType: 'alert.dismiss',
      triggerProp: 'onPress',
      extractPayload: (_, props) => ({
        alertId: props.id as string,
      }),
    }],
  },

  // Simple components (no actions needed)
  'nimbus-badge': { component: Nimbus.Badge },
  'nimbus-text': { component: Nimbus.Text },
  'nimbus-stack': { component: Nimbus.Stack },
  'nimbus-flex': { component: Nimbus.Flex },
  'nimbus-image': { component: Nimbus.Image, isVoid: true },
  // ... etc
};
```

### Generic Wrapper Factory

The wrapper factory creates components with action handling based on the registry config:

```typescript
// @mcp-ui/react/wrapper-factory.ts
export function createWrapper<T extends BaseAction>(
  config: ComponentConfig<T>
): React.ComponentType {
  const { component: Component, actions, internalEvents } = config;

  return function WrappedComponent(props: Record<string, unknown>) {
    const uri = useUri();
    const dispatchAction = useActionDispatch();
    const syncDom = useDomSync();

    // Build enhanced props with action handlers
    const enhancedProps = { ...props };

    // Wire up agent actions (go to orchestrator)
    actions?.forEach(({ actionType, triggerProp, extractPayload }) => {
      const originalHandler = props[triggerProp];
      enhancedProps[triggerProp] = (event: unknown) => {
        const action: T = {
          type: actionType,
          componentId: props.id as string,
          uri,
          timestamp: Date.now(),
          payload: extractPayload(event, props),
        } as T;

        dispatchAction(action);

        // Call original handler if provided
        if (typeof originalHandler === 'function') {
          originalHandler(event);
        }
      };
    });

    // Wire up internal events (DOM sync only)
    internalEvents?.forEach(({ propName, eventName }) => {
      const originalHandler = props[propName];
      enhancedProps[propName] = (event: unknown) => {
        syncDom(eventName, uri, event);
        if (typeof originalHandler === 'function') {
          originalHandler(event);
        }
      };
    });

    return <Component {...enhancedProps} />;
  };
}
```

### Provider with Single onAction Handler

The provider exposes a single `onAction` callback for the consuming application to handle:

```typescript
// @mcp-ui/react/provider.tsx
interface McpUiProviderProps {
  serverUrl: string;
  children: React.ReactNode;

  /** Handle user actions that need orchestrator processing */
  onAction?: (action: BaseAction) => void | Promise<void>;

  /** Connection lifecycle callbacks */
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}

const ActionContext = createContext<{
  dispatch: (action: BaseAction) => void;
}>({ dispatch: () => {} });

const DomSyncContext = createContext<{
  sync: (eventName: string, uri: string, data: unknown) => void;
}>({ sync: () => {} });

export function McpUiProvider({
  serverUrl,
  children,
  onAction,
  onConnectionChange,
  onError,
}: McpUiProviderProps) {
  const { sendEvent, connected } = useWebSocketConnection(serverUrl);

  // Agent actions go to onAction callback (for LLM/orchestrator)
  const dispatch = useCallback((action: BaseAction) => {
    onAction?.(action);
  }, [onAction]);

  // Internal events go directly to WebSocket (DOM sync)
  const sync = useCallback((eventName: string, uri: string, data: unknown) => {
    sendEvent(eventName, uri, data);
  }, [sendEvent]);

  return (
    <ActionContext.Provider value={{ dispatch }}>
      <DomSyncContext.Provider value={{ sync }}>
        {children}
      </DomSyncContext.Provider>
    </ActionContext.Provider>
  );
}

export const useActionDispatch = () => useContext(ActionContext).dispatch;
export const useDomSync = () => useContext(DomSyncContext).sync;
```

---

## LangChain Adapter (`@mcp-ui/langchain`)

The LangChain adapter provides integration with LangChain/LangGraph applications, bridging the MCP-UI event system with LangChain's streaming patterns.

### Package Purpose

- Provide hooks for processing LangChain stream chunks
- Offer a pre-configured action handler that submits actions back to LangGraph
- Enable hybrid rendering (LangChain orchestration + MCP-UI components)

### Core Adapter

```typescript
// @mcp-ui/langchain/adapter.ts
import type { BaseAction } from '@mcp-ui/core';

export interface LangChainAdapterConfig {
  /** LangGraph thread ID */
  threadId: string;
  /** LangGraph API endpoint */
  apiUrl: string;
  /** Assistant ID for the graph */
  assistantId: string;
}

export function createLangChainActionHandler(config: LangChainAdapterConfig) {
  return async (action: BaseAction) => {
    // Submit action as a new message to LangGraph
    const response = await fetch(`${config.apiUrl}/threads/${config.threadId}/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assistant_id: config.assistantId,
        input: {
          messages: [{
            type: 'human',
            content: JSON.stringify({
              type: 'ui_action',
              action,
            }),
          }],
        },
        stream_mode: 'messages',
      }),
    });

    // Return stream for processing
    return response.body;
  };
}
```

### Stream Processing Hook

```typescript
// @mcp-ui/langchain/hooks.ts
import { useStream } from '@langchain/langgraph-sdk/react';
import type { Message } from '@langchain/langgraph-sdk';

interface UseLangChainMcpUiOptions {
  apiUrl: string;
  assistantId: string;
  threadId?: string;
}

export function useLangChainMcpUi(options: UseLangChainMcpUiOptions) {
  const thread = useStream<{ messages: Message[] }>({
    apiUrl: options.apiUrl,
    assistantId: options.assistantId,
    threadId: options.threadId,
  });

  // Extract MCP-UI resources from stream
  const uiResources = useMemo(() => {
    const resources: Array<{ uri: string; content: unknown }> = [];

    for (const message of thread.messages) {
      // Look for tool results with UI resources
      if (message.type === 'tool' && message.content) {
        const content = JSON.parse(message.content);
        if (content.type === 'remoteDom') {
          resources.push({
            uri: content.uri,
            content,
          });
        }
      }
    }

    return resources;
  }, [thread.messages]);

  // Create action handler bound to this thread
  const handleAction = useCallback(async (action: BaseAction) => {
    await thread.submit({
      messages: [{
        type: 'human',
        content: JSON.stringify({ type: 'ui_action', action }),
      }],
    });
  }, [thread]);

  return {
    ...thread,
    uiResources,
    handleAction,
  };
}
```

### Consumer Usage with LangChain

```tsx
// Consumer app with LangChain integration
import { McpUiProvider, RemoteRenderer } from '@mcp-ui/nimbus';
import { useLangChainMcpUi } from '@mcp-ui/langchain';

function ChatWithUI() {
  const {
    messages,
    uiResources,
    handleAction,
    submit,
    isLoading,
  } = useLangChainMcpUi({
    apiUrl: 'http://localhost:8000',
    assistantId: 'commerce-assistant',
  });

  return (
    <div className="chat-container">
      {/* Chat messages */}
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>

      {/* MCP-UI rendered components */}
      <McpUiProvider
        serverUrl="http://localhost:3001"
        onAction={handleAction}
      >
        {uiResources.map((resource) => (
          <RemoteRenderer
            key={resource.uri}
            uri={resource.uri}
            initialContent={resource.content}
          />
        ))}
      </McpUiProvider>

      {/* Chat input */}
      <ChatInput onSubmit={submit} disabled={isLoading} />
    </div>
  );
}
```

### Standalone Usage (No LangChain)

```tsx
// Consumer app without LangChain - custom orchestrator
import { McpUiProvider, RemoteRenderer } from '@mcp-ui/nimbus';
import type { NimbusAction } from '@mcp-ui/nimbus';

function MyApp() {
  const handleAction = useCallback((action: NimbusAction) => {
    // Custom handling based on action type
    switch (action.type) {
      case 'button.click':
        console.log('Button clicked:', action.payload.buttonId);
        // Send to your own backend/orchestrator
        myOrchestrator.handleButtonClick(action.payload);
        break;

      case 'dataTable.rowSelect':
        console.log('Row selected:', action.payload.rowId);
        myOrchestrator.handleRowSelect(action.payload);
        break;

      case 'form.submit':
        console.log('Form submitted:', action.payload.formData);
        myOrchestrator.handleFormSubmit(action.payload);
        break;
    }
  }, []);

  return (
    <McpUiProvider
      serverUrl="http://localhost:3001"
      onAction={handleAction}
    >
      <RemoteRenderer uri="/my-ui" />
    </McpUiProvider>
  );
}
```

---

## Files to Extract from POC

### To `@mcp-ui/core`

| Source File | Notes |
|-------------|-------|
| `use-remote-connection.ts` | Extract connection logic, remove React dependencies |
| `use-mutation-stream.ts` | WebSocket handling, message parsing |
| Types | `ClientEventMessage`, `ActionQueuedMessage`, `BaseAction`, etc. |

### To `@mcp-ui/react`

| Source File | Notes |
|-------------|-------|
| `remote-dom-renderer.tsx` | Keep generic renderer, extract component registry |
| `prop-injector.tsx` | Keep as-is |
| Provider component | New file with `ActionContext` and `DomSyncContext` |
| `useUri` hook | Context for URI access |
| `wrapper-factory.ts` | New file - generic wrapper creation from `ComponentConfig` |

### To `@mcp-ui/nimbus`

| Source | Notes |
|--------|-------|
| Component wrappers | Migrate to registry-based `ComponentConfig` with typed actions |
| Registry definition | Map of element names to `ComponentConfig<NimbusAction>` |
| Action types | `ButtonAction`, `RowSelectAction`, `FormSubmitAction`, etc. |
| `NimbusMcpProvider` | Auto-registering provider wrapper |

### To `@mcp-ui/langchain` (New Package)

| Source | Notes |
|--------|-------|
| `adapter.ts` | `createLangChainActionHandler` for submitting actions to LangGraph |
| `hooks.ts` | `useLangChainMcpUi` for stream processing and UI resource extraction |
| Types | LangChain-specific types and interfaces |

---

## Migration Path

| Scenario | Import From | Breaking Change? |
|----------|-------------|------------------|
| Option A today | `@mcp-ui/nimbus` | - |
| Option B (custom + Nimbus) | `@mcp-ui/react` + `@mcp-ui/nimbus` | No |
| Option B (custom only) | `@mcp-ui/react` | No |
| Extend Nimbus registry | Import `nimbusRegistry`, add entries | No |
| With LangChain | `@mcp-ui/nimbus` + `@mcp-ui/langchain` | No |
| Custom orchestrator | `@mcp-ui/nimbus` + custom `onAction` handler | No |

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
