/**
 * Shared type re-exports from external dependencies.
 *
 * This module provides convenient access to commonly used types from
 * third-party libraries that are used across multiple Nimbus components.
 */

/**
 * Date value type from @internationalized/date
 * Used by: Calendar, DatePicker, DateInput, DateRangePicker
 */
export type { DateValue } from "@internationalized/date";

/**
 * Time value type from react-aria
 * Used by: TimeInput, DatePicker (with time), DateRangePicker (with time)
 */
export type { TimeValue } from "react-aria";

/**
 * Key type for collection items from react-aria-components
 * Used by: Select, ComboBox, Menu, TagGroup, DataTable, and other collection components
 */
export type { Key } from "react-aria-components";
