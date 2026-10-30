import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "number-input-field",
  draw: ({ panel, pill, line, stroke, icons }) => [
    pill({ x: 16, y: 30, w: 24, fill: "textStrong" }),
    panel({ x: 16, y: 38, w: 64, h: 16, radius: "200" }),
    stroke(icons.minus(24, 46), { color: "icon", w: 1 }),
    line({ x1: 31, y1: 42, x2: 31, y2: 50 }),
    pill({ x: 38, y: 44.5, w: 20, fill: "textStrong" }),
    line({ x1: 65, y1: 42, x2: 65, y2: 50 }),
    stroke(icons.plus(72, 46), { color: "icon", w: 1 }),
    pill({ x: 16, y: 60, w: 36, fill: "onBg" }),
  ],
});
