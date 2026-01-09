/**
 * Remote DOM Renderer - Simplified
 *
 * Simple architecture:
 * - Most components: Simple styleProps spreading
 * - FormField ONLY: Compound reconstruction for prop injection
 * - Drawer: State sync
 * - Button/DataTable: Event handling
 */

import React from "react";
import {
  RemoteRootRenderer,
  createRemoteComponentRenderer,
} from "@remote-dom/react/host";
import { UNSAFE_PortalProvider } from "react-aria";
import * as Nimbus from "@commercetools/nimbus";
import type {
  MoneyInputValue,
  DataTableRowItem,
  AlertProps,
} from "@commercetools/nimbus";
import {
  useRemoteConnection,
  sendClientEvent,
} from "../hooks/use-remote-connection";
import {
  getOrCreateReceiver,
  clearAllReceivers,
} from "../hooks/receiver-registry";
import { renderElement, type RemoteDomElement } from "./prop-injector";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

export interface RemoteDomContent {
  type: "remoteDom";
  tree: unknown;
  mutations?: unknown[];
  framework: "react";
}

export interface RemoteDomRendererProps {
  content: RemoteDomContent;
  uri: string;
}

// Context to provide URI
const UriContext = React.createContext<string>("");
function useUri() {
  return React.useContext(UriContext);
}

// Use shared receiver registry - enables eager creation before component mount
function getReceiverForUri(uri: string) {
  return getOrCreateReceiver(uri);
}

export function clearReceivers() {
  clearAllReceivers();
}

/**
 * Remote DOM tree node structure (from MCP tool result)
 */
interface TreeNode {
  id: number;
  type?: string;
  properties?: Record<string, unknown>;
  children?: TreeNode[];
  text?: string;
}

/**
 * Remote DOM mutation record types
 */
interface InsertChildMutation {
  type: 0; // INSERT_CHILD
  parent: number;
  child: {
    id: number;
    type?: string;
    properties?: Record<string, unknown>;
    text?: string;
  };
  index: number;
}

type MutationRecord = InsertChildMutation;

/**
 * Convert a serialized tree to mount mutations
 * Walks the tree and creates INSERT_CHILD mutations for each node
 */
function createMountMutations(tree: TreeNode): MutationRecord[] {
  const mutations: MutationRecord[] = [];

  function walkTree(node: TreeNode, parentId: number, index: number) {
    // Create mutation for this node (skip root which has id 0)
    if (node.id !== 0) {
      mutations.push({
        type: 0, // INSERT_CHILD
        parent: parentId,
        child: {
          id: node.id,
          type: node.type,
          properties: node.properties,
          text: node.text,
        },
        index,
      });
    }

    // Process children
    if (node.children) {
      node.children.forEach((child, childIndex) => {
        walkTree(child, node.id, childIndex);
      });
    }
  }

  // Start walking from root (id 0)
  walkTree(tree, -1, 0);

  return mutations;
}

/**
 * Simple wrapper - just spreads styleProps
 */
const simple =
  (Component: AnyComponent, isVoid = false) =>
  (props: Record<string, unknown>) => {
    const { styleProps, children, ...rest } = props;
    const merged = { ...rest, ...(styleProps as Record<string, unknown>) };

    // Void elements can't have children
    if (isVoid) {
      return <Component {...merged} />;
    }

    return <Component {...merged}>{children}</Component>;
  };

/**
 * Button with click handling
 */
const ButtonWrapper = (props: Record<string, unknown>) => {
  const parentUri = useUri();
  // Use data-uri if present (set by server for buttons in data table drawers)
  const dataUri = props["data-uri"] as string | undefined;
  const uri = dataUri || parentUri;

  const { styleProps, id, onPress, ...rest } = props;
  // Remove data-uri from rest props so it doesn't get passed to the component
  delete rest["data-uri"];

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handlePress = id
    ? () => {
        // Extract form data if this button is inside a form
        const formData: Record<string, string> = {};

        const button = buttonRef.current;
        if (button) {
          // Find the parent form element
          const form = button.closest("form");
          if (form) {
            // Extract all input values from the form
            const inputs =
              form.querySelectorAll<HTMLInputElement>("input[name]");
            inputs.forEach((input) => {
              if (input.name) {
                formData[input.name] = input.value;
              }
            });
          }
        }

        sendClientEvent("buttonClick", uri, { buttonId: id, formData }, false);
        if (typeof onPress === "function") {
          onPress();
        }
      }
    : onPress;

  return (
    <Nimbus.Button
      {...rest}
      {...(styleProps as Record<string, unknown>)}
      onPress={handlePress as () => void}
      ref={buttonRef}
    />
  );
};

