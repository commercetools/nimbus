import { useCallback } from "react";
import type { KeyboardEvent } from "react";
import { useSplitterContext } from "./use-splitter-context";
import { pickCollapseTarget } from "../utils";

type UseHandleKeyboardOptions = {
  /** True once both panes are registered. */
  hasPair: boolean;
  /**
   * Clamped size writer from `useHandleResize`. Already a no-op while disabled
   * or collapse-locked, so the arrow / Home / End cases need no extra guard.
   */
  applyDelta: (delta: number, commit: boolean) => void;
};

/**
 * Owns the handle's keyboard model (W3C window splitter): orientation-aware
 * arrow keys move by `keyboardStep`, Home/End jump to min/max, Enter toggles
 * collapse. Each keypress commits (settled), unlike a live drag tick.
 */
export const useHandleKeyboard = ({
  hasPair,
  applyDelta,
}: UseHandleKeyboardOptions) => {
  const {
    orientation,
    keyboardStep,
    isDisabled,
    collapsedPane,
    setCollapsedPane,
    paneOrder,
    sizes,
    getPaneConfig,
  } = useSplitterContext();

  const toggleCollapse = useCallback(() => {
    if (!hasPair || isDisabled) return;
    // If anything is collapsed, Enter expands it; otherwise collapse the pick.
    if (collapsedPane !== null) {
      setCollapsedPane(null);
      return;
    }
    const target = pickCollapseTarget(paneOrder, sizes, getPaneConfig);
    if (target) setCollapsedPane(target.paneId);
  }, [
    hasPair,
    isDisabled,
    collapsedPane,
    paneOrder,
    sizes,
    getPaneConfig,
    setCollapsedPane,
  ]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!hasPair || isDisabled) return;
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
    [hasPair, isDisabled, orientation, keyboardStep, applyDelta, toggleCollapse]
  );

  return { onKeyDown };
};
