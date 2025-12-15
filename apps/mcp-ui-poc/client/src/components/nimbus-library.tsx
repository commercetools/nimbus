import type {
  ComponentLibrary,
  RemoteElementConfiguration,
} from "@mcp-ui/client";
import * as Nimbus from "@commercetools/nimbus";
import type { MoneyInputValue } from "@commercetools/nimbus";
import { createPropMappingWrapper } from "../utils/prop-mapping-wrapper";

// Wrapper for DataTable that parses JSON strings and renders complete structure
const DataTableRootWrapper = (props: Record<string, unknown>) => {
  // Explicitly remove children to prevent React void element error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { columns, rows, children, ...restProps } = props;

  // Parse JSON strings if they're strings
  const parsedColumns =
    typeof columns === "string" ? JSON.parse(columns) : columns;
  const parsedRows = typeof rows === "string" ? JSON.parse(rows) : rows;

  // Convert accessor string representations to actual functions
  const transformedColumns = parsedColumns?.map(
    (col: {
      id: string;
      header: string;
      accessor: string | ((row: unknown) => unknown);
    }) => {
      if (typeof col.accessor === "string") {
        // Create accessor function from string representation
        return {
          ...col,
          accessor: (row: Record<string, unknown>) => row[col.id],
        };
      }
      return col;
    }
  );

  // Render complete DataTable structure (Root > Table > Header + Body)
  // This ensures proper styling and context for all child components
  return (
    <Nimbus.DataTable.Root
      columns={transformedColumns}
      rows={parsedRows}
      {...restProps}
    >
      <Nimbus.DataTable.Table>
        <Nimbus.DataTable.Header />
        <Nimbus.DataTable.Body />
      </Nimbus.DataTable.Table>
    </Nimbus.DataTable.Root>
  );
};

// Wrapper for Image to prevent children errors (img is a void element)
const ImageWrapper = (props: Record<string, unknown>) => {
  // Explicitly remove children to prevent React void element error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...imageProps } = props;
  return <Nimbus.Image {...imageProps} />;
};

// Wrapper for MoneyInput to handle value prop construction
const MoneyInputWrapper = (props: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currencyCode, amount, currencies, children, ...restProps } = props;

  // Parse currencies if it's a JSON string
  const parsedCurrencies =
    typeof currencies === "string" ? JSON.parse(currencies) : currencies;

  // Construct the value object from currencyCode and amount
  // Server provides currency code as string, which may not match the strict CurrencyCode union type
  // We trust the server to provide valid ISO 4217 codes, so we satisfy TypeScript's type checking
  const value: MoneyInputValue = {
    currencyCode: ((currencyCode as string) ||
      "USD") as MoneyInputValue["currencyCode"],
    amount: (amount as string) || "",
  };

  return (
    <Nimbus.MoneyInput
      {...restProps}
      value={value}
      currencies={parsedCurrencies}
    />
  );
};

// Helper function to create wrapped components with prop mapping and event mapping
function createWrappedComponent<P extends Record<string, unknown>>(
  component: React.ComponentType<P>,
  propMapping?: Record<string, string>,
  eventMapping?: Record<string, string>
): React.ComponentType<Record<string, unknown>> {
  if (
    (!propMapping || Object.keys(propMapping).length === 0) &&
    (!eventMapping || Object.keys(eventMapping).length === 0)
  ) {
    return component as React.ComponentType<Record<string, unknown>>;
  }
  return createPropMappingWrapper(component, propMapping || {}, eventMapping);
}

