import * as Nimbus from "@commercetools/nimbus";
import type { MoneyInputValue } from "@commercetools/nimbus";

/**
 * Simple component library mapping - just tag names to React components
 * No prop mapping needed - server sends camelCase React props directly
 */

// Wrapper for DataTable that parses JSON strings
const DataTableWrapper = (props: Record<string, unknown>) => {
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
        return {
          ...col,
          accessor: (row: Record<string, unknown>) => row[col.id],
        };
      }
      return col;
    }
  );

  // Use DataTable convenience component (not compound structure)
  return (
    <Nimbus.DataTable
      columns={transformedColumns}
      rows={parsedRows}
      {...restProps}
    />
  );
};

// Wrapper for MoneyInput to handle value prop construction
const MoneyInputWrapper = (props: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currencyCode, amount, currencies, children, ...restProps } = props;

  // Parse currencies if it's a JSON string
  const parsedCurrencies =
    typeof currencies === "string" ? JSON.parse(currencies) : currencies;

  // Construct the value object from currencyCode and amount
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

/**
 * Component map matching server element builders
 * Server sends camelCase React props directly - no mapping needed
 *
 * Elements correspond to builders in: apps/mcp-ui-poc/server/src/elements/
 */
export const componentMap: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  // Badge (elements/badge.ts)
  "nimbus-badge": Nimbus.Badge as React.ComponentType<Record<string, unknown>>,

  // Button (elements/button.ts)
  "nimbus-button": Nimbus.Button,

  // Card (elements/card.ts)
  "nimbus-card-root": Nimbus.Card.Root as React.ComponentType<
    Record<string, unknown>
  >,
  "nimbus-card-header": Nimbus.Card.Header,
  "nimbus-card-content": Nimbus.Card.Content,

  // Flex (elements/flex.ts)
  "nimbus-flex": Nimbus.Flex,

  // FormField (elements/form-field.ts)
  "nimbus-form-field-root": Nimbus.FormField.Root as React.ComponentType<
    Record<string, unknown>
  >,
  "nimbus-form-field-label": Nimbus.FormField.Label,
  "nimbus-form-field-input": Nimbus.FormField.Input,
  "nimbus-form-field-description": Nimbus.FormField.Description,
  "nimbus-form-field-error": Nimbus.FormField.Error,

  // Heading (elements/heading.ts)
  "nimbus-heading": Nimbus.Heading,

  // Image (elements/image.ts)
  "nimbus-image": Nimbus.Image,

  // MoneyInput (elements/money-input.ts)
  "nimbus-money-input": MoneyInputWrapper,

  // Stack (elements/stack.ts)
  "nimbus-stack": Nimbus.Stack,

  // Text (elements/text.ts)
  "nimbus-text": Nimbus.Text,

  // TextInput (elements/text-input.ts)
  "nimbus-text-input": Nimbus.TextInput,

  // DataTable (convenience component - not a server element builder)
  "nimbus-data-table": DataTableWrapper,
};
