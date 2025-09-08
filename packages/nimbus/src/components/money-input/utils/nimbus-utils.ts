import { useId } from "react";
import { useState, useCallback } from "react";

// Simple warning utility - replaces @commercetools-uikit/utils warning
export const warning = (condition: boolean, message: string) => {
  if (!condition && process.env.NODE_ENV !== "production") {
    console.warn(message);
  }
};

// Simple isNumberish check - replaces @commercetools-uikit/utils isNumberish
export const isNumberish = (value: string): boolean => {
  if (typeof value !== "string" || value.trim() === "") return false;

  // Allow negative numbers
  const cleaned = value.replace(/[^\d.,-]/g, "");
  if (cleaned === "") return false;

  // Check if it could be parsed as a number (allowing comma as decimal separator)
  const normalized = cleaned.replace(",", ".");
  return !isNaN(parseFloat(normalized)) && isFinite(parseFloat(normalized));
};

// Sequential ID generator - replaces @commercetools-uikit/utils createSequentialId
export const createSequentialId = (prefix: string) => {
  let counter = 0;
  return () => `${prefix}${counter++}`;
};

// Field ID hook - replaces @commercetools-uikit/hooks useFieldId
export const useFieldId = (
  providedId?: string,
  sequentialId?: () => string
): string => {
  const autoId = useId();

  if (providedId) {
    return providedId;
  }

  if (sequentialId) {
    return sequentialId();
  }

  return autoId;
};

// Toggle state hook - replaces @commercetools-uikit/hooks useToggleState
export const useToggleState = (initialValue: boolean = false) => {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback((newValue?: boolean) => {
    setState((prevState) => (newValue !== undefined ? newValue : !prevState));
  }, []);

  return [state, toggle] as const;
};

// Filter data attributes - replaces @commercetools-uikit/utils filterDataAttributes
export const filterDataAttributes = (props: Record<string, any>) => {
  const dataAttributes: Record<string, any> = {};

  Object.keys(props).forEach((key) => {
    if (key.startsWith("data-") || key.startsWith("aria-")) {
      dataAttributes[key] = props[key];
    }
  });

  return dataAttributes;
};
