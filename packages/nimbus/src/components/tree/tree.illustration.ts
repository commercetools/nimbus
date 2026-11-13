import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "tree",
  draw: ({ panel, pill, dot, line, stroke, icons }) => [
    panel({ x: 16, y: 20, w: 64, h: 56, radius: "300" }),
    stroke(icons.chevronDown(26, 30), { color: "icon", w: 0.85 }),
    pill({ x: 32, y: 28.5, w: 24, fill: "textStrong" }),
    line({ x1: 26, y1: 35, x2: 26, y2: 54 }),
    dot({ cx: 34, cy: 42, r: 1.5, fill: "icon" }),
    pill({ x: 40, y: 40.5, w: 20, fill: "text" }),
    stroke(icons.chevronRight(34, 54), { color: "icon", w: 0.85 }),
    pill({ x: 40, y: 52.5, w: 24, fill: "text" }),
    stroke(icons.chevronRight(26, 66), { color: "icon", w: 0.85 }),
    pill({ x: 32, y: 64.5, w: 28, fill: "textStrong" }),
  ],
});
