import { defineIllustration } from "@/illustration-kit";

/** Prop name and value widths, one row per prop. */
const PROPS = [
  [7, 9],
  [5, 7],
  [8, 6],
];

export default defineIllustration({
  name: "style-props",
  draw: ({ panel, pill, dashed, stroke, icons }) => [
    // the props, as name and value
    panel({ x: 10, y: 30, w: 32, h: 36, radius: "200" }),
    ...PROPS.flatMap(([name, value], i) => [
      pill({ x: 16, y: 36.5 + i * 10, w: name, fill: "text" }),
      pill({ x: 27, y: 36.5 + i * 10, w: value, fill: "strong" }),
    ]),
    stroke(icons.arrowRight(48, 48), { color: "icon", w: 1 }),
    // the element they change: background, padding, corner radius
    panel({ x: 54, y: 32, w: 32, h: 32, radius: "300", tone: "strong" }),
    dashed({ x: 59, y: 37, w: 22, h: 22, radius: "100", color: "onStrong" }),
    pill({ x: 63, y: 46.5, w: 14, fill: "onStrong" }),
  ],
});
