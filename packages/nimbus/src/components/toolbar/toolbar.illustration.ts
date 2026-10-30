import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "toolbar",
  draw: ({ panel, rect, line, stroke, icons }) => [
    panel({ x: 12, y: 38, w: 72, h: 20, radius: "200" }),
    rect({ x: 27, y: 42, w: 10, h: 12, fill: "tint", radius: "100" }),
    stroke(icons.plus(22, 48), { color: "icon", w: 1 }),
    stroke(icons.star(32, 48), { color: "icon", w: 0.85 }),
    stroke(icons.search(43, 48), { color: "icon", w: 0.85 }),
    line({ x1: 50, y1: 43, x2: 50, y2: 53 }),
    stroke(icons.clock(58, 48), { color: "icon", w: 0.85 }),
    stroke(icons.check(68, 48), { color: "icon", w: 1 }),
    stroke(icons.chevronDown(77, 48), { color: "icon", w: 0.85 }),
  ],
});
