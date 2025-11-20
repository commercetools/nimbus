import type { Meta } from "@storybook/react-vite";
import { DataTable } from "@/components";

// Import all stories from individual files
export { Base } from "./stories/base";
export { ColumnManager } from "./stories/column-manager";
export { CustomColumn } from "./stories/custom-column";
export { SearchAndHighlight } from "./stories/search-and-highlight";
export { AdjustableColumns } from "./stories/adjustable-columns";
export { ControlledSorting } from "./stories/controlled-sorting";
export { Condensed } from "./stories/condensed";
export { StickyHeader } from "./stories/sticky-header";
export { ClickableRows } from "./stories/clickable-rows";
export { WithSorting } from "./stories/with-sorting";
export { SortingWithSearch } from "./stories/sorting-with-search";
export { SelectionShowcase } from "./stories/selection-showcase";
export { TextTruncation } from "./stories/text-truncation";
export { MultilineHeaders } from "./stories/multiline-headers";
export { WithFooter } from "./stories/with-footer";
export { HorizontalScrolling } from "./stories/horizontal-scrolling";
export { FlexibleNestedChildren } from "./stories/flexible-nested-children";
export { NoNestedContent } from "./stories/no-nested-content";
export { NestedTable } from "./stories/nested-table";
export { AllFeatures } from "./stories/all-features";
export { DisabledRowsShowcase } from "./stories/disabled-rows-showcase";
export { RowPinning } from "./stories/row-pinning";
export { RowPinningEdgeCases } from "./stories/row-pinning-edge-cases";
export { WithTableManager } from "./stories/with-table-manager";
export { CustomColumnManager } from "./stories/custom-column-manager";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;
