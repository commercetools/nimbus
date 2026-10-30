import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "image",
  draw: ({ panel, dot, stroke, shape }) => [
    panel({ x: 16, y: 24, w: 64, h: 48, radius: "300" }),
    dot({ cx: 62, cy: 38, r: 4, fill: "strong" }),
    stroke(
      shape("M24,64 L38,46 L48,58 L56,50 L72,64 Z", {
        x1: 24,
        y1: 46,
        x2: 72,
        y2: 64,
      }),
      {
        color: "icon",
        w: 1.25,
      }
    ),
  ],
});