/**
 * DataTable with row click handling
 */
const DataTableWrapper = (props: Record<string, unknown>) => {
  const parentUri = useUri();
  // Use data-uri if present (set by server for nested data tables with showDetails)
  // This ensures events use the correct URI where row data is stored
  const dataUri = props["data-uri"] as string | undefined;
  const uri = dataUri || parentUri;

  // Debug logging
  console.log("🔍 DataTableWrapper props:", {
    dataUri,
    parentUri,
    uri,
    isRowClickable: props.isRowClickable,
    hasDataUriProp: "data-uri" in props,
    allPropKeys: Object.keys(props),
  });

  const { columns, rows, isRowClickable, onRowClick, ...rest } = props;
  // Remove data-uri from rest props so it doesn't get passed to the component
  delete rest["data-uri"];

  const parsedColumns =
    typeof columns === "string" ? JSON.parse(columns as string) : columns;
  const parsedRows =
    typeof rows === "string" ? JSON.parse(rows as string) : rows;

  interface ColumnDef {
    id?: string;
    key?: string;
    header?: string;
    label?: string;
    accessor?: string | ((row: Record<string, unknown>) => unknown);
    [key: string]: unknown;
  }

  // Normalize columns - handle both {id, header} and {key, label} formats
  const transformedColumns = parsedColumns?.map((col: ColumnDef) => {
    // Get the column key - prefer 'id' but fall back to 'key'
    const colKey = col.id || col.key || "";
    // Get the header - prefer 'header' but fall back to 'label'
    const colHeader = col.header || col.label || colKey;

    return {
      ...col,
      id: colKey,
      header: colHeader,
      // Always ensure accessor is a function - create one from the column key
      accessor:
        typeof col.accessor === "function"
          ? col.accessor
          : (row: Record<string, unknown>) => row[colKey],
    };
  });

  const handleRowClick = isRowClickable
    ? (row: DataTableRowItem) => {
        console.log("🔍 DataTable handleRowClick called:", {
          rowId: row.id,
          uri,
        });
        sendClientEvent("dataTableRowClick", uri, { rowId: row.id }, false);
        if (typeof onRowClick === "function") {
          onRowClick(row);
        }
      }
    : undefined;

  console.log("🔍 DataTable handleRowClick setup:", {
    isRowClickable,
    hasHandler: !!handleRowClick,
  });

  return (
    <Nimbus.DataTable
      columns={transformedColumns}
      rows={parsedRows}
      onRowClick={handleRowClick}
      isRowClickable={Boolean(isRowClickable)}
      {...rest}
    />
  );
};

/**
 * MoneyInput with value construction
 */
const MoneyInputWrapper = (props: Record<string, unknown>) => {
  const { currencyCode, amount, currencies, ...rest } = props;
  const parsedCurrencies =
    typeof currencies === "string"
      ? JSON.parse(currencies as string)
      : currencies;

  const value: MoneyInputValue = {
    currencyCode: ((currencyCode as string) ||
      "USD") as MoneyInputValue["currencyCode"],
    amount: (amount as string) || "",
  };

  return (
    <Nimbus.MoneyInput {...rest} value={value} currencies={parsedCurrencies} />
  );
};

/**
 * Drawer.Root with state sync
 */
const DrawerRootWrapper = (props: Record<string, unknown>) => {
  const parentUri = useUri();
  // Use data-uri if present (set by server for data table detail drawers)
  const dataUri = props["data-uri"] as string | undefined;
  const uri = dataUri || parentUri;

  const { styleProps, isOpen, isDismissable = true, children, ...rest } = props;
  // Remove data-uri from rest props so it doesn't get passed to the component
  delete rest["data-uri"];

  const handleOpenChange = (newIsOpen: boolean) => {
    if (!newIsOpen) {
      sendClientEvent("drawerClose", uri, {}, false);
    }
  };

  return (
    <Nimbus.Drawer.Root
      {...rest}
      {...(styleProps as Record<string, unknown>)}
      isOpen={Boolean(isOpen)}
      isDismissable={Boolean(isDismissable)}
      onOpenChange={handleOpenChange}
    >
      {children as React.ReactNode}
    </Nimbus.Drawer.Root>
  );
};

