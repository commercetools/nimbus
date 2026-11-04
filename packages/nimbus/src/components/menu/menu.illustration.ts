import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "menu",
  draw: ({ panel, rect, pill, line, stroke, icons }) => [
    panel({ x: 24, y: 20, w: 28, h: 12, radius: "200", tone: "strong" }),
    pill({ x: 30, y: 24.5, w: 10, fill: "onStrong" }),
    stroke(icons.chevronDown(46, 26), { color: "onStrong", w: 0.85 }),
    panel({ x: 24, y: 36, w: 48, h: 40, radius: "200" }),
    rect({ x: 26, y: 38, w: 44, h: 10, fill: "tint", radius: "100" }),
    pill({ x: 31, y: 41.5, w: 20, fill: "textStrong" }),
    pill({ x: 31, y: 52.5, w: 24, fill: "text" }),
    line({ x1: 28, y1: 59, x2: 68, y2: 59 }),
    pill({ x: 31, y: 64, w: 18, fill: "text" }),
  ],
});
