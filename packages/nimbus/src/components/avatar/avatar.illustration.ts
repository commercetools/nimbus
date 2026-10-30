import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "avatar",
  draw: ({ panel, circle, dot, stroke, shape }) => [
    panel({ x: 28, y: 28, w: 40, h: 40, radius: "full", tone: "strong" }),
    dot({ cx: 48, cy: 43, r: 6, fill: "onStrong" }),
    stroke(shape("M38,62 q10,-12 20,0", { x1: 38, y1: 56, x2: 58, y2: 62 }), {
      color: "onStrong",
      w: 4,
    }),
    circle({
      cx: 63,
      cy: 63,
      r: 4,
      fill: "surface",
      stroke: "textStrong",
      w: 1.5,
    }),
  ],
});