/**
 * Drawer.CloseTrigger with click handling
 */
const DrawerCloseTriggerWrapper = (props: Record<string, unknown>) => {
  const parentUri = useUri();
  // Use data-uri if present (set by server for data table detail drawer close buttons)
  const dataUri = props["data-uri"] as string | undefined;
  const uri = dataUri || parentUri;

  const { styleProps, ...rest } = props;
  // Remove data-uri from rest props so it doesn't get passed to the component
  delete rest["data-uri"];

  const handlePress = () => {
    sendClientEvent("drawerClose", uri, {}, false);
  };

  return (
    <Nimbus.Drawer.CloseTrigger
      {...rest}
      {...(styleProps as Record<string, unknown>)}
      onPress={handlePress}
    />
  );
};

/**
 * Component registry - single source of truth for all Nimbus components
 * Maps tag names to unwrapped React components
 */
const componentRegistry: Record<string, AnyComponent> = {
  "nimbus-badge": Nimbus.Badge,
  "nimbus-text": Nimbus.Text,
  "nimbus-heading": Nimbus.Heading,
  "nimbus-stack": Nimbus.Stack,
  "nimbus-flex": Nimbus.Flex,
  "nimbus-image": Nimbus.Image,
  "nimbus-text-input": Nimbus.TextInput,
  "nimbus-money-input": MoneyInputWrapper,
  "nimbus-button": ButtonWrapper,
  "nimbus-data-table": DataTableWrapper,
  "nimbus-card-root": Nimbus.Card.Root,
  "nimbus-card-header": Nimbus.Card.Header,
  "nimbus-card-content": Nimbus.Card.Content,
  "nimbus-form-field-root": Nimbus.FormField.Root,
  "nimbus-form-field-label": Nimbus.FormField.Label,
  "nimbus-form-field-input": Nimbus.FormField.Input,
  "nimbus-form-field-description": Nimbus.FormField.Description,
  "nimbus-form-field-error": Nimbus.FormField.Error,
  "nimbus-drawer-root": DrawerRootWrapper,
  "nimbus-drawer-trigger": Nimbus.Drawer.Trigger,
  "nimbus-drawer-content": Nimbus.Drawer.Content,
  "nimbus-drawer-header": Nimbus.Drawer.Header,
  "nimbus-drawer-title": Nimbus.Drawer.Title,
  "nimbus-drawer-body": Nimbus.Drawer.Body,
  "nimbus-drawer-footer": Nimbus.Drawer.Footer,
  "nimbus-drawer-close-trigger": DrawerCloseTriggerWrapper,
  "nimbus-alert-root": Nimbus.Alert.Root,
  "nimbus-alert-title": Nimbus.Alert.Title,
  "nimbus-alert-description": Nimbus.Alert.Description,
  "nimbus-alert-dismiss-button": Nimbus.Alert.DismissButton,
};

/**
 * Create component map for prop injection (used by renderElement)
 * Returns unwrapped components
 */
const createComponentMapForPropInjection = () =>
  new Map<string, AnyComponent>(Object.entries(componentRegistry));

/**
 * FormField.Root wrapper - reconstructs children for context access
 * FormField uses context-based registration, so children must be rendered
 * inside FormField.Root's context provider
 */
const FormFieldRootWrapper = (props: Record<string, unknown>) => {
  const { styleProps, children, ...rest } = props;

  // Reconstruct children so they can access FormField.Root's context
  const componentMap = createComponentMapForPropInjection();
  const childArray = React.Children.toArray(children as React.ReactNode);
  const reconstructed = childArray.map((child, index) => {
    if (!React.isValidElement(child)) return child;

    interface RemoteElementProps {
      element?: RemoteDomElement;
      [key: string]: unknown;
    }

    const remoteProps = child.props as RemoteElementProps;
    const element = remoteProps.element;

    if (!element) return child;

    return renderElement(element, index, componentMap, {});
  });

  return (
    <Nimbus.FormField.Root
      {...rest}
      {...(styleProps as Record<string, unknown>)}
    >
      {reconstructed}
    </Nimbus.FormField.Root>
  );
};

/**
 * Alert.Root wrapper - spreads styleProps and ensures variant/colorPalette are passed
 */
