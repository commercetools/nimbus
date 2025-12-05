import { type Key } from "react-stately";
/**
 * Default key extractor - uses string/number id or object with id property
 */
export function defaultGetKey<T extends object>(
  item: T | string | number
): Key {
  if (typeof item === "string" || typeof item === "number") {
    return item as Key;
  }
  if ("id" in item) {
    return (item as { id: Key }).id;
  }
  throw new Error(
    "ComboBox - Item must have an 'id' property or provide getKey function"
  );
}

/**
 * Default text value extractor - uses string item or object with name property
 */
export function defaultGetTextValue<T extends object>(
  item: T | string
): string {
  if (typeof item === "string") {
    return item;
  }
  if ("name" in item) {
    return String((item as { name: unknown }).name);
  }
  if ("label" in item) {
    return String((item as { label: unknown }).label);
  }
  console.warn(
    "ComboBox - Item should have 'name' or 'label' property. Provide a getTextValue function to ensure proper item display and filtering."
  );
  return String(item);
}

/**
 * Default getNewOptionData - creates an object with id and name
 */
export function defaultGetNewOptionData<T extends object>(
  inputValue: string
): T {
  return {
    id: inputValue,
    name: inputValue,
  } as T;
}
