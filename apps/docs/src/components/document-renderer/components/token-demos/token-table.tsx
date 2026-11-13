import { Code, Flex, Table } from "@commercetools/nimbus";
import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";
import { useCopy } from "./use-copy";

/** Room for the copy button next to the token name. */
const COPY_BUTTON_SPACE = "2rem";

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
  /** The columns after the token name. */
  columns: TokenTableColumn[];
  rows: TokenTableRow[];
  /** Header of the first column. */
  tokenHeader?: string;
  /** Width of the token name, such as `14ch`, without the copy button. */
  tokenWidth?: string;
  /**
   * The narrowest width of the table, as a size token. On a narrower screen
   * the table scrolls sideways, so that no column gets too narrow.
   */
  minWidth?: string;
};

/**
 * A table of tokens: the token name with a button that copies it, and the
 * columns of the caller. The copy button sits next to the name, so that it
 * stays visible when the table scrolls sideways on a narrow screen.
 */
export const TokenTable = ({
  columns,
  rows,
  tokenHeader = "Token",
  tokenWidth = "14ch",
  minWidth = "lg",
}: TokenTableProps) => {
  const { copied, copy } = useCopy();

  return (
    <Table.ScrollArea maxWidth="full">
      <Table.Root size="sm" tableLayout="fixed" minWidth={minWidth}>
        <Table.ColumnGroup>
          <Table.Column width={`calc(${tokenWidth} + ${COPY_BUTTON_SPACE})`} />
          {columns.map((column) => (
            <Table.Column key={column.header} width={column.width} />
          ))}
        </Table.ColumnGroup>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{tokenHeader}</Table.ColumnHeader>
            {columns.map((column) => (
              <Table.ColumnHeader key={column.header} textAlign={column.align}>
                {column.header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row
              key={row.id}
              bg={row.highlight ? "primary.3" : undefined}
            >
              <Table.Cell>
                <Flex align="center" gap="100">
                  <Code variant="subtle">{row.id}</Code>
                  <CopyButton token={row.id} copied={copied} onCopy={copy} />
                </Flex>
              </Table.Cell>
              {row.cells.map((cell, index) => (
                <Table.Cell key={index} textAlign={columns[index]?.align}>
                  {cell}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};
