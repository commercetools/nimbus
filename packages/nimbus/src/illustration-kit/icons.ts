import type { Box } from "./fragment";
import { num } from "./fragment";

/** A stroke path together with its bounds. */
export type Path = { d: string; box: Box };

/** Build a custom stroke path. `box` is the area the path covers. */
export const shape = (d: string, box: Box): Path => ({ d, box });

const at = (cx: number, cy: number, hw: number, hh: number): Box => ({
  x1: cx - hw,
  y1: cy - hh,
  x2: cx + hw,
  y2: cy + hh,
});

/** Line icons, centered on (cx, cy), drawn with a round-capped stroke. */
export const icons = {
  check: (cx: number, cy: number, s = 1): Path =>
    shape(
      `M${num(cx - 2 * s)},${num(cy)} l${num(1.4 * s)},${num(1.4 * s)} l${num(2.6 * s)},${num(-2.8 * s)}`,
      at(cx, cy, 2 * s, 1.4 * s)
    ),
  chevronLeft: (cx: number, cy: number): Path =>
    shape(`M${num(cx + 1)},${num(cy - 2)} l-2,2 l2,2`, at(cx, cy, 1, 2)),
  chevronRight: (cx: number, cy: number): Path =>
    shape(`M${num(cx - 1)},${num(cy - 2)} l2,2 l-2,2`, at(cx, cy, 1, 2)),
  chevronDown: (cx: number, cy: number): Path =>
    shape(`M${num(cx - 2)},${num(cy - 1)} l2,2 l2,-2`, at(cx, cy, 2, 1)),
  chevronUp: (cx: number, cy: number): Path =>
    shape(`M${num(cx - 2)},${num(cy + 1)} l2,-2 l2,2`, at(cx, cy, 2, 1)),
  close: (cx: number, cy: number, s = 1): Path =>
    shape(
      `M${num(cx - 2 * s)},${num(cy - 2 * s)} l${num(4 * s)},${num(4 * s)} m${num(-4 * s)},0 l${num(4 * s)},${num(-4 * s)}`,
      at(cx, cy, 2 * s, 2 * s)
    ),
  plus: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 2)},${num(cy)} h4 M${num(cx)},${num(cy - 2)} v4`,
      at(cx, cy, 2, 2)
    ),
  /** Calendar, 10 wide and 8 high. */
  calendar: (cx: number, cy: number): Path => {
    const x = cx - 4.5;
    const y = cy - 3.5;
    return shape(
      `M${num(x + 1)},${num(y + 1.25)} h7 a1,1 0 0 1 1,1 v5.5 a1,1 0 0 1 -1,1 h-7 a1,1 0 0 1 -1,-1 v-5.5 a1,1 0 0 1 1,-1 Z M${num(x)},${num(y + 3.75)} h9 M${num(x + 2.5)},${num(y)} v2.5 M${num(x + 6.5)},${num(y)} v2.5`,
      at(cx, cy, 4.5, 4)
    );
  },
  /** Eye, 7 wide and 4.5 high. */
  eye: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 3.5)},${num(cy)} Q${num(cx)},${num(cy - 4.5)} ${num(cx + 3.5)},${num(cy)} Q${num(cx)},${num(cy + 4.5)} ${num(cx - 3.5)},${num(cy)} Z`,
      at(cx, cy, 3.5, 2.25)
    ),
  /** The slash across an eye. */
  slash: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 3.5)},${num(cy + 3.5)} L${num(cx + 3.5)},${num(cy - 3.5)}`,
      at(cx, cy, 3.5, 3.5)
    ),
  /** Globe, 10 wide and 10 high. */
  globe: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 5)},${num(cy)} a5,5 0 1 0 10,0 a5,5 0 1 0 -10,0 Z M${num(cx - 5)},${num(cy)} h10 M${num(cx)},${num(cy - 5)} q-3,5 0,10 M${num(cx)},${num(cy - 5)} q3,5 0,10`,
      at(cx, cy, 5, 5)
    ),
  /** Code brackets `</>`, 12 wide and 6 high. */
  code: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 3)},${num(cy - 3)} l-3,3 l3,3 M${num(cx + 3)},${num(cy - 3)} l3,3 l-3,3 M${num(cx + 1)},${num(cy - 3.5)} l-2,7`,
      at(cx, cy, 6, 3.5)
    ),

  minus: (cx: number, cy: number): Path =>
    shape(`M${num(cx - 2)},${num(cy)} h4`, at(cx, cy, 2, 0)),
  arrowRight: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 3)},${num(cy)} h6 M${num(cx + 1)},${num(cy - 2.5)} l2.5,2.5 l-2.5,2.5`,
      at(cx, cy, 3.5, 2.5)
    ),
  /** Magnifier, 8 wide and 8 high. */
  search: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 4)},${num(cy - 1)} a3,3 0 1 0 6,0 a3,3 0 1 0 -6,0 Z M${num(cx + 1.2)},${num(cy + 1.2)} l2.8,2.8`,
      at(cx, cy, 4, 4)
    ),
  /** Clock, 9 wide and 9 high. */
  clock: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 4.5)},${num(cy)} a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0 Z M${num(cx)},${num(cy - 2.5)} V${num(cy)} h2`,
      at(cx, cy, 4.5, 4.5)
    ),
  /** Coin with a currency mark, 9 wide and 9 high. */
  coin: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 4.5)},${num(cy)} a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0 Z M${num(cx + 1.5)},${num(cy - 1.8)} h-2.2 a1,1 0 0 0 0,1.8 h1.4 a1,1 0 0 1 0,1.8 h-2.2 M${num(cx)},${num(cy - 2.8)} v5.6`,
      at(cx, cy, 4.5, 4.5)
    ),
  /** Resize grip for the corner of a text area. */
  resize: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx + 3)},${num(cy - 2)} L${num(cx - 2)},${num(cy + 3)} M${num(cx + 3)},${num(cy + 1)} L${num(cx)},${num(cy + 3)}`,
      at(cx, cy, 3, 3)
    ),
  /** Warning triangle, 9 wide and 8 high. */
  warning: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx)},${num(cy - 4)} L${num(cx + 4.5)},${num(cy + 4)} H${num(cx - 4.5)} Z M${num(cx)},${num(cy - 1)} v2 M${num(cx)},${num(cy + 2.4)} h0.01`,
      at(cx, cy, 4.5, 4)
    ),
  /** Info circle, 9 wide and 9 high. */
  info: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 4.5)},${num(cy)} a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0 Z M${num(cx)},${num(cy)} v2.5 M${num(cx)},${num(cy - 2.2)} h0.01`,
      at(cx, cy, 4.5, 4.5)
    ),
  /** Five-point star, about 9 wide. */
  star: (cx: number, cy: number): Path => {
    const points = Array.from({ length: 10 }, (_, i) => {
      const radius = i % 2 === 0 ? 4.5 : 1.9;
      const angle = (-90 + i * 36) * (Math.PI / 180);
      return `${num(cx + radius * Math.cos(angle))},${num(cy + radius * Math.sin(angle))}`;
    });
    return shape(`M${points.join(" L")} Z`, at(cx, cy, 4.3, 4.3));
  },
  /** Arrow up out of a tray, 8 wide and 8 high. */
  upload: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx)},${num(cy + 1)} V${num(cy - 3.5)} M${num(cx - 2.5)},${num(cy - 1)} l2.5,-2.5 l2.5,2.5 M${num(cx - 4)},${num(cy + 4)} h8`,
      at(cx, cy, 4, 4)
    ),
  /** Hills for an image, 12 wide and 7 high. */
  mountains: (cx: number, cy: number): Path =>
    shape(
      `M${num(cx - 6)},${num(cy + 3.5)} L${num(cx - 1)},${num(cy - 3.5)} L${num(cx + 2)},${num(cy + 0.5)} L${num(cx + 4)},${num(cy - 1.5)} L${num(cx + 6)},${num(cy + 3.5)} Z`,
      at(cx, cy, 6, 3.5)
    ),
};
