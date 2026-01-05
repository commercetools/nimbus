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
  RemoteReceiver,
  createRemoteComponentRenderer,
} from "@remote-dom/react/host";
import { UNSAFE_PortalProvider } from "react-aria";
import * as Nimbus from "@commercetools/nimbus";
import type { MoneyInputValue, DataTableRowItem } from "@commercetools/nimbus";
import {
  useRemoteConnection,
  sendClientEvent,
} from "../hooks/use-remote-connection";
import { renderElement } from "./prop-injector";

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

// Receiver management
const receiversByUri = new Map<string, RemoteReceiver>();

function getReceiverForUri(uri: string): RemoteReceiver {
  let receiver = receiversByUri.get(uri);
  if (!receiver) {
    receiver = new RemoteReceiver();
    receiversByUri.set(uri, receiver);
  }
  return receiver;
}

export function clearReceivers() {
  receiversByUri.clear();
}

/**
 * Simple wrapper - just spreads styleProps
 */
const simple =
  (Component: React.ComponentType<Record<string, unknown>>, isVoid = false) =>
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
  const uri = useUri();
  const { styleProps, id, onPress, ...rest } = props;
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
            console.log("📝 Extracted form data:", formData);
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
  const uri = useUri();
  const { columns, rows, isRowClickable, onRowClick, ...rest } = props;

  const parsedColumns =
    typeof columns === "string" ? JSON.parse(columns as string) : columns;
  const parsedRows =
    typeof rows === "string" ? JSON.parse(rows as string) : rows;

  interface ColumnDef {
    id: string;
    accessor: string | ((row: Record<string, unknown>) => unknown);
    [key: string]: unknown;
  }

  const transformedColumns = parsedColumns?.map((col: ColumnDef) => ({
    ...col,
    accessor:
      typeof col.accessor === "string"
        ? (row: Record<string, unknown>) => row[col.id]
        : col.accessor,
  }));

  const handleRowClick = isRowClickable
    ? (row: DataTableRowItem) => {
        sendClientEvent("dataTableRowClick", uri, { rowId: row.id }, false);
        if (typeof onRowClick === "function") {
          onRowClick(row);
        }
      }
    : undefined;

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
 * Switch with change handling
 */
const SwitchWrapper = (props: Record<string, unknown>) => {
  const uri = useUri();
  const { styleProps, id, onChange, children, ...rest } = props;

  const handleChange = id
    ? (isSelected: boolean) => {
        // Send change event to server
        sendClientEvent("switchChange", uri, { switchId: id, isSelected }, false);

        if (typeof onChange === "function") {
          onChange(isSelected);
        }
      }
    : onChange;

  return (
    <Nimbus.Switch
      {...rest}
      {...(styleProps as Record<string, unknown>)}
      onChange={handleChange}
    >
      {children}
    </Nimbus.Switch>
  );
};

/**
 * Drawer.Root with state sync
 */
const DrawerRootWrapper = (props: Record<string, unknown>) => {
  const uri = useUri();
  const { styleProps, isOpen, isDismissable = true, children, ...rest } = props;

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
  const uri = useUri();
  const { styleProps, ...rest } = props;

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
const componentRegistry: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  "nimbus-badge": Nimbus.Badge,
  "nimbus-text": Nimbus.Text,
  "nimbus-heading": Nimbus.Heading,
  "nimbus-stack": Nimbus.Stack,
  "nimbus-flex": Nimbus.Flex,
  "nimbus-image": Nimbus.Image,
  "nimbus-text-input": Nimbus.TextInput,
  "nimbus-money-input": MoneyInputWrapper,
  "nimbus-switch": SwitchWrapper,
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
  new Map<string, React.ComponentType<Record<string, unknown>>>(
    Object.entries(componentRegistry)
  );

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
      element?: unknown;
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

  console.log("🔔 Alert props received:", {
    variant,
    colorPalette,
    styleProps,
    rest,
  });

  const merged = {
    ...rest,
    ...(styleProps as Record<string, unknown>),
    variant,
    colorPalette,
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
const customWrappers: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  "nimbus-button": ButtonWrapper,
  "nimbus-switch": SwitchWrapper,
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

  Object.entries(componentRegistry).forEach(([tag, Component]) => {
    let wrappedComponent;

    if (customWrappers[tag]) {
      // Use custom wrapper
      wrappedComponent = createRemoteComponentRenderer(customWrappers[tag]);
    } else if (voidElements.has(tag)) {
      // Void element (no children)
      wrappedComponent = createRemoteComponentRenderer(simple(Component, true));
    } else {
      // Simple wrapper (spread styleProps)
      wrappedComponent = createRemoteComponentRenderer(simple(Component));
    }

    map.set(tag, wrappedComponent);
  });

  return map;
}

export function RemoteDomRenderer({ uri }: RemoteDomRendererProps) {
  const receiver = getReceiverForUri(uri);
  const portalContainerRef = React.useRef<HTMLDivElement>(null);

  useRemoteConnection(
    receiver,
    import.meta.env.VITE_UI_SERVER_URL || "http://localhost:3001",
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
