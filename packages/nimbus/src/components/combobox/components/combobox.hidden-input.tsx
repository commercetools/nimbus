import { useMemo } from "react";
import type { ComboBoxHiddenInputProps } from "../combobox.types";

/**
 * # ComboBoxHiddenInput (Internal Component)
 *
 * Hidden input element for form submission.
 * Follows React Aria's pattern for ComboBox form integration.
 *
 * By default, submits the selected item's key.
 * When formValue="text" or allowsCustomOptions=true, submits the text value instead.
 *
 * @see https://react-spectrum.adobe.com/react-aria/ComboBox.html#html-forms
 * @internal
 */
export const ComboBoxHiddenInput = <T extends object>(
  props: ComboBoxHiddenInputProps<T>
) => {
  const {
    name,
    form,
    selectedKeys,
    selectionMode,
    formValue,
    allowsCustomOptions,
    collection,
    inputValue,
  } = props;

  // Compute the value for form submission based on formValue prop
  // Following React Aria's pattern: https://react-spectrum.adobe.com/react-aria/ComboBox.html#html-forms
  const value = useMemo(() => {
    if (selectionMode === "single") {
      const selectedKey = Array.from(selectedKeys)[0];
      if (!selectedKey) return "";

      // If formValue is "text" or allowsCustomOptions is true, submit the text
      if (formValue === "text" || allowsCustomOptions) {
        // Find the selected item and return its text value
        const selectedItem = Array.from(collection).find(
          (node) => node.key === selectedKey
        );
        return selectedItem?.textValue || inputValue || "";
      }
      // Default: return the key
      return String(selectedKey);
    } else {
      // Multi-select: return comma-separated values
      const keys = Array.from(selectedKeys);
      if (formValue === "text" || allowsCustomOptions) {
        return keys
          .map((key) => {
            const item = Array.from(collection).find(
              (node) => node.key === key
            );
            return item?.textValue || "";
          })
          .filter(Boolean)
          .join(",");
      }
      // Default: return comma-separated keys
      return keys.join(",");
    }
  }, [
    selectionMode,
    selectedKeys,
    formValue,
    allowsCustomOptions,
    collection,
    inputValue,
  ]);

  // Don't render if no name prop provided
  if (!name) return null;

  return (
    <input
      type="hidden"
      name={name}
      form={typeof form === "string" ? form : undefined}
      value={value}
    />
  );
};

ComboBoxHiddenInput.displayName = "ComboBoxHiddenInput";
