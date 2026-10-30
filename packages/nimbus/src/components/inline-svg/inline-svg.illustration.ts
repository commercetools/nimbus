import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "inline-svg",
  draw: ({ panel, stroke, icons, dot, rect }) => [
    panel({ x: 16, y: 28, w: 64, h: 40, radius: "300" }),
    stroke(icons.code(36, 48), { color: "icon", w: 1.25 }),
    dot({ cx: 58, cy: 41, r: 4, fill: "strong" }),
    rect({ x: 52, y: 50, w: 16, h: 8, fill: "track", radius: "100" }),
  ],
});
