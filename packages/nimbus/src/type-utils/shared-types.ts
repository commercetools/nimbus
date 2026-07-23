import {
  SEMANTIC_COLOR_PALETTES,
  ALL_COLOR_PALETTES,
} from "@/constants/color-palettes";
/**
 * Shared type re-exports from external dependencies.
 *
 * This module provides convenient access to commonly used types from
 * third-party libraries that are used across multiple Nimbus components.
 */
import type { ConditionalValue } from "@chakra-ui/react/styled-system";
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
 * Union type of all available color palette names.
 * Derived from ALL_PALETTES constant to ensure type safety when referencing palettes.
 */
export type NimbusColorPalette = (typeof ALL_COLOR_PALETTES)[number];

/**
 * Union type of all available semantic palette names.
 * Derived from SEMANTIC_PALETTES constant to ensure type safety when referencing palettes.
 */
type SemanticColorPalette = (typeof SEMANTIC_COLOR_PALETTES)[number];

/**
 * Utility Type that narrows the colorPalette prop in chakra-ui recipes to only accept semantic color palettes
 */
export type SemanticPalettesOnly = ConditionalValue<SemanticColorPalette>;
