import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { IconButton, Drawer, Tabs, Tooltip, Box } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import { Settings, ViewWeek, ViewDay } from "@commercetools/nimbus-icons";
import { VisibleColumnsPanel } from "./data-table.visible-columns-panel";
import { LayoutSettingsPanel } from "./data-table.layout-settings-panel";
import {
  useDataTableContext,
  useCustomSettingsContext,
} from "./data-table.context";
import type { DataTableColumnItem } from "../data-table.types";
import { dataTableMessagesStrings } from "../data-table.messages";

/**
 * DataTable.Manager - Manager component for the data table
 *
 * @supportsStyleProps
 */
export const DataTableManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useDataTableContext();
  const msg = useLocalizedStringFormatter(dataTableMessagesStrings);

  const {
    columns,
    visibleColumns,
    onColumnsChange,
    onSettingsChange,
    // customSettings,
  } = context;
  const hiddenColumns = columns.filter(
    (col) => !visibleColumns?.includes(col.id)
  );

  const { customSettings } = useCustomSettingsContext();

  // Store columns in a ref to avoid recreating the callback
  const columnsRef = useRef(columns);
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  // Store initial columns state for reset functionality
  const initialColumnsRef =
    useRef<DataTableColumnItem<Record<string, unknown>>[]>(columns);
  const initialVisibleColumnsRef = useRef<string[] | undefined>(visibleColumns);

  // Track last notified columns to prevent calling onColumnsChange unnecessarily
  const lastNotifiedColumnsRef = useRef<string[]>(visibleColumns || []);

  // Handle when visible columns are updated (reordered or removed)
  // Memoized to prevent infinite re-renders in child components
  const handleVisibleColumnsUpdate = useMemo(() => {
    return (
      updatedItems: { id: string; key?: string; label?: React.ReactNode }[]
    ) => {
      const updatedIds = updatedItems.map((item) => item.id);

      // Check if IDs or order has actually changed
      const hasChanged =
        updatedIds.length !== lastNotifiedColumnsRef.current.length ||
        updatedIds.some(
          (id, index) => id !== lastNotifiedColumnsRef.current[index]
        );

      if (!hasChanged) {
        // No changes, skip update
        return;
      }

      // Convert simplified items back to full column objects
      const columnMap = new Map(columnsRef.current.map((col) => [col.id, col]));
      const updatedColumns = updatedItems
        .map((item) => columnMap.get(item.id))
        .filter(
          (col): col is DataTableColumnItem<Record<string, unknown>> =>
            col !== undefined
        );

      // Update the ref with new IDs
      lastNotifiedColumnsRef.current = updatedIds;

      // Notify about column order and visibility changes if callback is provided
      if (onColumnsChange) {
        onColumnsChange(updatedColumns);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hiddenItems = useMemo(() => {
    return columns
      .filter((item) => !visibleColumns?.includes(item.id))
      .map((item) => ({
        key: item.id,
        id: item.id,
        label: item.header,
      }));
  }, [visibleColumns, columns]);

  // Create a map of column IDs to preserve order from visibleColumns
  const visibleItems = useMemo(() => {
    if (!visibleColumns || visibleColumns.length === 0) {
      return [];
    }

    const columnMap = new Map(columns.map((col) => [col.id, col]));

    // Map visible column IDs to their full column data, preserving order
    return visibleColumns
      .map((id) => {
        const col = columnMap.get(id);
        return col
          ? {
              key: col.id,
              id: col.id,
              label: col.header,
            }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [columns, visibleColumns]);

  const handleResetColumns = useCallback(() => {
    // Reset to original column order and visibility
    if (onColumnsChange) {
      const initialVisibleCols = initialVisibleColumnsRef.current;

      // If there were initially visible columns specified, restore them
      if (initialVisibleCols && initialVisibleCols.length > 0) {
        const columnMap = new Map(
          initialColumnsRef.current.map((col) => [col.id, col])
        );

        // Map the initial visible column IDs back to their full column objects
        const restoredColumns = initialVisibleCols
          .map((id) => columnMap.get(id))
          .filter(
            (col): col is DataTableColumnItem<Record<string, unknown>> =>
              col !== undefined
          );

        // Update the refs
        lastNotifiedColumnsRef.current = initialVisibleCols;

        // Notify parent
        onColumnsChange(restoredColumns);
      } else {
        // No initial visibleColumns was set, so restore all columns
        lastNotifiedColumnsRef.current = initialColumnsRef.current.map(
          (col) => col.id
        );
        onColumnsChange(initialColumnsRef.current);
      }
    }
  }, [onColumnsChange]);

  if (!visibleColumns || !hiddenColumns) {
    return null;
  }

  return (
    <>
      <Tooltip.Root>
        <Tooltip.Content placement="top">
          {msg.format("settings")}
        </Tooltip.Content>
        <IconButton
          variant="ghost"
          colorPalette="primary"
          size="xs"
          aria-label={msg.format("settings")}
          onPress={() => setIsOpen(true)}
        >
          <Settings />
        </IconButton>
      </Tooltip.Root>
      <Drawer.Root
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="right"
        data-testid="data-table-manager-drawer"
      >
        <Drawer.Content
          width="2xl"
          data-testid="data-table-manager-drawer"
          aria-label={msg.format("settings")}
        >
          <Drawer.Header>
            <Drawer.Title>{msg.format("settings")}</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body>
            <Tabs.Root
              tabListAriaLabel={msg.format("settingsTabsAriaLabel")}
              tabs={[
                {
                  id: "visible-columns",
                  tabLabel: (
                    <>
                      <ViewWeek />
                      {msg.format("visibleColumns")}
                    </>
                  ),
                  panelContent: (
                    <VisibleColumnsPanel
                      hiddenItems={hiddenItems}
                      visibleItems={visibleItems}
                      handleVisibleColumnsUpdate={handleVisibleColumnsUpdate}
                      handleResetColumns={handleResetColumns}
                    />
                  ),
                },
                {
                  id: "layout-settings",
                  tabLabel: (
                    <>
                      <ViewDay />
                      {msg.format("layoutSettings")}
                    </>
                  ),
                  panelContent: (
                    <LayoutSettingsPanel onSettingsChange={onSettingsChange} />
                  ),
                },
                customSettings
                  ? {
                      id: "custom-settings",
                      tabLabel: (
                        <>
                          {customSettings?.icon ?? null}
                          {customSettings?.label}
                        </>
                      ),
                      panelContent: <Box mt="800">{customSettings.panel}</Box>,
                    }
                  : null,
                // Filter out null values when no custom settings are provided
              ].filter((tab): tab is NonNullable<typeof tab> => tab !== null)}
            />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

DataTableManager.displayName = "DataTable.Manager";
