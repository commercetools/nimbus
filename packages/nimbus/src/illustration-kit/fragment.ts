/**
 * A piece of drawing. Only the kit creates fragments, so a hand-written
 * markup string does not typecheck where a fragment is expected.
 */

export type Box = { x1: number; y1: number; x2: number; y2: number };
export type Size = { w: number; h: number };

declare const fragmentBrand: unique symbol;

export type Fragment = {
  readonly [fragmentBrand]: true;
  readonly markup: string;
  /** Shape bounds used by the geometry checks. `null` for the cursor. */
  readonly box: Box | null;
  /** Sizes of panels and bubbles, which must be multiples of 2. */
  readonly panels: readonly Size[];
};

export type FragmentList = readonly (Fragment | readonly Fragment[])[];

export const createFragment = (
  markup: string,
  box: Box | null,
  panels: readonly Size[] = []
): Fragment => ({ markup, box, panels }) as Fragment;

export const unionBox = (boxes: readonly (Box | null)[]): Box | null => {
  const present = boxes.filter((box): box is Box => box !== null);
  if (present.length === 0) return null;
  return {
    x1: Math.min(...present.map((b) => b.x1)),
    y1: Math.min(...present.map((b) => b.y1)),
    x2: Math.max(...present.map((b) => b.x2)),
    y2: Math.max(...present.map((b) => b.y2)),
  };
};

export const flatten = (list: FragmentList): Fragment[] =>
  list.flatMap((item) => ("markup" in item ? [item] : [...item]));

/** Numbers in markup: at most 2 decimals, so float noise never reaches a file. */
export const num = (value: number): string =>
  String(Math.round(value * 100) / 100);
