import { useEffect, useCallback } from "react";
import type { RefObject } from "react";

type UseAutogrowOptions = {
  enabled?: boolean;
};

/**
 * Hook for managing textarea autogrow behavior
 *
 * @param ref - Reference to the textarea element (RefObject<HTMLTextAreaElement | null>)
 * @param options - Configuration options
 * @param options.enabled - Whether autogrow is enabled
 * @returns {void} This hook does not return a value
 *
 * @internal
 */
export function useAutogrow(
  ref: RefObject<HTMLTextAreaElement | null>,
  options: UseAutogrowOptions = {}
): void {
  const { enabled = false } = options;

  const adjustHeight = useCallback(() => {
    const textarea = ref.current;
    if (!textarea || !enabled) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the new height based on content
    const contentHeight = textarea.scrollHeight;

    // Apply maxHeight constraint if specified
    const computedStyle = window.getComputedStyle(textarea);
    const maxHeightPxValue = parseInt(computedStyle.maxHeight, 10);

    // Check if maxHeight is a valid number and apply constraint
    const finalHeight =
      !isNaN(maxHeightPxValue) && maxHeightPxValue > 0
        ? Math.min(contentHeight, maxHeightPxValue)
        : contentHeight;

    // Set the new height
    textarea.style.height = `${finalHeight}px`;
  }, [enabled, ref]);

  // Set up auto-grow behavior with event listeners
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea || !enabled) return;

    // Initial adjustment
    adjustHeight();

    // Add input event listener for real-time adjustments
    const handleInput = () => {
      adjustHeight();
    };

    textarea.addEventListener("input", handleInput);

    // Cleanup
    return () => {
      textarea.removeEventListener("input", handleInput);
    };
  }, [adjustHeight, enabled, ref]);
}
