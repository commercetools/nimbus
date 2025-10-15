import { useState, useMemo, useEffect } from "react";
import { useIntl } from "react-intl";
import { Drawer } from "../../drawer/drawer";
import { Tabs } from "../../tabs/tabs";
import { DraggableList } from "../../draggable-list/draggable-list";
import { Button, IconButton, Flex } from "@/components";
import { Stack, Box, Text, HStack } from "@chakra-ui/react";
import {
  Settings,
  Close,
  Refresh,
  ViewWeek,
  ViewDay,
  VisibilityOff,
  Visibility,
} from "@commercetools/nimbus-icons";
import { useDataTableContext } from "./data-table.context";
import type { DataTableColumnItem } from "../data-table.types";
import { messages } from "../data-table.i18n";

export interface DataTableManagerProps {
  /** Position of the settings button - can be a render prop for custom positioning */
  renderTrigger?: (props: { onClick: () => void }) => React.ReactNode;
  /** Callback when columns are reordered or visibility changes */
  onColumnsChange?: (columns: DataTableColumnItem[]) => void;
}

interface ColumnListItem {
  key: string;
  label: React.ReactNode;
  id: string;
  column: DataTableColumnItem;
}

/**
 * # DataTable.Manager
 *
 * A settings panel that allows users to manage table columns visibility and layout.
 * Opens in a drawer with tabs for "Visible columns" and "Layout settings".
 * Uses drag-and-drop to reorder columns.
 *
 * @example
 * ```tsx
 * <DataTable.Root columns={columns} rows={rows}>
 *   <DataTable.Manager />
 *   <DataTable.Table>
 *     <DataTable.Header />
 *     <DataTable.Body />
 *   </DataTable.Table>
 * </DataTable.Root>
 * ```
 */
