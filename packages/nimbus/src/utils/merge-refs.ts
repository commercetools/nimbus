import type { Ref, RefCallback } from "react";

/**
 * Merges multiple refs into a single callback ref.
 * Supports both callback refs and RefObject refs.
 */
export function mergeRefs<T>(
  ...refs: (Ref<T> | undefined | null)[]
): RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T>).current = node;
      }
    }
  };
}
