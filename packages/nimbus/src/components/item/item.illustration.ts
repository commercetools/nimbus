import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "item",
  draw: ({ panel, dot, pill, stroke, icons }) => [
    panel({ x: 16, y: 38, w: 64, h: 20, radius: "200" }),
    dot({ cx: 27, cy: 48, r: 3.5, fill: "icon" }),
    pill({ x: 37, y: 42.5, w: 28, fill: "textStrong" }),
    pill({ x: 37, y: 49, w: 20, h: 2.5, fill: "text" }),
    stroke(icons.chevronRight(72, 48), { color: "icon", w: 0.85 }),
  ],
});
