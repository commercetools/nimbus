import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import {
  IconButton,
  Drawer,
  Tabs,
  Tooltip,
  UPDATE_ACTIONS,
} from "@/components";
import { Settings, ViewWeek, ViewDay } from "@commercetools/nimbus-icons";
import VisibleColumnsPanel from "./data-table-visible-columns-panel";
import LayoutSettingsPanel from "./data-table-layout-settings-panel";
import { useDataTableContext } from "./data-table.context";
import type { DataTableColumnItem } from "../data-table.types";
import { messages } from "../data-table.i18n";

export const DataTableManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useDataTableContext();
  const { formatMessage } = useIntl();

  const { columns, visibleColumns, onColumnsChange, onSettingsChange } =
    context;
  const hiddenColumns = columns.filter(
    (col) => !visibleColumns?.includes(col.id)
  );

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

  if (!visibleColumns || !hiddenColumns) {
    return null;
  }

  // Handle when visible columns are updated (reordered or removed)
  // Memoized to prevent infinite re-renders in child components
  const handleVisibleColumnsUpdate = useCallback(
    (updatedItems: { id: string; key?: string; label?: React.ReactNode }[]) => {
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
    },
    [onColumnsChange]
  );

  const handleSettingsChange = (
    action: (typeof UPDATE_ACTIONS)[keyof typeof UPDATE_ACTIONS] | undefined
  ) => {
    if (onSettingsChange) {
      onSettingsChange(action);
    }
  };

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

  const defaultTrigger = (
    <Tooltip.Root>
      <Tooltip.Content placement="top">
        {formatMessage(messages.settings)}
      </Tooltip.Content>
      <IconButton
        variant="ghost"
        tone="primary"
        size="xs"
        aria-label={formatMessage(messages.settings)}
        onClick={() => setIsOpen(true)}
      >
        <Settings />
      </IconButton>
    </Tooltip.Root>
  );

  return (
    <>
      {defaultTrigger}
      <Drawer.Root
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="right"
        data-testid="data-table-manager-drawer"
      >
        <Drawer.Content width="640px" data-testid="data-table-manager-drawer">
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
                      {formatMessage(messages.layoutSettings)}
                    </>
                  ),
                  panelContent: (
                    <LayoutSettingsPanel
                      onSettingsChange={handleSettingsChange}
                    />
                  ),
                },
                // TODO: Add custom settings tab here!
                // {
                //   id: "custom-settings",
                //   tabLabel: (
                //     <>
                //       {props.icon}
                //       {props.label}
                //     </>
                //   ),
                //   panelContent: props.panelContent,
                // },
              ]}
            />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

DataTableManager.displayName = "DataTable.Manager";
