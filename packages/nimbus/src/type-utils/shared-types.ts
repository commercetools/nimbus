import { SEMANTIC_PALETTES, ALL_PALETTES } from "@/internal-utils/constants";
/**
 * Shared type re-exports from external dependencies.
 *
 * This module provides convenient access to commonly used types from
 * third-party libraries that are used across multiple Nimbus components.
 */
import type { ConditionalValue } from "@chakra-ui/react";
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

/**
 * Union type of all available color palette names.
 * Derived from ALL_PALETTES constant to ensure type safety when referencing palettes.
 */
export type NimbusColorPalette = (typeof ALL_PALETTES)[number];

/**
 * Union type of all available semantic palette names.
 * Derived from SEMANTIC_PALETTES constant to ensure type safety when referencing palettes.
 */
type SemanticColorPalette = (typeof SEMANTIC_PALETTES)[number];

/**
 * Utility Type that narrows the colorPalette prop in chakra-ui recipes to only accept semantic color palettes
 */
export type SemanticPalettesOnly = ConditionalValue<SemanticColorPalette>;
