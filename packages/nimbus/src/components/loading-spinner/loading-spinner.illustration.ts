import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "loading-spinner",
  draw: ({ circle, stroke, shape }) => [
    circle({ cx: 48, cy: 48, r: 14, stroke: "track", w: 4 }),
    stroke(
      shape("M48,34 A14,14 0 0 1 62,48", { x1: 48, y1: 34, x2: 62, y2: 48 }),
      {
        color: "strong",
        w: 4,
      }
    ),
  ],
});
