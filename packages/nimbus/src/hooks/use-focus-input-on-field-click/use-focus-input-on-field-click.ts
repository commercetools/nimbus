import { useEffect, type RefObject } from "react";

/**
 * Focuses the inner input when the user presses down on the surrounding field
 * chrome (leading/trailing icons, padding, or empty space), mirroring the
 * native click-to-focus behavior of a bare `<input>` for composite field
 * components like TextInput and SearchInput.
 *
 * The listener is attached natively to the root element rather than as an
 * `onMouseDown` prop so it never clobbers a consumer-forwarded handler. Using
 * `mousedown` (over `click`) lets us preventDefault before focus moves, avoiding
 * a focus/selection flicker. Clicks on the input itself or on interactive
 * children (e.g. a clear button) are ignored so they keep their own behavior.
 *
 * @param rootRef - Ref to the field's root/wrapper element
 * @param inputRef - Ref to the inner `<input>` to focus
 */
export function useFocusInputOnFieldClick(
  rootRef: RefObject<HTMLElement | null>,
  inputRef: RefObject<HTMLInputElement | null>
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const input = inputRef.current;
      if (!target || !input) return;
      if (target === input || target.closest("button")) return;
      event.preventDefault();
      input.focus();
    };

    root.addEventListener("mousedown", handleMouseDown);
    return () => {
      root.removeEventListener("mousedown", handleMouseDown);
    };
  }, [rootRef, inputRef]);
}
