import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "time-input",
  draw: ({ panel, pill, dot, stroke, icons }) => [
    panel({ x: 16, y: 40, w: 64, h: 16, radius: "200" }),
    pill({ x: 24, y: 46.5, w: 12, fill: "textStrong" }),
    dot({ cx: 42, cy: 46.5, r: 0.9, fill: "icon" }),
    dot({ cx: 42, cy: 49.5, r: 0.9, fill: "icon" }),
    pill({ x: 48, y: 46.5, w: 12, fill: "textStrong" }),
    stroke(icons.clock(72, 48), { color: "icon", w: 0.85 }),
  ],
});
