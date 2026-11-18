import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "group",
  draw: ({ dashed, panel, pill, line, stroke, icons }) => [
    dashed({ x: 12, y: 32, w: 72, h: 32, radius: "300", color: "icon" }),
    panel({ x: 20, y: 40, w: 56, h: 16, radius: "200" }),
    pill({ x: 26, y: 46.5, w: 24, fill: "text" }),
    line({ x1: 62, y1: 40, x2: 62, y2: 56 }),
    stroke(icons.plus(69, 48), { color: "icon", w: 1 }),
  ],
});
