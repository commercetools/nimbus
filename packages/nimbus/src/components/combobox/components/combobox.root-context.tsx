import { createContext, useContext } from "react";
import type { ComboBoxRootContextValue } from "../combobox.types";

export const ComboBoxRootContext =
  createContext<ComboBoxRootContextValue<object> | null>(null);

export const useComboBoxRootContext = <
  T extends object,
>(): ComboBoxRootContextValue<T> => {
  const context = useContext(ComboBoxRootContext);
  if (!context) {
    throw new Error(
      "Nimbus - ComboBox components must be used within ComboBox.Root"
    );
  }
  return context as ComboBoxRootContextValue<T>;
};
