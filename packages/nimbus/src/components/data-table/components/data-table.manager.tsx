import { lazy, Suspense } from "react";

// Lazy-load the Manager (settings drawer) to keep Drawer, Tabs, DraggableList,
// and SearchInput out of the core DataTable chunk. These heavy dependencies are
// only needed when a consumer explicitly renders <DataTable.Manager />.
const LazyManager = lazy(() => import("./data-table.manager.lazy"));

/**
 * DataTable.Manager - Manager component for the data table
 *
 * Provides a settings drawer for column visibility and layout configuration.
 * Lazy-loaded so the heavy dependencies (Drawer, Tabs, DraggableList) are only
 * fetched when this component is rendered. The Suspense boundary lives here so
 * consumers do not need one of their own.
 */
export const DataTableManager: React.FC = () => (
  <Suspense fallback={null}>
    <LazyManager />
  </Suspense>
);
DataTableManager.displayName = "DataTable.Manager";
