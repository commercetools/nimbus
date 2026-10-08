import { useEffect } from "react";

type UseVirtualizerOptionsWarningOptions = {
  /** Display name used in the warning, for example `"ListBox.Root"`. */
  componentName: string;
  /** The collection's `isVirtualized` prop. */
  isVirtualized: boolean;
  /** Whether the consumer passed `virtualizerOptions`. */
  hasVirtualizerOptions: boolean;
};

/**
 * Development warning for Nimbus collections that support virtualization:
 * `virtualizerOptions` have no effect without `isVirtualized`.
 */
export function useVirtualizerOptionsWarning({
  componentName,
  isVirtualized,
  hasVirtualizerOptions,
}: UseVirtualizerOptionsWarningOptions) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (hasVirtualizerOptions && !isVirtualized) {
      console.warn(
        `[Nimbus Virtualizer] ${componentName} received virtualizerOptions ` +
          `without isVirtualized. The options have no effect until ` +
          `isVirtualized is set.`
      );
    }
  }, [componentName, isVirtualized, hasVirtualizerOptions]);
}
