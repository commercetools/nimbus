import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "token-animations",
  draw: ({ panel, circle, stroke, shape, icons }) => [
    panel({ x: 16, y: 22, w: 64, h: 52, radius: "200" }),
    // an ease curve with a start and an end point
    stroke(
      shape("M26,64 C42,64 42,32 70,32", { x1: 26, y1: 32, x2: 70, y2: 64 }),
      { color: "strong", w: 1.5 }
    ),
    circle({ cx: 26, cy: 64, r: 2.5, fill: "icon" }),
    circle({ cx: 70, cy: 32, r: 2.5, fill: "strong" }),
    stroke(icons.clock(32, 36), { color: "icon", w: 0.85 }),
  ],
});
