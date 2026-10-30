import {
  createFragment,
  flatten,
  num,
  unionBox,
  type Box,
  type Fragment,
  type FragmentList,
} from "./fragment";
import { icons, shape, type Path } from "./icons";
import { paint, type FillRole, type Role } from "./roles";
import { RADII, type RadiusToken } from "./tokens";

/** A Nimbus radius token from the component's recipe, or a capsule. */
export type Radius = RadiusToken | "full";

type Rect = { x: number; y: number; w: number; h: number };

const rectBox = ({ x, y, w, h }: Rect): Box => ({
  x1: x,
  y1: y,
  x2: x + w,
  y2: y + h,
});

const cornerRadius = (radius: Radius, { w, h }: Rect) =>
  radius === "full" ? Math.min(w, h) / 2 : RADII[radius];

/**
 * Builds the drawing primitives for one illustration. `prefix` (`il-<name>`)
 * names the filter used for shadows, so ids stay unique per file.
 */
export const createPrimitives = (prefix: string) => {
  const shadow = ` filter="url(#${prefix}-shadow)"`;

  /** Several fragments as one. */
  const group = (...parts: FragmentList): Fragment => {
    const fragments = flatten(parts);
    return createFragment(
      fragments.map((f) => f.markup).join("\n  "),
      unionBox(fragments.map((f) => f.box)),
      fragments.flatMap((f) => f.panels)
    );
  };

  /**
   * Panel. `tone: "surface"` is a card with a thin stroke, `"strong"` is the
   * active or primary element. `radius` is the recipe's `borderRadius` token.
   */
  const panel = (
    props: Rect & {
      radius: Radius;
      tone?: FillRole;
      shadow?: boolean;
    }
  ): Fragment => {
    const { tone = "surface", shadow: shadowed = true } = props;
    const geometry = `x="${num(props.x)}" y="${num(props.y)}" width="${num(props.w)}" height="${num(props.h)}" rx="${num(cornerRadius(props.radius, props))}"`;
    const stroke =
      tone === "surface"
        ? ` stroke="${paint("surfaceStroke")}" stroke-width="0.5"`
        : "";
    return createFragment(
      `<rect ${geometry} fill="${paint(tone)}"${stroke}${shadowed ? shadow : ""}/>`,
      rectBox(props),
      [{ w: props.w, h: props.h }]
    );
  };

  /** Speech bubble with a tail centered on the bottom edge. */
  const bubble = (
    props: Rect & { radius: RadiusToken; tail?: number }
  ): Fragment => {
    const { x, y, w, h, tail = 4 } = props;
    const r = RADII[props.radius];
    const cx = x + w / 2;
    const b = y + h;
    const d = [
      `M${num(x + r)},${num(y)}`,
      `H${num(x + w - r)}`,
      `A${num(r)},${num(r)} 0 0 1 ${num(x + w)},${num(y + r)}`,
      `V${num(b - r)}`,
      `A${num(r)},${num(r)} 0 0 1 ${num(x + w - r)},${num(b)}`,
      `H${num(cx + tail)}`,
      `L${num(cx)},${num(b + tail)}`,
      `L${num(cx - tail)},${num(b)}`,
      `H${num(x + r)}`,
      `A${num(r)},${num(r)} 0 0 1 ${num(x)},${num(b - r)}`,
      `V${num(y + r)}`,
      `A${num(r)},${num(r)} 0 0 1 ${num(x + r)},${num(y)}`,
      "Z",
    ].join(" ");
    return createFragment(
      `<path d="${d}" fill="${paint("strong")}"${shadow}/>`,
      { x1: x, y1: y, x2: x + w, y2: b + tail },
      [{ w, h }]
    );
  };

  /** Plain rectangle without shadow or stroke. */
  const rect = (
    props: Rect & { fill: FillRole; radius?: Radius }
  ): Fragment => {
    const rx = props.radius
      ? ` rx="${num(cornerRadius(props.radius, props))}"`
      : "";
    return createFragment(
      `<rect x="${num(props.x)}" y="${num(props.y)}" width="${num(props.w)}" height="${num(props.h)}"${rx} fill="${paint(props.fill)}"/>`,
      rectBox(props)
    );
  };

  /** Background band for a selected row or a date range. */
  const band = (props: Rect): Fragment => rect({ ...props, fill: "tint" });

  /** Text placeholder: a bar with round ends. */
  const pill = (props: {
    x: number;
    y: number;
    w: number;
    h?: number;
    fill: FillRole;
  }): Fragment => {
    const h = props.h ?? 3;
    return createFragment(
      `<rect x="${num(props.x)}" y="${num(props.y)}" width="${num(props.w)}" height="${num(h)}" rx="${num(h / 2)}" fill="${paint(props.fill)}"/>`,
      rectBox({ ...props, h })
    );
  };

  /** Circle, filled, outlined or both. */
  const circle = (props: {
    cx: number;
    cy: number;
    r: number;
    fill?: FillRole;
    stroke?: Role;
    w?: number;
  }): Fragment => {
    const fill = props.fill ? paint(props.fill) : "none";
    const stroke = props.stroke
      ? ` stroke="${paint(props.stroke)}" stroke-width="${num(props.w ?? 0.85)}"`
      : "";
    return createFragment(
      `<circle cx="${num(props.cx)}" cy="${num(props.cy)}" r="${num(props.r)}" fill="${fill}"${stroke}/>`,
      {
        x1: props.cx - props.r,
        y1: props.cy - props.r,
        x2: props.cx + props.r,
        y2: props.cy + props.r,
      }
    );
  };

  const dot = (props: { cx: number; cy: number; r?: number; fill: FillRole }) =>
    circle({ ...props, r: props.r ?? 2 });

  /** Thin separator line. */
  const line = (props: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }): Fragment =>
    createFragment(
      `<line x1="${num(props.x1)}" y1="${num(props.y1)}" x2="${num(props.x2)}" y2="${num(props.y2)}" stroke="${paint("line")}" stroke-width="0.5"/>`,
      {
        x1: Math.min(props.x1, props.x2),
        y1: Math.min(props.y1, props.y2),
        x2: Math.max(props.x1, props.x2),
        y2: Math.max(props.y1, props.y2),
      }
    );

  /** Line icon drawn with a round-capped stroke. Get paths from `icons`. */
  const stroke = (path: Path, props: { color: Role; w?: number }): Fragment =>
    createFragment(
      `<path d="${path.d}" fill="none" stroke="${paint(props.color)}" stroke-width="${num(props.w ?? 1)}" stroke-linecap="round" stroke-linejoin="round"/>`,
      path.box
    );

  /** Dashed outline: a guide, a hidden or collapsed area. */
  const dashed = (props: Rect & { radius: Radius; color: Role }): Fragment =>
    createFragment(
      `<rect x="${num(props.x)}" y="${num(props.y)}" width="${num(props.w)}" height="${num(props.h)}" rx="${num(cornerRadius(props.radius, props))}" fill="none" stroke="${paint(props.color)}" stroke-width="0.75" stroke-dasharray="2 1.5"/>`,
      rectBox(props)
    );

  /** Mouse pointer with its tip at (x, y). It is not part of the geometry checks. */
  const cursor = (props: { x: number; y: number }): Fragment => {
    const { x, y } = props;
    return createFragment(
      `<path d="M${num(x)},${num(y)} v12 l3,-2.75 l2.25,5 l2,-0.9 l-2.25,-4.85 h4.25 Z" fill="${paint("cursor")}" stroke="${paint("cursorStroke")}" stroke-width="0.6" stroke-linejoin="round"${shadow}/>`,
      null
    );
  };

  /** Checkbox, 5 units wide by default, with its top-left corner at (x, y). */
  const checkbox = (props: {
    x: number;
    y: number;
    size?: number;
    checked?: boolean;
  }): Fragment => {
    const size = props.size ?? 5;
    const box = { x: props.x, y: props.y, w: size, h: size };
    const mid = size / 2;
    return props.checked
      ? group(
          rect({ ...box, fill: "strong", radius: "50" }),
          stroke(icons.check(props.x + mid, props.y + mid, 0.6), {
            color: "onStrong",
            w: 0.75,
          })
        )
      : createFragment(
          `<rect x="${num(box.x)}" y="${num(box.y)}" width="${num(size)}" height="${num(size)}" rx="${num(RADII["50"])}" fill="none" stroke="${paint("text")}" stroke-width="0.6"/>`,
          rectBox(box)
        );
  };

  /** Empty input: a surface panel with a text placeholder inside. */
  const field = (props: {
    x: number;
    y: number;
    w: number;
    h?: number;
    radius?: Radius;
    text?: number;
  }): Fragment => {
    const h = props.h ?? 12;
    return group(
      panel({
        x: props.x,
        y: props.y,
        w: props.w,
        h,
        radius: props.radius ?? "200",
      }),
      pill({
        x: props.x + 5,
        y: props.y + h / 2 - 1.5,
        w: props.text ?? Math.round(props.w / 3),
        fill: "text",
      })
    );
  };

  /** List row without a panel: icon dot, text bar and chevron. */
  const listRow = (props: {
    x: number;
    y: number;
    w: number;
    h?: number;
    text?: number;
  }): Fragment => {
    const h = props.h ?? 12;
    const cy = props.y + h / 2;
    return group(
      dot({ cx: props.x + 6, cy, r: 2, fill: "icon" }),
      pill({
        x: props.x + 12,
        y: cy - 1.5,
        w: props.text ?? props.w - 30,
        fill: "text",
      }),
      stroke(icons.chevronRight(props.x + props.w - 5, cy), {
        color: "icon",
        w: 0.75,
      })
    );
  };

  return {
    group,
    panel,
    bubble,
    rect,
    band,
    pill,
    circle,
    dot,
    line,
    stroke,
    dashed,
    cursor,
    checkbox,
    field,
    listRow,
    icons,
    shape,
  };
};

export type Kit = ReturnType<typeof createPrimitives>;