export const nimbusLibrary: ComponentLibrary = {
  name: "nimbus",
  elements: [
    // Card components
    {
      tagName: "nimbus-card-root",
      component: createWrappedComponent(Nimbus.Card.Root, {
        "card-padding": "cardPadding",
        "border-style": "borderStyle",
        "background-style": "backgroundStyle",
        elevation: "elevation",
        "max-width": "maxWidth",
        width: "width",
      }),
      propMapping: {
        "card-padding": "cardPadding",
        "border-style": "borderStyle",
        "background-style": "backgroundStyle",
        elevation: "elevation",
        "max-width": "maxWidth",
        width: "width",
      },
    },
    {
      tagName: "nimbus-card-header",
      component: Nimbus.Card.Header,
      propMapping: {},
    },
    {
      tagName: "nimbus-card-content",
      component: Nimbus.Card.Content,
      propMapping: {},
    },

    // Alert components
    {
      tagName: "nimbus-alert-root",
      component: createWrappedComponent(Nimbus.Alert.Root, {
        tone: "tone",
        variant: "variant",
      }),
      propMapping: {
        tone: "tone",
        variant: "variant",
      },
    },
    {
      tagName: "nimbus-alert-title",
      component: Nimbus.Alert.Title,
      propMapping: {},
    },
    {
      tagName: "nimbus-alert-description",
      component: Nimbus.Alert.Description,
      propMapping: {},
    },
    {
      tagName: "nimbus-alert-actions",
      component: Nimbus.Alert.Actions,
      propMapping: {},
    },
    {
      tagName: "nimbus-alert-dismiss-button",
      component: createWrappedComponent(
        Nimbus.Alert.DismissButton,
        {},
        {
          press: "onPress",
        }
      ),
      propMapping: {},
      eventMapping: {
        press: "onClick",
      },
    },

    // FormField components
    {
      tagName: "nimbus-form-field-root",
      component: createWrappedComponent(Nimbus.FormField.Root, {
        "is-required": "isRequired",
        "is-invalid": "isInvalid",
        "is-disabled": "isDisabled",
        "is-read-only": "isReadOnly",
      }),
      propMapping: {
        "is-required": "isRequired",
        "is-invalid": "isInvalid",
        "is-disabled": "isDisabled",
        "is-read-only": "isReadOnly",
      },
    },
    {
      tagName: "nimbus-form-field-label",
      component: Nimbus.FormField.Label,
      propMapping: {},
    },
    {
      tagName: "nimbus-form-field-input",
      component: Nimbus.FormField.Input,
      propMapping: {},
    },
    {
      tagName: "nimbus-form-field-description",
      component: Nimbus.FormField.Description,
      propMapping: {},
    },
    {
      tagName: "nimbus-form-field-error",
      component: Nimbus.FormField.Error,
      propMapping: {},
    },

    // Typography
    {
      tagName: "nimbus-heading",
      component: createWrappedComponent(Nimbus.Heading, {
        size: "size",
        "margin-bottom": "marginBottom",
      }),
      propMapping: {
        size: "size",
        "margin-bottom": "marginBottom",
      },
    },
    {
      tagName: "nimbus-text",
      component: createWrappedComponent(Nimbus.Text, {
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        color: "color",
        "margin-bottom": "marginBottom",
      }),
      propMapping: {
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        color: "color",
        "margin-bottom": "marginBottom",
      },
    },

    // Interactive components
    {
      tagName: "nimbus-button",
      component: createWrappedComponent(
        Nimbus.Button,
        {
          variant: "variant",
          "color-palette": "colorPalette",
          width: "width",
          "is-disabled": "isDisabled",
          "margin-top": "marginTop",
          "data-label": "data-label",
          type: "type",
          "aria-label": "aria-label",
          "data-intent-type": "data-intent-type",
          "data-product-id": "data-product-id",
          "data-product-name": "data-product-name",
        },
        {
          press: "onPress",
        }
      ),
      propMapping: {
        variant: "variant",
        "color-palette": "colorPalette",
        width: "width",
        "is-disabled": "isDisabled",
        "margin-top": "marginTop",
        "data-label": "data-label",
        type: "type",
        "aria-label": "aria-label",
        "data-intent-type": "data-intent-type",
        "data-product-id": "data-product-id",
        "data-product-name": "data-product-name",
      },
      eventMapping: {
        press: "onPress",
      },
    },
    {
      tagName: "nimbus-badge",
      component: createWrappedComponent(
        Nimbus.Badge as React.ComponentType<Record<string, unknown>>,
        {
          "color-palette": "colorPalette",
          "margin-bottom": "marginBottom",
          width: "width",
          size: "size",
        }
      ),
      propMapping: {
        "color-palette": "colorPalette",
        "margin-bottom": "marginBottom",
        width: "width",
        size: "size",
      },
    },

    // Media
    {
      tagName: "nimbus-image",
      component: createWrappedComponent(ImageWrapper, {
        src: "src",
        alt: "alt",
        "border-radius": "borderRadius",
        "margin-bottom": "marginBottom",
      }),
      propMapping: {
        src: "src",
        alt: "alt",
        "border-radius": "borderRadius",
        "margin-bottom": "marginBottom",
      },
    },

    // Layout
    {
      tagName: "nimbus-stack",
      component: createWrappedComponent(Nimbus.Stack, {
        direction: "direction",
        gap: "gap",
        "margin-bottom": "marginBottom",
        width: "width",
        as: "as",
        action: "action",
        method: "method",
        enctype: "enctype",
      }),
      propMapping: {
        direction: "direction",
        gap: "gap",
        "margin-bottom": "marginBottom",
        width: "width",
        as: "as",
        action: "action",
        method: "method",
        enctype: "enctype",
      },
    },
    {
      tagName: "nimbus-flex",
      component: createWrappedComponent(Nimbus.Flex, {
        direction: "direction",
        gap: "gap",
        padding: "padding",
        "background-color": "backgroundColor",
        "border-bottom": "borderBottom",
        "border-color": "borderColor",
        as: "as",
        action: "action",
        method: "method",
        enctype: "enctype",
      }),
      propMapping: {
        direction: "direction",
        gap: "gap",
        padding: "padding",
        "background-color": "backgroundColor",
        "border-bottom": "borderBottom",
        "border-color": "borderColor",
        as: "as",
        action: "action",
        method: "method",
        enctype: "enctype",
      },
    },
    {
      tagName: "nimbus-box",
      component: createWrappedComponent(Nimbus.Box, {
        padding: "padding",
        "margin-bottom": "marginBottom",
        "background-color": "backgroundColor",
        "border-radius": "borderRadius",
      }),
      propMapping: {
        padding: "padding",
        "margin-bottom": "marginBottom",
        "background-color": "backgroundColor",
        "border-radius": "borderRadius",
      },
    },

    // Form inputs
    {
      tagName: "nimbus-text-input",
      component: createWrappedComponent(Nimbus.TextInput, {
        name: "name",
        placeholder: "placeholder",
        "is-required": "isRequired",
        "is-disabled": "isDisabled",
        "is-read-only": "isReadOnly",
        type: "type",
        "min-length": "minLength",
        "max-length": "maxLength",
        pattern: "pattern",
        min: "min",
        max: "max",
        step: "step",
        accept: "accept",
        multiple: "multiple",
        "auto-complete": "autoComplete",
        "aria-label": "aria-label",
      }),
      propMapping: {
        name: "name",
        placeholder: "placeholder",
        "is-required": "isRequired",
        "is-disabled": "isDisabled",
        "is-read-only": "isReadOnly",
        type: "type",
        "min-length": "minLength",
        "max-length": "maxLength",
        pattern: "pattern",
        min: "min",
        max: "max",
        step: "step",
        accept: "accept",
        multiple: "multiple",
        "auto-complete": "autoComplete",
        "aria-label": "aria-label",
      },
    },
    {
      tagName: "nimbus-money-input",
      component: createWrappedComponent(MoneyInputWrapper, {
        name: "name",
        "currency-code": "currencyCode",
        amount: "amount",
        currencies: "currencies",
        placeholder: "placeholder",
        "is-required": "isRequired",
        "is-disabled": "isDisabled",
        "is-read-only": "isReadOnly",
        "is-invalid": "isInvalid",
        size: "size",
        "has-high-precision-badge": "hasHighPrecisionBadge",
        "is-currency-input-disabled": "isCurrencyInputDisabled",
        "aria-label": "aria-label",
      }),
      propMapping: {
        name: "name",
        "currency-code": "currencyCode",
        amount: "amount",
        currencies: "currencies",
        placeholder: "placeholder",
        "is-required": "isRequired",
        "is-disabled": "isDisabled",
        "is-read-only": "isReadOnly",
        "is-invalid": "isInvalid",
        size: "size",
        "has-high-precision-badge": "hasHighPrecisionBadge",
        "is-currency-input-disabled": "isCurrencyInputDisabled",
        "aria-label": "aria-label",
      },
    },

    // DataTable components
    {
      tagName: "nimbus-data-table-root",
      component: createWrappedComponent(DataTableRootWrapper, {
        columns: "columns",
        rows: "rows",
        density: "density",
        truncated: "truncated",
        "allows-sorting": "allowsSorting",
        "selection-mode": "selectionMode",
        "is-resizable": "isResizable",
        "max-width": "maxWidth",
        width: "width",
        "aria-label": "aria-label",
      }),
      propMapping: {
        columns: "columns",
        rows: "rows",
        density: "density",
        truncated: "truncated",
        "allows-sorting": "allowsSorting",
        "selection-mode": "selectionMode",
        "is-resizable": "isResizable",
        "max-width": "maxWidth",
        width: "width",
        "aria-label": "aria-label",
      },
    },
    {
      tagName: "nimbus-data-table-table",
      component: Nimbus.DataTable.Table,
      propMapping: {},
    },
    {
      tagName: "nimbus-data-table-header",
      component: Nimbus.DataTable.Header,
      propMapping: {},
    },
    {
      tagName: "nimbus-data-table-body",
      component: Nimbus.DataTable.Body,
      propMapping: {},
    },
  ],
};

