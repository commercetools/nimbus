import { createContext, useContext } from "react";
import type { ComboBoxRootContextValue } from "../combobox.types";

/**
 * Context for ComboBox state and configuration.
 * Uses 'object' as the generic type since different ComboBox instances
 * can have different item types, and TypeScript can't track this through context.
 */
export const ComboBoxRootContext =
  createContext<ComboBoxRootContextValue<object> | null>(null);

/**
 * Hook to access ComboBox context with proper typing.
 * The generic type T represents the item type used in the ComboBox.
 * At runtime, the context contains the correct type from ComboBox.Root.
 */
export const useComboBoxRootContext = <
  T extends object = object,
>(): ComboBoxRootContextValue<T> => {
  const context = useContext(ComboBoxRootContext);
  if (!context) {
    throw new Error(
      "Nimbus - ComboBox components must be used within ComboBox.Root"
    );
  }
  // Type assertion is safe: ComboBox.Root provides the context with type T,
  // but TypeScript can't track generics through context at compile time.
  // We use 'unknown' as an intermediate step to satisfy TypeScript's strict checking.
  return context as unknown as ComboBoxRootContextValue<T>;
};