export const DataTableManager = ({
  renderTrigger,
  onColumnsChange,
}: DataTableManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useDataTableContext();
  const { formatMessage } = useIntl();

  // Get all columns from context
  const allColumns = context.columns;

  // Separate visible and hidden columns
  const { visibleColumnItems, hiddenColumnItems } = useMemo(() => {
    const visible: ColumnListItem[] = [];
    const hidden: ColumnListItem[] = [];

    allColumns.forEach((col) => {
      const item: ColumnListItem = {
        key: col.id,
        label: col.header,
        id: col.id,
        column: col,
      };

      const isVisible = context.visibleColumns
        ? context.visibleColumns.includes(col.id)
        : col.isVisible !== false;

      if (isVisible) {
        visible.push(item);
      } else {
        hidden.push(item);
      }
    });

    return { visibleColumnItems: visible, hiddenColumnItems: hidden };
  }, [allColumns, context.visibleColumns]);

  const [visibleColumns, setVisibleColumns] =
    useState<ColumnListItem[]>(visibleColumnItems);
  const [hiddenColumns, setHiddenColumns] =
    useState<ColumnListItem[]>(hiddenColumnItems);

  // Update local state when context changes
  useEffect(() => {
    setVisibleColumns(visibleColumnItems);
    setHiddenColumns(hiddenColumnItems);
  }, [visibleColumnItems, hiddenColumnItems]);

  const handleMoveToHidden = (columnId: string) => {
    const column = visibleColumns.find((col) => col.id === columnId);
    if (column) {
      setVisibleColumns(visibleColumns.filter((col) => col.id !== columnId));
      setHiddenColumns([...hiddenColumns, column]);

      // Notify parent of change
      if (onColumnsChange) {
        const updatedColumns = allColumns.map((col) =>
          col.id === columnId ? { ...col, isVisible: false } : col
        );
        onColumnsChange(updatedColumns);
      }
    }
  };

  const handleMoveToVisible = (columnId: string) => {
    const column = hiddenColumns.find((col) => col.id === columnId);
    if (column) {
      setHiddenColumns(hiddenColumns.filter((col) => col.id !== columnId));
      setVisibleColumns([...visibleColumns, column]);

      // Notify parent of change
      if (onColumnsChange) {
        const updatedColumns = allColumns.map((col) =>
          col.id === columnId ? { ...col, isVisible: true } : col
        );
        onColumnsChange(updatedColumns);
      }
    }
  };

  const handleResetColumns = () => {
    // Reset to original column order and visibility
    const resetVisible: ColumnListItem[] = [];
    const resetHidden: ColumnListItem[] = [];

    allColumns.forEach((col) => {
      const item: ColumnListItem = {
        key: col.id,
        label: col.header,
        id: col.id,
        column: col,
      };

      if (col.isVisible !== false) {
        resetVisible.push(item);
      } else {
        resetHidden.push(item);
      }
    });

    setVisibleColumns(resetVisible);
    setHiddenColumns(resetHidden);

    // Notify parent of reset
    if (onColumnsChange) {
      onColumnsChange(allColumns);
    }
  };

  const handleVisibleColumnsReorder = (items: ColumnListItem[]) => {
    setVisibleColumns(items);

    // Notify parent of reorder
    if (onColumnsChange) {
      const reorderedColumns = items.map((item) => item.column);
      const hiddenColumnsData = hiddenColumns.map((item) => item.column);
      onColumnsChange([...reorderedColumns, ...hiddenColumnsData]);
    }
  };

  const defaultTrigger = (
    <IconButton
      variant="ghost"
      tone="primary"
      size="md"
      aria-label={formatMessage(messages.settings)}
      onClick={() => setIsOpen(true)}
    >
      <Settings />
    </IconButton>
  );

  return (
    <>
      {renderTrigger
        ? renderTrigger({ onClick: () => setIsOpen(true) })
        : defaultTrigger}

      <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen} placement="right">
        <Drawer.Content width="640px">
          <Drawer.Header>
            <Drawer.Title>{formatMessage(messages.settings)}</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body>
            <Tabs.Root
              tabs={[
                {
                  id: "visible-columns",
                  tabLabel: (
                    <>
                      <ViewWeek />
                      {formatMessage(messages.visibleColumns)}
                    </>
                  ),
                  panelContent: (
                    <Stack gap="400" mt="400">
                      <Flex gap="400" width="100%">
                        {/* Hidden Columns Section */}
                        <Box>
                          <Stack direction="row" alignItems="center" mb="200">
                            <VisibilityOff />
                            <Text fontWeight="700" fontSize="sm">
                              {formatMessage(messages.hiddenColumns)}
                            </Text>
                          </Stack>
                          {hiddenColumns.length === 0 ? (
                            <Text fontSize="sm" color="gray.9">
                              {formatMessage(messages.noHiddenColumns)}
                            </Text>
                          ) : (
                            <DraggableList.Root
                              items={hiddenColumns.map((item) => ({
                                key: item.key,
                                id: item.id,
                                label: item.label,
                              }))}
                              onUpdateItems={() => handleVisibleColumnsReorder}
                              aria-label={formatMessage(
                                messages.hiddenColumnsAriaLabel
                              )}
                            >
                              {(item) => (
                                <DraggableList.Item
                                  key={item.key}
                                  id={item.id as string}
                                >
                                  <HStack
                                    width="100%"
                                    justifyContent="space-between"
                                    px="200"
                                  >
                                    <Text fontSize="sm" flex="1">
                                      {item.label}
                                    </Text>
                                    <IconButton
                                      variant="ghost"
                                      size="2xs"
                                      tone="primary"
                                      aria-label={formatMessage(
                                        messages.hideColumn
                                      )}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveToVisible(item.id);
                                      }}
                                    >
                                      <Close />
                                    </IconButton>
                                  </HStack>
                                </DraggableList.Item>
                              )}
                            </DraggableList.Root>
                          )}
                        </Box>

                        {/* Visible Columns Section */}
                        <Box>
                          <Stack direction="row" alignItems="center" mb="200">
                            <Visibility />
                            <Text fontWeight="700" fontSize="sm">
                              {formatMessage(messages.visibleColumnsList)}
                            </Text>
                          </Stack>
                          <DraggableList.Root
                            items={visibleColumns.map((item) => ({
                              key: item.key,
                              id: item.id,
                              label: item.label,
                            }))}
                            onUpdateItems={() => handleVisibleColumnsReorder}
                            aria-label={formatMessage(
                              messages.visibleColumnsAria
                            )}
                          >
                            {(item) => (
                              <DraggableList.Item
                                key={item.key}
                                id={item.id as string}
                              >
                                <HStack
                                  width="100%"
                                  justifyContent="space-between"
                                  px="200"
                                >
                                  <Text fontSize="sm" flex="1">
                                    {item.label}
                                  </Text>
                                  <IconButton
                                    variant="ghost"
                                    size="2xs"
                                    tone="primary"
                                    aria-label={formatMessage(
                                      messages.hideColumn
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveToHidden(item.id);
                                    }}
                                  >
                                    <Close />
                                  </IconButton>
                                </HStack>
                              </DraggableList.Item>
                            )}
                          </DraggableList.Root>
                        </Box>
                      </Flex>

                      {/* Reset Button */}
                      <Box>
                        <Button
                          variant="ghost"
                          tone="primary"
                          size="md"
                          onClick={handleResetColumns}
                        >
                          <Refresh />
                          {formatMessage(messages.reset)}
                        </Button>
                      </Box>
                    </Stack>
                  ),
                },
                {
                  id: "layout-settings",
                  tabLabel: (
                    <>
                      <ViewDay />
                      {formatMessage(messages.layoutSettings)}
                    </>
                  ),
                  panelContent: (
                    <Box mt="400">
                      {/* //TODO: Add layout settings content */}
                      <Text fontSize="sm" color="gray.9">
                        <>Layout settings here</>
                      </Text>
                    </Box>
                  ),
                },
              ]}
            />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

DataTableManager.displayName = "DataTable.Manager";