const AlertRootWrapper = (props: Record<string, unknown>) => {
  const { styleProps, children, variant, colorPalette, ...rest } = props;

  const merged = {
    ...rest,
    ...(styleProps as Record<string, unknown>),
    variant: variant as AlertProps["variant"],
    colorPalette: colorPalette as AlertProps["colorPalette"],
  };

  return (
    <Nimbus.Alert.Root {...merged}>
      {children as React.ReactNode}
    </Nimbus.Alert.Root>
  );
};

/**
 * Alert.DismissButton wrapper - handles dismiss functionality
 */
const AlertDismissButtonWrapper = (props: Record<string, unknown>) => {
  const uri = useUri();
  const { styleProps, id, ...rest } = props;

  const handlePress = id
    ? () => {
        // Send dismiss event to remove the alert
        sendClientEvent("alertDismiss", uri, { alertId: id }, false);
      }
    : undefined;

  return (
    <Nimbus.Alert.DismissButton
      {...rest}
      {...(styleProps as Record<string, unknown>)}
      onPress={handlePress}
    />
  );
};

/**
 * Components that need custom wrappers (not the simple wrapper)
 */
const customWrappers: Record<string, AnyComponent> = {
  "nimbus-button": ButtonWrapper,
  "nimbus-data-table": DataTableWrapper,
  "nimbus-money-input": MoneyInputWrapper,
  "nimbus-form-field-root": FormFieldRootWrapper,
  "nimbus-drawer-root": DrawerRootWrapper,
  "nimbus-drawer-close-trigger": DrawerCloseTriggerWrapper,
  "nimbus-alert-root": AlertRootWrapper,
  "nimbus-alert-dismiss-button": AlertDismissButtonWrapper,
};

/**
 * Void elements that can't have children
 */
const voidElements = new Set(["nimbus-image"]);

/**
 * Create component map for Remote DOM (wraps components with createRemoteComponentRenderer)
 * Uses componentRegistry as source and applies appropriate wrappers
 */
function createComponentMap() {
  const map = new Map();

  // Cast helper to work around React types version mismatch between
  // @remote-dom/react and our local React types
  const wrapComponent = (comp: AnyComponent) =>
    createRemoteComponentRenderer(
      comp as Parameters<typeof createRemoteComponentRenderer>[0]
    );

  Object.entries(componentRegistry).forEach(([tag, Component]) => {
    let wrappedComponent;

    if (customWrappers[tag]) {
      // Use custom wrapper
      wrappedComponent = wrapComponent(customWrappers[tag]);
    } else if (voidElements.has(tag)) {
      // Void element (no children)
      wrappedComponent = wrapComponent(simple(Component, true));
    } else {
      // Simple wrapper (spread styleProps)
      wrappedComponent = wrapComponent(simple(Component));
    }

    map.set(tag, wrappedComponent);
  });

  return map;
}

export function RemoteDomRenderer({ content, uri }: RemoteDomRendererProps) {
  const receiver = getReceiverForUri(uri);
  const portalContainerRef = React.useRef<HTMLDivElement>(null);
  const initializedRef = React.useRef(false);

  // Hydrate receiver from content prop on mount (if not already initialized)
  // This ensures UI persists even if WebSocket doesn't replay mutations
  React.useEffect(() => {
    if (!initializedRef.current && content?.tree) {
      console.log("🔄 Hydrating receiver from content prop:", uri);
      try {
        // The tree from MCP is the serialized Remote DOM tree
        // We need to apply it as initial mutations
        const tree = content.tree as TreeNode;
        if (tree && tree.children) {
          // Apply initial tree by creating mount mutations
          const mutations = createMountMutations(tree);
          if (mutations.length > 0) {
            // Cast to satisfy Remote DOM types (format is compatible at runtime)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            receiver.connection.mutate(mutations as any);
          }
        }
      } catch (error) {
        console.error("Failed to hydrate receiver:", error);
      }
      initializedRef.current = true;
    }
  }, [content, uri, receiver]);

  useRemoteConnection(
    receiver,
    import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001",
    uri
  );

  const componentMap = React.useMemo(() => createComponentMap(), []);

  return (
    <>
      <div ref={portalContainerRef} />
      <UNSAFE_PortalProvider getContainer={() => portalContainerRef.current}>
        <UriContext.Provider value={uri}>
          <RemoteRootRenderer receiver={receiver} components={componentMap} />
        </UriContext.Provider>
      </UNSAFE_PortalProvider>
    </>
  );
}
