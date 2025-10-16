import { useState } from "react";
import { useIntl } from "react-intl";
import {
  Button,
  IconButton,
  Flex,
  DraggableList,
  Drawer,
  Tabs,
} from "@/components";
import { Stack, Box, Text } from "@chakra-ui/react";
import {
  Settings,
  Refresh,
  ViewWeek,
  ViewDay,
  VisibilityOff,
  Visibility,
} from "@commercetools/nimbus-icons";
import { useDataTableContext } from "./data-table.context";
import type { TColumnListItem } from "../data-table.types";
import { messages } from "../data-table.i18n";

export type DataTableManagerProps = {
  // /** Position of the settings button - can be a render prop for custom positioning */
  renderTrigger?: (props: { onClick: () => void }) => React.ReactNode;
};

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
export const DataTableManager = ({ renderTrigger }: DataTableManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useDataTableContext();
  const { formatMessage } = useIntl();

  // Get all columns from context
  const allColumns = context.columns;
  const { visibleColumns, onColumnsChange } = context;
  const hiddenColumns = allColumns.filter(
    (col) => !visibleColumns?.includes(col.id)
  );

  if (!visibleColumns || !hiddenColumns) {
    return null;
  }

  // const handleResetColumns = () => {
  //   // Reset to original column order and visibility
  //   const resetVisible: TColumnListItem[] = [];
  //   const resetHidden: TColumnListItem[] = [];

  //   allColumns.forEach((col) => {
  //     const item: TColumnListItem = {
  //       key: col.id,
  //       label: col.header,
  //       id: col.id,
  //       column: col,
  //     };

  //     if (col.isVisible !== false) {
  //       resetVisible.push(item);
  //     } else {
  //       resetHidden.push(item);
  //     }
  //   });

  //   // Notify parent of reset
  //   if (onColumnsChange) {
  //     onColumnsChange(allColumns);
  //   }
  // };

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
                      <Flex gap="400" width="100%" mb="800">
                        {/* Hidden Columns Section */}
                        <Box>
                          <Stack direction="row" alignItems="center" mb="200">
                            <VisibilityOff />
                            <Text fontWeight="700" fontSize="sm">
                              {formatMessage(messages.hiddenColumns)}
                            </Text>
                          </Stack>
                          <DraggableList.Root
                            h="full"
                            items={allColumns
                              .filter(
                                (item) => !visibleColumns?.includes(item.id)
                              )
                              .map((item) => ({
                                key: item.id,
                                id: item.id,
                                label: item.header,
                              }))}
                            aria-label={formatMessage(
                              messages.hiddenColumnsAriaLabel
                            )}
                            renderEmptyState={
                              <Text fontSize="sm" color="gray.9">
                                {formatMessage(messages.noHiddenColumns)}
                              </Text>
                            }
                          />
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
                            removableItems
                            h="full"
                            items={allColumns
                              .filter((item) =>
                                visibleColumns?.includes(item.id)
                              )
                              .map((item) => ({
                                key: item.id,
                                id: item.id,
                                label: item.header,
                              }))}
                            onUpdateItems={(
                              updatedItems: TColumnListItem[]
                            ) => {
                              if (onColumnsChange) {
                                onColumnsChange(updatedItems);
                              }
                            }}
                            aria-label={formatMessage(
                              messages.visibleColumnsAria
                            )}
                          />
                        </Box>
                      </Flex>

                      {/* Reset Button */}
                      <Box>
                        <Button
                          variant="ghost"
                          tone="primary"
                          size="md"
                          // onClick={handleResetColumns}
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
