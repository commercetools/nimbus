import { Box, Code, Table } from "@commercetools/nimbus";
import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";
import { useCopy } from "./use-copy";

export interface TokenTableColumn {
  header: string;
  /** A width such as `12ch`. A column without a width takes the rest. */
  width?: string;
  align?: "left" | "right";
}

export interface TokenTableRow {
  /** The token name: shown in the first column and copied by the button. */
  id: string;
  /** One cell for each column. */
  cells: ReactNode[];
  /** Marks the row, for example for the selected token. */
  highlight?: boolean;
}

type TokenTableProps = {
  /** The columns between the token name and the copy button. */
  columns: TokenTableColumn[];
  rows: TokenTableRow[];
  /** Width of the token column. */
  tokenWidth?: string;
  /**
   * The narrowest width of the table, as a size token. On a narrower screen
   * the table scrolls sideways, so that no column gets too narrow.
   */
  minWidth?: string;
};

/**
 * A table of tokens: the token name, the columns of the caller, and a button
 * that copies the token name.
 */
export const TokenTable = ({
  columns,
  rows,
  tokenWidth = "14ch",
  minWidth = "lg",
}: TokenTableProps) => {
  const { copied, copy } = useCopy();

  return (
    <Table.ScrollArea maxWidth="full">
      <Table.Root size="sm" tableLayout="fixed" minWidth={minWidth}>
        <Table.ColumnGroup>
          <Table.Column width={tokenWidth} />
          {columns.map((column) => (
            <Table.Column key={column.header} width={column.width} />
          ))}
          <Table.Column width="1200" />
        </Table.ColumnGroup>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Token</Table.ColumnHeader>
            {columns.map((column) => (
              <Table.ColumnHeader key={column.header} textAlign={column.align}>
                {column.header}
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader>
              <Box srOnly>Copy</Box>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row
              key={row.id}
              bg={row.highlight ? "primary.3" : undefined}
            >
              <Table.Cell>
                <Code variant="subtle">{row.id}</Code>
              </Table.Cell>
              {row.cells.map((cell, index) => (
                <Table.Cell key={index} textAlign={columns[index]?.align}>
                  {cell}
                </Table.Cell>
              ))}
              <Table.Cell textAlign="right">
                <CopyButton token={row.id} copied={copied} onCopy={copy} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};
