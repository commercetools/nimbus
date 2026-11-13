import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "number-input",
  draw: ({ panel, pill, line, stroke, icons }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    stroke(icons.minus(24, 48), { color: "icon", w: 1 }),
    line({ x1: 31, y1: 44, x2: 31, y2: 52 }),
    pill({ x: 38, y: 46.5, w: 20, fill: "textStrong" }),
    line({ x1: 65, y1: 44, x2: 65, y2: 52 }),
    stroke(icons.plus(72, 48), { color: "icon", w: 1 }),
  ],
});
