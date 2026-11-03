const FORWARD = ["ArrowRight", "ArrowDown"];
const BACKWARD = ["ArrowLeft", "ArrowUp"];

/**
 * Index of the item to focus after `key`, or `null` when the key does not move
 * focus. Forward keys are ArrowRight and ArrowDown, backward keys are
 * ArrowLeft and ArrowUp. Home and End go to the first and the last item. At
 * the ends the index wraps around when `wrap` is true, else it stays.
 */
export const nextIndex = (
  current: number,
  key: string,
  length: number,
  wrap: boolean
): number | null => {
  if (length <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  if (FORWARD.includes(key)) {
    return current + 1 < length ? current + 1 : wrap ? 0 : length - 1;
  }
  if (BACKWARD.includes(key)) {
    return current > 0 ? current - 1 : wrap ? length - 1 : 0;
  }
  return null;
};
