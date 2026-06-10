import { useCallback } from "react";
import type { KeyboardEvent } from "react";
import { useSplitterContext } from "./use-splitter-context";

type UseHandleKeyboardOptions = {
  /** True once both panes are registered. */
  isReady: boolean;
  /**
   * Clamped size writer from `useHandleResize`. Already a no-op while disabled
   * or collapse-locked, so the arrow / Home / End cases need no extra guard.
   */
  applyDelta: (delta: number, commit: boolean) => void;
};

/**
 * Owns the handle's keyboard model (W3C window splitter): orientation-aware
 * arrow keys move by `keyboardStep`, Home/End jump to min/max, Enter toggles
 * the aside's collapse. Each keypress commits (settled), unlike a live drag tick.
 *
 * Δ is expressed as "grow the leading pane"; `useHandleResize` translates it to
 * an aside Δ. Collapse is aside-only, so Enter simply toggles the boolean.
 */
export const useHandleKeyboard = ({
  isReady,
  applyDelta,
}: UseHandleKeyboardOptions) => {
  const {
    orientation,
    keyboardStep,
    isDisabled,
    collapsed,
    setCollapsed,
    asideConfig,
  } = useSplitterContext();

  const toggleCollapse = useCallback(() => {
    if (!isReady || isDisabled) return;
    // If collapsed, Enter expands; otherwise collapse the aside (when allowed).
    if (collapsed) {
      setCollapsed(false);
      return;
    }
    if (asideConfig.collapsible) setCollapsed(true);
  }, [isReady, isDisabled, collapsed, asideConfig.collapsible, setCollapsed]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isReady || isDisabled) return;
      switch (event.key) {
        case "ArrowLeft":
          if (orientation === "horizontal") {
            event.preventDefault();
            applyDelta(-keyboardStep, true);
          }
          return;
        case "ArrowRight":
          if (orientation === "horizontal") {
            event.preventDefault();
            applyDelta(keyboardStep, true);
          }
          return;
        case "ArrowUp":
          if (orientation === "vertical") {
            event.preventDefault();
            applyDelta(-keyboardStep, true);
          }
          return;
        case "ArrowDown":
          if (orientation === "vertical") {
            event.preventDefault();
            applyDelta(keyboardStep, true);
          }
          return;
        case "Home":
          event.preventDefault();
          applyDelta(-100, true);
          return;
        case "End":
          event.preventDefault();
          applyDelta(100, true);
          return;
        case "Enter":
          event.preventDefault();
          toggleCollapse();
          return;
      }
    },
    [isReady, isDisabled, orientation, keyboardStep, applyDelta, toggleCollapse]
  );

  return { onKeyDown };
};