export const nimbusRemoteElements: RemoteElementConfiguration[] = [
  // Card components
  {
    tagName: "nimbus-card-root",
    remoteAttributes: [
      "card-padding",
      "border-style",
      "background-style",
      "elevation",
      "max-width",
      "width",
    ],
  },
  {
    tagName: "nimbus-card-header",
  },
  {
    tagName: "nimbus-card-content",
  },

  // Alert components
  {
    tagName: "nimbus-alert-root",
    remoteAttributes: ["tone", "variant"],
  },
  {
    tagName: "nimbus-alert-title",
  },
  {
    tagName: "nimbus-alert-description",
  },
  {
    tagName: "nimbus-alert-actions",
  },
  {
    tagName: "nimbus-alert-dismiss-button",
    remoteEvents: ["press"],
  },

  // FormField components
  {
    tagName: "nimbus-form-field-root",
    remoteAttributes: [
      "is-required",
      "is-invalid",
      "is-disabled",
      "is-read-only",
    ],
  },
  {
    tagName: "nimbus-form-field-label",
  },
  {
    tagName: "nimbus-form-field-input",
  },
  {
    tagName: "nimbus-form-field-description",
  },
  {
    tagName: "nimbus-form-field-error",
  },

  // Typography
  {
    tagName: "nimbus-heading",
    remoteAttributes: ["size", "margin-bottom"],
  },
  {
    tagName: "nimbus-text",
    remoteAttributes: ["font-size", "font-weight", "color", "margin-bottom"],
  },

  // Interactive components
  {
    tagName: "nimbus-button",
    remoteAttributes: [
      "variant",
      "color-palette",
      "width",
      "is-disabled",
      "margin-top",
      "data-label",
      "type",
      "aria-label",
      "data-intent-type",
      "data-product-id",
      "data-product-name",
    ],
    remoteEvents: ["press"],
  },
  {
    tagName: "nimbus-badge",
    remoteAttributes: ["color-palette", "margin-bottom", "width", "size"],
  },

  // Media
  {
    tagName: "nimbus-image",
    remoteAttributes: ["src", "alt", "border-radius", "margin-bottom"],
  },

  // Layout
  {
    tagName: "nimbus-stack",
    remoteAttributes: [
      "direction",
      "gap",
      "margin-bottom",
      "width",
      "as",
      "action",
      "method",
      "enctype",
    ],
  },
  {
    tagName: "nimbus-flex",
    remoteAttributes: [
      "direction",
      "gap",
      "padding",
      "background-color",
      "border-bottom",
      "border-color",
      "as",
      "action",
      "method",
      "enctype",
    ],
  },
  {
    tagName: "nimbus-box",
    remoteAttributes: [
      "padding",
      "margin-bottom",
      "background-color",
      "border-radius",
    ],
  },

  // Form inputs
  {
    tagName: "nimbus-text-input",
    remoteAttributes: [
      "name",
      "placeholder",
      "is-required",
      "is-disabled",
      "is-read-only",
      "type",
      "min-length",
      "max-length",
      "pattern",
      "min",
      "max",
      "step",
      "accept",
      "multiple",
      "auto-complete",
      "aria-label",
    ],
  },
  {
    tagName: "nimbus-money-input",
    remoteAttributes: [
      "name",
      "currency-code",
      "amount",
      "currencies",
      "placeholder",
      "is-required",
      "is-disabled",
      "is-read-only",
      "is-invalid",
      "size",
      "has-high-precision-badge",
      "is-currency-input-disabled",
      "aria-label",
    ],
  },

  // DataTable components
  {
    tagName: "nimbus-data-table-root",
    remoteAttributes: [
      "columns",
      "rows",
      "density",
      "truncated",
      "allows-sorting",
      "selection-mode",
      "is-resizable",
      "max-width",
      "width",
      "aria-label",
    ],
  },
  {
    tagName: "nimbus-data-table-table",
  },
  {
    tagName: "nimbus-data-table-header",
  },
  {
    tagName: "nimbus-data-table-body",
  },
];

export async function validateNimbusLibrary(serverUrl: string) {
  const response = await fetch(`${serverUrl}/elements`);
  const manifest = await response.json();

  const missingElements: string[] = [];
  const validElements: string[] = [];

  for (const element of manifest.elements) {
    const hasMapping = nimbusLibrary.elements.some(
      (e) => e.tagName === element.tagName
    );

    if (!hasMapping) {
      missingElements.push(element.tagName);
      console.error(`❌ Missing component mapping: ${element.tagName}`);
    } else {
      validElements.push(element.tagName);
    }
  }

  console.log(`✅ Validated ${validElements.length} elements`);

  if (missingElements.length > 0) {
    throw new Error(
      `Missing component mappings: ${missingElements.join(", ")}`
    );
  }

  return manifest;
}
