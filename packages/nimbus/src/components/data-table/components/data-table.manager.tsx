import { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Drawer, Tabs } from "@/components";
import { Settings, ViewWeek, ViewDay } from "@commercetools/nimbus-icons";
import VisibleColumnsPanel from "./data-table-visible-columns-panel";
import LayoutSettingsPanel from "./data-table-layout-settings-panel";
import { useDataTableContext } from "./data-table.context";
import type { DataTableColumnItem } from "../data-table.types";
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
  const { columns, visibleColumns, onColumnsChange, onSettingsChange } =
    context;
  const hiddenColumns = columns.filter(
    (col) => !visibleColumns?.includes(col.id)
  );

  if (!visibleColumns || !hiddenColumns) {
    return null;
  }

  // Handle when visible columns are updated (reordered or removed)
  const handleVisibleColumnsUpdate = (
    updatedItems: DataTableColumnItem<Record<string, unknown>>[]
  ) => {
    // Also notify about column order changes if callback is provided
    if (onColumnsChange) {
      onColumnsChange(updatedItems);
    }
  };

  const handleSettingsChange = (
    action: "toggleTextVisibility" | "toggleRowDensity"
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

  const visibleItems = useMemo(
    () =>
      columns
        .filter((item) => visibleColumns?.includes(item.id))
        .map((item) => ({
          key: item.id,
          id: item.id,
          label: item.header,
        })),
    [columns, visibleColumns]
  );

  const handleResetColumns = () => {
    //TODO: Reset to original column order and visibility
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
                    <VisibleColumnsPanel
                      hiddenItems={hiddenItems}
                      visibleItems={visibleItems}
                      // @ts-expect-error - TODO: fix types error here!
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
